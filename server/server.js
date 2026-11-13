const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { Server } = require("socket.io");
const { createRoomManager } = require("./roomManager");
const { createMatchManager } = require("./matchManager");

const DEFAULT_PORT = Number(process.env.RELAY_PORT || process.env.PORT || 4000);
const CLIENT_BUILD_DIR = path.resolve(__dirname, "../client/build");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function scoreIpv4Candidate(ifaceName, address) {
  let score = 0;
  const lower = (ifaceName || "").toLowerCase();

  if (lower.includes("wi-fi") || lower.includes("wifi") || lower.includes("wlan")) {
    score += 50;
  } else if (lower.includes("ethernet")) {
    score += 40;
  }

  if (
    lower.includes("vethernet") ||
    lower.includes("wsl") ||
    lower.includes("hyper-v") ||
    lower.includes("virtual") ||
    lower.includes("vbox") ||
    lower.includes("vmware") ||
    lower.includes("docker") ||
    lower.includes("tailscale") ||
    lower.includes("zerotier") ||
    lower.includes("hamachi")
  ) {
    score -= 80;
  }

  if (address.startsWith("192.168.")) score += 30;
  else if (address.startsWith("10.")) score += 20;
  else if (/^172\.(1[6-9]|2\d|3[01])\./.test(address)) score += 10;

  return score;
}

function getLanIPv4Addresses() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [ifaceName, entries] of Object.entries(interfaces)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!entry || entry.internal) continue;
      if (entry.family !== "IPv4" && entry.family !== 4) continue;
      if (!entry.address || entry.address.startsWith("169.254.")) continue;
      candidates.push({
        address: entry.address,
        ifaceName,
        score: scoreIpv4Candidate(ifaceName, entry.address),
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return [...new Set(candidates.map((item) => item.address))];
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(JSON.stringify(payload));
}

function serveStaticBuild(reqUrl, res) {
  if (!fs.existsSync(path.join(CLIENT_BUILD_DIR, "index.html"))) {
    return false;
  }
  let cleanPath = "/";
  try {
    cleanPath = decodeURIComponent((reqUrl || "/").split("?")[0]);
  } catch {
    return false;
  }

  const relativePath = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
  const resolved = path.resolve(CLIENT_BUILD_DIR, relativePath);
  if (resolved !== CLIENT_BUILD_DIR && !resolved.startsWith(CLIENT_BUILD_DIR + path.sep)) {
    return false;
  }

  let filePath = resolved;
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // Only fall back to index.html for navigation routes without file extension
    if (path.extname(relativePath)) {
      return false;
    }
    filePath = path.join(CLIENT_BUILD_DIR, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

function normalizePairToken(rawToken) {
  if (typeof rawToken !== "string") return "default";
  const cleaned = rawToken.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  return cleaned || "default";
}

function pairChannel(pairToken) {
  return `pair:${pairToken}`;
}

function roomChannel(roomId) {
  return `room:${roomId}`;
}

function replyAck(ack, payload) {
  if (typeof ack === "function") {
    try {
      ack(payload);
    } catch (err) {
      console.error("[Relay] Ack error:", err);
    }
  }
}

function startRelayServer(port = DEFAULT_PORT, options = {}) {
  const controllerIds = new Set();
  const gameIds = new Set();
  const socketMeta = new Map();

  let io = null;

  const matchManager = createMatchManager({
    getIo: () => io,
  });

  const roomManager = createRoomManager({
    disconnectGraceMs: options.disconnectGraceMs ?? 20000,
    onRoomUpdated: (room) => {
      if (io) {
        io.to(roomChannel(room.roomId)).emit("room:state", room);
      }
    },
    onCountdownTick: (room, remainingSec) => {
      if (io) {
        io.to(roomChannel(room.roomId)).emit("room:countdown", {
          roomId: room.roomId,
          remainingSec,
          totalSec: room.config.countdownSec,
        });
      }
    },
    onMatchStarted: (room, matchManifest) => {
      const match = matchManager.initMatch({
        roomId: room.roomId,
        matchId: matchManifest.matchId,
        matchManifest,
        config: room.config,
      });
      if (io) {
        io.to(roomChannel(room.roomId)).emit("match:started", {
          room,
          matchManifest,
          matchId: match.matchId,
        });
      }
    },
  });

  const httpServer = http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    const reqPath = (req.url || "/").split("?")[0];
    if (reqPath.startsWith("/socket.io")) {
      return;
    }

    if (reqPath === "/api/health") {
      const ips = getLanIPv4Addresses();
      const addr = httpServer.address();
      sendJson(res, 200, {
        ok: true,
        port: typeof addr === "object" && addr ? addr.port : port,
        controllers: controllerIds.size,
        games: gameIds.size,
        rooms: roomManager.listRoomsSummary().length,
        primaryIp: ips[0] || null,
        ips,
      });
      return;
    }

    if (reqPath === "/api/network-info") {
      const ips = getLanIPv4Addresses();
      const addr = httpServer.address();
      sendJson(res, 200, {
        ips,
        primaryIp: ips[0] || null,
        port: typeof addr === "object" && addr ? addr.port : port,
      });
      return;
    }

    if (reqPath === "/api/rooms") {
      sendJson(res, 200, {
        ok: true,
        rooms: roomManager.listRoomsSummary(),
      });
      return;
    }

    if (reqPath.startsWith("/api/rooms/")) {
      const codeOrId = decodeURIComponent(reqPath.slice("/api/rooms/".length));
      const preview = roomManager.getRoomPreview(codeOrId);
      if (!preview) {
        sendJson(res, 404, { ok: false, error: "ROOM_NOT_FOUND", message: "Room not found." });
        return;
      }
      sendJson(res, 200, { ok: true, room: preview });
      return;
    }

    if (serveStaticBuild(req.url, res)) {
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  });

  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    allowEIO3: true,
    pingTimeout: 12000,
    pingInterval: 5000,
  });

  function ensureMeta(socket) {
    let meta = socketMeta.get(socket.id);
    if (!meta) {
      meta = {
        role: null,
        pairToken: "default",
        playerId: null,
        playerName: null,
      };
      socketMeta.set(socket.id, meta);
      socket.join(pairChannel(meta.pairToken));
    }
    return meta;
  }

  function setSocketPairToken(socket, nextToken) {
    const meta = ensureMeta(socket);
    const clean = normalizePairToken(nextToken);
    if (meta.pairToken !== clean) {
      socket.leave(pairChannel(meta.pairToken));
      meta.pairToken = clean;
      socket.join(pairChannel(clean));
    } else {
      socket.join(pairChannel(clean));
    }
    return meta.pairToken;
  }

  function getActiveGamePairs() {
    const pairs = [];
    for (const gid of gameIds) {
      const m = socketMeta.get(gid);
      if (m && m.pairToken) {
        pairs.push(m.pairToken);
      }
    }
    return [...new Set(pairs)];
  }

  function resolveControllerTarget(controllerPairToken) {
    const activePairs = getActiveGamePairs();
    if (activePairs.includes(controllerPairToken)) {
      return { targetPair: controllerPairToken, linked: true, activePairs };
    }
    if (
      activePairs.length === 1 ||
      (controllerPairToken === "default" && activePairs.length > 0)
    ) {
      // Auto-bind only for a single active game or a bare controller URL without an explicit pair token
      return { targetPair: activePairs[activePairs.length - 1], linked: true, activePairs };
    }
    return { targetPair: controllerPairToken, linked: false, activePairs };
  }

  function notifyAllControllersPairStatus() {
    const activePairs = getActiveGamePairs();
    for (const cid of controllerIds) {
      const cMeta = socketMeta.get(cid);
      const targetSocket = io.sockets.sockets.get(cid);
      if (!cMeta || !targetSocket) continue;
      const resolved = resolveControllerTarget(cMeta.pairToken);
      if (resolved.targetPair) {
        targetSocket.join(pairChannel(resolved.targetPair));
      }
      targetSocket.emit("controller:pair-status", {
        linked: resolved.linked,
        pairToken: resolved.targetPair,
        activeGames: activePairs.length,
        availablePairs: activePairs,
      });
    }
  }

  function countControllersForPair(gamePairToken) {
    const activePairs = getActiveGamePairs();
    const allowDefaultFallback = activePairs.length <= 1;
    let count = 0;
    for (const meta of socketMeta.values()) {
      if (meta.role !== "controller") continue;
      if (
        meta.pairToken === gamePairToken ||
        (allowDefaultFallback && meta.pairToken === "default")
      ) {
        count += 1;
      }
    }
    return count;
  }

  function broadcastPairControllerStatus(pairToken, excludeSocket = null) {
    const resolved = resolveControllerTarget(pairToken);
    const targetPair = resolved.targetPair;
    const count = countControllersForPair(targetPair);
    const payload = {
      connected: count > 0,
      count,
      pairToken: targetPair,
    };
    const channel = pairChannel(targetPair);
    if (excludeSocket) {
      excludeSocket.to(channel).emit("controller:status", payload);
    } else {
      io.to(channel).emit("controller:status", payload);
    }
  }

  function markController(socket, requestedPairToken = null) {
    const meta = ensureMeta(socket);
    if (requestedPairToken) {
      setSocketPairToken(socket, requestedPairToken);
    }
    const resolved = resolveControllerTarget(meta.pairToken);
    if (resolved.targetPair && resolved.targetPair !== meta.pairToken) {
      socket.join(pairChannel(resolved.targetPair));
    }
    const changed = meta.role !== "controller" || !controllerIds.has(socket.id);
    meta.role = "controller";
    gameIds.delete(socket.id);
    controllerIds.add(socket.id);
    if (changed) {
      broadcastPairControllerStatus(meta.pairToken, socket);
      socket.emit("controller:pair-status", {
        linked: resolved.linked,
        pairToken: resolved.targetPair,
        activeGames: resolved.activePairs.length,
        availablePairs: resolved.activePairs,
      });
    }
    return meta;
  }

  function syncSocketLobbyChannel(socket, activeRoomId = null) {
    for (const joined of Array.from(socket.rooms)) {
      if (joined.startsWith("room:") && joined !== roomChannel(activeRoomId || "")) {
        socket.leave(joined);
      }
    }
    if (activeRoomId) {
      socket.join(roomChannel(activeRoomId));
    }
  }

  io.on("connection", (socket) => {
    ensureMeta(socket);
    console.log(`[Controller Relay] Connected: ${socket.id}`);

    socket.on("client:register", (regPayload) => {
      const isObj = regPayload && typeof regPayload === "object";
      const role = isObj ? regPayload.role : regPayload;
      const pairToken = isObj ? regPayload.pairToken : null;
      const playerId = isObj && typeof regPayload.playerId === "string" ? regPayload.playerId : null;
      const playerName =
        isObj && typeof regPayload.playerName === "string" ? regPayload.playerName : null;

      const meta = ensureMeta(socket);
      const activePairToken = setSocketPairToken(
        socket,
        pairToken || meta.pairToken || "default",
      );

      if (playerId) meta.playerId = playerId;
      if (playerName) meta.playerName = playerName;

      if (role === "controller") {
        const metaCtrl = markController(socket, activePairToken);
        const resolved = resolveControllerTarget(metaCtrl.pairToken);
        socket.emit("controller:pair-status", {
          linked: resolved.linked,
          pairToken: metaCtrl.pairToken,
          activeGames: resolved.activePairs.length,
          availablePairs: resolved.activePairs,
        });
      } else if (role === "game") {
        const wasController = controllerIds.delete(socket.id);
        meta.role = "game";
        gameIds.add(socket.id);
        if (wasController) {
          broadcastPairControllerStatus(activePairToken, socket);
        }
        const pairCount = countControllersForPair(activePairToken);
        socket.emit("controller:status", {
          connected: pairCount > 0,
          count: pairCount,
          pairToken: activePairToken,
        });
        notifyAllControllersPairStatus();
        if (meta.playerId) {
          const existingRoom = roomManager.getRoomForPlayer(meta.playerId);
          if (existingRoom) {
            syncSocketLobbyChannel(socket, existingRoom.roomId);
            socket.emit("room:state", existingRoom);
          }
        }
      }
    });

    socket.on("controller:input", (data) => {
      const meta = markController(socket, data?.pairToken);
      const { targetPair } = resolveControllerTarget(meta.pairToken);
      socket.to(pairChannel(targetPair)).emit("controller:input", data);
    });

    socket.on("controller:action", (action) => {
      const meta = markController(socket, action?.pairToken);
      const { targetPair } = resolveControllerTarget(meta.pairToken);
      socket.to(pairChannel(targetPair)).emit("controller:action", action);
    });

    socket.on("controller:settings", (settings) => {
      const meta = markController(socket, settings?.pairToken);
      const { targetPair } = resolveControllerTarget(meta.pairToken);
      socket.to(pairChannel(targetPair)).emit("controller:settings", settings);
    });

    socket.on("game:telemetry", (telemetry) => {
      const meta = ensureMeta(socket);
      if (!meta.role) meta.role = "game";
      gameIds.add(socket.id);
      socket.to(pairChannel(meta.pairToken)).emit("game:telemetry", telemetry);
      if (meta.pairToken !== "default" && getActiveGamePairs().length === 1) {
        socket.to(pairChannel("default")).emit("game:telemetry", telemetry);
      }
    });

    socket.on("game:haptic", (pattern) => {
      const meta = ensureMeta(socket);
      if (!meta.role) meta.role = "game";
      gameIds.add(socket.id);
      socket.to(pairChannel(meta.pairToken)).emit("game:haptic", pattern);
      if (meta.pairToken !== "default" && getActiveGamePairs().length === 1) {
        socket.to(pairChannel("default")).emit("game:haptic", pattern);
      }
    });

    // --- Phase 1: Custom Rooms & Multiplayer Lobby ---

    socket.on("auth:identify", (payload, ack) => {
      const meta = ensureMeta(socket);
      if (typeof payload?.playerId === "string" && payload.playerId.trim()) {
        meta.playerId = payload.playerId.trim().slice(0, 64);
      }
      if (typeof payload?.playerName === "string" && payload.playerName.trim()) {
        meta.playerName = payload.playerName.trim().slice(0, 20);
      }
      if (payload?.pairToken) {
        setSocketPairToken(socket, payload.pairToken);
      }
      const existingRoom = meta.playerId ? roomManager.getRoomForPlayer(meta.playerId) : null;
      if (existingRoom) {
        syncSocketLobbyChannel(socket, existingRoom.roomId);
      }
      replyAck(ack, {
        ok: true,
        playerId: meta.playerId,
        playerName: meta.playerName,
        pairToken: meta.pairToken,
        room: existingRoom,
      });
    });

    socket.on("room:create", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const playerName =
        (typeof payload?.playerName === "string" && payload.playerName.trim()) ||
        meta.playerName ||
        "Host";
      if (playerId) meta.playerId = playerId;
      meta.playerName = playerName;

      const res = roomManager.createRoom({
        playerId,
        playerName,
        socketId: socket.id,
        config: payload?.config || {},
      });
      if (res.ok && res.room) {
        syncSocketLobbyChannel(socket, res.room.roomId);
        socket.emit("room:state", res.room);
      }
      replyAck(ack, res);
    });

    socket.on("room:join", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const playerName =
        (typeof payload?.playerName === "string" && payload.playerName.trim()) ||
        meta.playerName ||
        "Survivor";
      if (playerId) meta.playerId = playerId;
      meta.playerName = playerName;

      const res = roomManager.joinRoom({
        inviteCode: payload?.inviteCode,
        roomId: payload?.roomId,
        playerId,
        playerName,
        socketId: socket.id,
      });
      if (res.ok && res.room) {
        syncSocketLobbyChannel(socket, res.room.roomId);
        socket.emit("room:state", res.room);
      }
      replyAck(ack, res);
    });

    socket.on("room:leave", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.leaveRoom({ playerId });
      syncSocketLobbyChannel(socket, null);
      replyAck(ack, res);
    });

    socket.on("room:ready", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.setReady({ playerId, ready: payload?.ready });
      replyAck(ack, res);
    });

    socket.on("room:config", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const patch = payload?.patch || payload?.config || payload || {};
      const res = roomManager.updateConfig({ playerId, patch });
      replyAck(ack, res);
    });

    socket.on("room:transfer-host", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.transferHost({
        playerId,
        targetPlayerId: payload?.targetPlayerId,
      });
      replyAck(ack, res);
    });

    socket.on("room:kick", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.kickPlayer({
        playerId,
        targetPlayerId: payload?.targetPlayerId,
      });
      if (res.ok && res.kickedSocketId) {
        const targetSocket = io.sockets.sockets.get(res.kickedSocketId);
        if (targetSocket) {
          syncSocketLobbyChannel(targetSocket, null);
          targetSocket.emit("room:kicked", {
            roomId: res.roomId,
            reason: "Removed by room host",
          });
        }
      }
      replyAck(ack, res);
    });

    socket.on("room:start", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.startMatch({
        playerId,
        force: Boolean(payload?.force),
      });
      replyAck(ack, res);
    });

    socket.on("room:cancel-countdown", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.cancelCountdown({ playerId });
      replyAck(ack, res);
    });

    socket.on("room:return-lobby", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.returnToLobby({ playerId });
      replyAck(ack, res);
    });

    socket.on("room:list", (_payload, ack) => {
      replyAck(ack, { ok: true, rooms: roomManager.listRoomsSummary() });
    });

    // --- Phase 1 Authoritative Multiplayer Match Events ---

    socket.on("match:join", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const matchId = payload?.matchId;
      if (playerId) meta.playerId = playerId;

      const res = matchManager.handlePlayerJoinMatch({
        matchId,
        playerId,
        socketId: socket.id,
      });
      if (res.ok) {
        socket.join(matchManager.matchChannel(matchId));
      }
      replyAck(ack, res);
    });

    socket.on("player:state", (payload) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      matchManager.handlePlayerStateUpdate({
        playerId,
        matchId: payload?.matchId,
        state: payload,
      });
    });

    socket.on("player:damage", (payload, ack) => {
      const meta = ensureMeta(socket);
      const attackerPlayerId =
        (typeof payload?.attackerId === "string" && payload.attackerId.trim()) || meta.playerId;
      const res = matchManager.handlePlayerDamage({
        attackerPlayerId,
        targetPlayerId: payload?.targetId,
        damage: payload?.damage,
        isHeadshot: payload?.isHeadshot,
        weaponId: payload?.weaponId,
      });
      replyAck(ack, res);
    });

    socket.on("disconnect", () => {
      const meta = socketMeta.get(socket.id);
      socketMeta.delete(socket.id);
      console.log(`[Controller Relay] Disconnected: ${socket.id}`);

      const wasGame = gameIds.delete(socket.id);
      const wasController = controllerIds.delete(socket.id);

      if (wasController && meta) {
        const resolved = resolveControllerTarget(meta.pairToken);
        const targetPair = resolved.targetPair;
        const remaining = countControllersForPair(targetPair);
        broadcastPairControllerStatus(meta.pairToken);
        if (remaining === 0) {
          io.to(pairChannel(targetPair)).emit("controller:disconnected");
        }
      }

      if (wasGame) {
        notifyAllControllersPairStatus();
      }

      if ((wasGame || meta?.role !== "controller") && meta?.playerId) {
        roomManager.handleSocketDisconnect({
          socketId: socket.id,
          playerId: meta.playerId,
        });
      }

      matchManager.handleSocketDisconnect({ socketId: socket.id });
    });
  });

  if (!options.deferListen) {
    httpServer.listen(port, "0.0.0.0", () => {
      const addr = httpServer.address();
      const listeningPort = typeof addr === "object" && addr ? addr.port : port;
      const ips = getLanIPv4Addresses();
      console.log(`[Controller Relay] Listening on port ${listeningPort}`);
      if (ips.length > 0) {
        console.log(`[Controller Relay] LAN IPv4: ${ips.join(", ")}`);
      }
    });
  }

  return {
    httpServer,
    io,
    port,
    roomManager,
    matchManager,
    close: () =>
      new Promise((resolve) => {
        io.close(() => resolve());
      }),
  };
}

if (require.main === module) {
  startRelayServer(DEFAULT_PORT);
}

module.exports = {
  startRelayServer,
  getLanIPv4Addresses,
};
