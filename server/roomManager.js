const crypto = require("crypto");

const MAX_MATCH_CAPACITY = 50;
const MIN_ROOM_CAPACITY = 2;
const VALID_MODES = ["solo", "duo", "squad"];
const VALID_MAPS = ["bermuda", "rainier", "cotedazur"];
const VALID_BOT_DIFFICULTIES = ["easy", "normal", "hard", "pro"];
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const BOT_CALLSIGNS = [
  "Kelly",
  "Hayato",
  "Alok",
  "Chrono",
  "Moco",
  "Maxim",
  "Andrew",
  "Kla",
  "Paloma",
  "Miguel",
  "Laura",
  "Rafael",
  "Wukong",
  "Jota",
  "Kapella",
  "Clu",
  "Skyler",
  "Tatsuya",
  "Iris",
  "Homer",
  "Dasha",
  "Xayne",
  "Kenta",
  "Leon",
];

const BOT_BEHAVIOR_PROFILES = ["rusher", "tactical", "looter", "flanker"];

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function sanitizePlayerName(name, fallback = "Survivor") {
  if (typeof name !== "string") return fallback;
  const cleaned = name.replace(/[\r\n\t<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 20);
  return cleaned || fallback;
}

function getTeamSizeForMode(mode) {
  if (mode === "duo") return 2;
  if (mode === "squad") return 4;
  return 1;
}

function generateInviteCode(existingCodes) {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    let code = "";
    const bytes = crypto.randomBytes(6);
    for (let i = 0; i < 6; i += 1) {
      code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    }
    if (!existingCodes.has(code)) return code;
  }
  return `BR${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

function normalizeConfig(raw = {}, base = null) {
  const prev = base || {
    maxPlayers: MAX_MATCH_CAPACITY,
    mapId: "bermuda",
    mode: "solo",
    botsEnabled: true,
    autoFillBots: true,
    botCount: MAX_MATCH_CAPACITY - 1,
    botDifficulty: "normal",
    countdownSec: 5,
  };

  const maxPlayers =
    raw.maxPlayers !== undefined
      ? clampInt(raw.maxPlayers, MIN_ROOM_CAPACITY, MAX_MATCH_CAPACITY, prev.maxPlayers)
      : prev.maxPlayers;

  const mapId = VALID_MAPS.includes(raw.mapId) ? raw.mapId : prev.mapId;
  const mode = VALID_MODES.includes(raw.mode) ? raw.mode : prev.mode;
  const botsEnabled =
    typeof raw.botsEnabled === "boolean" ? raw.botsEnabled : prev.botsEnabled;
  const autoFillBots =
    typeof raw.autoFillBots === "boolean" ? raw.autoFillBots : prev.autoFillBots;
  const botCount =
    raw.botCount !== undefined
      ? clampInt(raw.botCount, 0, Math.max(0, maxPlayers - 1), prev.botCount)
      : Math.min(prev.botCount, Math.max(0, maxPlayers - 1));
  const botDifficulty = VALID_BOT_DIFFICULTIES.includes(raw.botDifficulty)
    ? raw.botDifficulty
    : prev.botDifficulty;
  const countdownSec =
    raw.countdownSec !== undefined
      ? clampInt(raw.countdownSec, 3, 30, prev.countdownSec)
      : prev.countdownSec;

  return {
    maxPlayers,
    mapId,
    mode,
    botsEnabled,
    autoFillBots,
    botCount,
    botDifficulty,
    countdownSec,
  };
}

function createRoomManager({
  disconnectGraceMs = 8000,
  onRoomUpdated = null,
  onCountdownTick = null,
  onMatchStarted = null,
} = {}) {
  const roomsById = new Map();
  const roomIdByCode = new Map();
  const playerToRoomId = new Map();

  function recomputeTeamsAndSlots(room) {
    const teamSize = getTeamSizeForMode(room.config.mode);
    const ordered = Array.from(room.players.values()).sort(
      (a, b) => a.joinedAt - b.joinedAt,
    );
    ordered.forEach((p, idx) => {
      p.slotIndex = idx;
      p.teamId = Math.floor(idx / teamSize) + 1;
      p.isHost = p.playerId === room.hostPlayerId;
    });
  }

  function computeSlotAllocation(room) {
    const configuredMax = Math.min(MAX_MATCH_CAPACITY, room.config.maxPlayers);
    const realPlayers = room.players.size;
    const remaining = Math.max(0, configuredMax - realPlayers);
    let bots = 0;

    if (room.config.botsEnabled) {
      bots = room.config.autoFillBots
        ? remaining
        : Math.min(Math.max(0, room.config.botCount), remaining);
    }

    const totalOccupied = Math.min(configuredMax, realPlayers + bots);
    const availableSlots = Math.max(0, configuredMax - totalOccupied);

    return {
      maxCapacity: MAX_MATCH_CAPACITY,
      configuredMax,
      realPlayers,
      bots,
      availableSlots,
      totalOccupied,
      connectedPlayers: Array.from(room.players.values()).filter((p) => p.connected)
        .length,
    };
  }

  function buildBotRoster(room, botCount) {
    const teamSize = getTeamSizeForMode(room.config.mode);
    const startingSlot = room.players.size;
    const bots = [];

    for (let i = 0; i < botCount; i += 1) {
      const slotIndex = startingSlot + i;
      const callsignBase = BOT_CALLSIGNS[i % BOT_CALLSIGNS.length];
      const tagNum = String(i + 1).padStart(2, "0");
      bots.push({
        id: `bot_${room.roomId}_${tagNum}`,
        name: `[BOT] ${callsignBase}-${tagNum}`,
        isBot: true,
        difficulty: room.config.botDifficulty,
        profile: BOT_BEHAVIOR_PROFILES[i % BOT_BEHAVIOR_PROFILES.length],
        slotIndex,
        teamId: Math.floor(slotIndex / teamSize) + 1,
      });
    }
    return bots;
  }

  function serializeRoom(room) {
    if (!room) return null;
    recomputeTeamsAndSlots(room);
    const slots = computeSlotAllocation(room);
    const players = Array.from(room.players.values())
      .sort((a, b) => a.slotIndex - b.slotIndex)
      .map((p) => ({
        playerId: p.playerId,
        name: p.name,
        isHost: p.playerId === room.hostPlayerId,
        ready: Boolean(p.ready),
        connected: Boolean(p.connected),
        teamId: p.teamId,
        slotIndex: p.slotIndex,
        isBot: false,
      }));

    return {
      roomId: room.roomId,
      inviteCode: room.inviteCode,
      status: room.status,
      hostPlayerId: room.hostPlayerId,
      countdownRemaining: room.countdownRemaining,
      createdAt: room.createdAt,
      config: { ...room.config },
      slots,
      players,
      botSummary: {
        enabled: room.config.botsEnabled,
        autoFill: room.config.autoFillBots,
        count: slots.bots,
        difficulty: room.config.botDifficulty,
        isBotOnly: true,
      },
      matchManifest: room.matchManifest || null,
    };
  }

  function clearCountdownTimer(room) {
    if (room?.countdownTimer) {
      clearInterval(room.countdownTimer);
      room.countdownTimer = null;
    }
    if (room) {
      room.countdownRemaining = 0;
    }
  }

  function clearPlayerGraceTimer(player) {
    if (player?.graceTimer) {
      clearTimeout(player.graceTimer);
      player.graceTimer = null;
    }
  }

  function destroyRoom(room) {
    if (!room) return;
    clearCountdownTimer(room);
    for (const p of room.players.values()) {
      clearPlayerGraceTimer(p);
      if (playerToRoomId.get(p.playerId) === room.roomId) {
        playerToRoomId.delete(p.playerId);
      }
    }
    roomsById.delete(room.roomId);
    roomIdByCode.delete(room.inviteCode);
  }

  function transferHostIfNeeded(room) {
    if (room.players.has(room.hostPlayerId)) {
      const currentHost = room.players.get(room.hostPlayerId);
      if (currentHost?.connected) return;
    }

    const sorted = Array.from(room.players.values()).sort(
      (a, b) => a.joinedAt - b.joinedAt,
    );
    const nextConnected = sorted.find((p) => p.connected) || sorted[0];
    if (nextConnected) {
      room.hostPlayerId = nextConnected.playerId;
    }
  }

  function emitUpdate(room) {
    if (!room) return;
    onRoomUpdated?.(serializeRoom(room));
  }

  function removePlayerFromCurrentRoom(playerId, { reason = "left" } = {}) {
    const existingRoomId = playerToRoomId.get(playerId);
    if (!existingRoomId) return { ok: true, removed: false };

    const room = roomsById.get(existingRoomId);
    playerToRoomId.delete(playerId);
    if (!room) return { ok: true, removed: false };

    const player = room.players.get(playerId);
    if (player) {
      clearPlayerGraceTimer(player);
      room.players.delete(playerId);
    }

    if (room.players.size === 0) {
      destroyRoom(room);
      return { ok: true, removed: true, roomDeleted: true, roomId: existingRoomId };
    }

    if (room.status === "COUNTDOWN") {
      clearCountdownTimer(room);
      room.status = "LOBBY";
    }

    transferHostIfNeeded(room);
    const snapshot = serializeRoom(room);
    emitUpdate(room);

    return {
      ok: true,
      removed: true,
      roomDeleted: false,
      reason,
      room: snapshot,
    };
  }

  function createRoom({ playerId, playerName, socketId, config = {} }) {
    if (!playerId) {
      return { ok: false, error: "MISSING_IDENTITY", message: "Player identity required." };
    }

    removePlayerFromCurrentRoom(playerId, { reason: "switched_room" });

    const inviteCode = generateInviteCode(roomIdByCode);
    const roomId = `rm_${crypto.randomBytes(4).toString("hex")}`;
    const normalizedConfig = normalizeConfig(config);
    const now = Date.now();

    const room = {
      roomId,
      inviteCode,
      hostPlayerId: playerId,
      status: "LOBBY",
      createdAt: now,
      config: normalizedConfig,
      players: new Map(),
      countdownTimer: null,
      countdownRemaining: 0,
      matchManifest: null,
    };

    room.players.set(playerId, {
      playerId,
      name: sanitizePlayerName(playerName, "Host"),
      socketId,
      isHost: true,
      ready: true,
      connected: true,
      disconnectedAt: null,
      joinedAt: now,
      slotIndex: 0,
      teamId: 1,
      graceTimer: null,
      isBot: false,
    });

    roomsById.set(roomId, room);
    roomIdByCode.set(inviteCode, roomId);
    playerToRoomId.set(playerId, roomId);

    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function findRoomByCodeOrId(codeOrId) {
    if (!codeOrId || typeof codeOrId !== "string") return null;
    const trimmed = codeOrId.trim();
    const byId = roomsById.get(trimmed);
    if (byId) return byId;
    const mappedId = roomIdByCode.get(trimmed.toUpperCase());
    return mappedId ? roomsById.get(mappedId) : null;
  }

  function getRoomPreview(codeOrId) {
    const room = findRoomByCodeOrId(codeOrId);
    if (!room) return null;
    const slots = computeSlotAllocation(room);
    return {
      roomId: room.roomId,
      inviteCode: room.inviteCode,
      status: room.status,
      config: { ...room.config },
      slots,
    };
  }

  function joinRoom({ inviteCode, roomId, playerId, playerName, socketId }) {
    if (!playerId) {
      return { ok: false, error: "MISSING_IDENTITY", message: "Player identity required." };
    }

    const room = findRoomByCodeOrId(inviteCode || roomId);
    if (!room) {
      return {
        ok: false,
        error: "ROOM_NOT_FOUND",
        message: "Room not found. Check the invite code and try again.",
      };
    }

    // Reconnection to existing slot inside this room
    const existingInThisRoom = room.players.get(playerId);
    if (existingInThisRoom) {
      clearPlayerGraceTimer(existingInThisRoom);
      existingInThisRoom.socketId = socketId;
      existingInThisRoom.connected = true;
      existingInThisRoom.disconnectedAt = null;
      if (playerName) {
        existingInThisRoom.name = sanitizePlayerName(playerName, existingInThisRoom.name);
      }
      playerToRoomId.set(playerId, room.roomId);
      const snapshot = serializeRoom(room);
      emitUpdate(room);
      return { ok: true, reconnected: true, room: snapshot };
    }

    if (room.status !== "LOBBY") {
      return {
        ok: false,
        error: "MATCH_ALREADY_STARTED",
        message: "Match has already started. Cannot join after lobby lock.",
      };
    }

    if (room.players.size >= room.config.maxPlayers || room.players.size >= MAX_MATCH_CAPACITY) {
      return {
        ok: false,
        error: "ROOM_FULL",
        message: `Room is full (${room.config.maxPlayers}/${room.config.maxPlayers} players).`,
      };
    }

    const previousRoomId = playerToRoomId.get(playerId);
    if (previousRoomId && previousRoomId !== room.roomId) {
      removePlayerFromCurrentRoom(playerId, { reason: "switched_room" });
    }

    room.players.set(playerId, {
      playerId,
      name: sanitizePlayerName(playerName, `Player-${room.players.size + 1}`),
      socketId,
      isHost: false,
      ready: false,
      connected: true,
      disconnectedAt: null,
      joinedAt: Date.now(),
      slotIndex: room.players.size,
      teamId: 1,
      graceTimer: null,
      isBot: false,
    });

    playerToRoomId.set(playerId, room.roomId);
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, reconnected: false, room: snapshot };
  }

  function setReady({ playerId, ready }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.status !== "LOBBY") {
      return {
        ok: false,
        error: "ROOM_LOCKED",
        message: "Cannot change ready status after countdown starts.",
      };
    }
    const player = room.players.get(playerId);
    if (!player) {
      return { ok: false, error: "NOT_IN_ROOM", message: "Player not found in room." };
    }
    player.ready = typeof ready === "boolean" ? ready : !player.ready;
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function updateConfig({ playerId, patch = {} }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can modify room settings.",
      };
    }
    if (room.status !== "LOBBY") {
      return {
        ok: false,
        error: "ROOM_LOCKED",
        message: "Cannot change room configuration after match countdown starts.",
      };
    }

    const requestedMax =
      patch.maxPlayers !== undefined
        ? clampInt(patch.maxPlayers, Math.max(MIN_ROOM_CAPACITY, room.players.size), MAX_MATCH_CAPACITY, room.config.maxPlayers)
        : room.config.maxPlayers;

    room.config = normalizeConfig({ ...patch, maxPlayers: requestedMax }, room.config);
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function transferHost({ playerId, targetPlayerId }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can transfer host ownership.",
      };
    }
    if (!room.players.has(targetPlayerId)) {
      return {
        ok: false,
        error: "PLAYER_NOT_FOUND",
        message: "Target player is not in this room.",
      };
    }
    room.hostPlayerId = targetPlayerId;
    const targetPlayer = room.players.get(targetPlayerId);
    if (targetPlayer) targetPlayer.ready = true;
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function kickPlayer({ playerId, targetPlayerId }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can kick players.",
      };
    }
    if (targetPlayerId === playerId) {
      return {
        ok: false,
        error: "INVALID_TARGET",
        message: "Host cannot kick themselves. Leave room instead.",
      };
    }
    const target = room.players.get(targetPlayerId);
    if (!target) {
      return {
        ok: false,
        error: "PLAYER_NOT_FOUND",
        message: "Player is no longer in this room.",
      };
    }

    const kickedSocketId = target.socketId;
    clearPlayerGraceTimer(target);
    room.players.delete(targetPlayerId);
    playerToRoomId.delete(targetPlayerId);

    if (room.status === "COUNTDOWN") {
      clearCountdownTimer(room);
      room.status = "LOBBY";
    }

    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return {
      ok: true,
      kickedPlayerId: targetPlayerId,
      kickedSocketId,
      roomId: room.roomId,
      room: snapshot,
    };
  }

  function finalizeMatchStart(room) {
    if (!room || room.status !== "COUNTDOWN") return null;
    clearCountdownTimer(room);

    // Drop any lingering disconnected players before locking match manifest
    for (const [pid, player] of room.players.entries()) {
      if (!player.connected) {
        clearPlayerGraceTimer(player);
        room.players.delete(pid);
        playerToRoomId.delete(pid);
      }
    }

    if (room.players.size === 0) {
      destroyRoom(room);
      return null;
    }

    transferHostIfNeeded(room);
    recomputeTeamsAndSlots(room);
    const slots = computeSlotAllocation(room);
    const bots = buildBotRoster(room, slots.bots);

    const humans = Array.from(room.players.values())
      .sort((a, b) => a.slotIndex - b.slotIndex)
      .map((p) => ({
        id: p.playerId,
        name: p.name,
        isHost: p.playerId === room.hostPlayerId,
        isBot: false,
        slotIndex: p.slotIndex,
        teamId: p.teamId,
      }));

    const matchManifest = {
      matchId: `m_${crypto.randomBytes(5).toString("hex")}`,
      roomId: room.roomId,
      inviteCode: room.inviteCode,
      startedAt: Date.now(),
      config: { ...room.config },
      counts: {
        maxCapacity: MAX_MATCH_CAPACITY,
        configuredMax: room.config.maxPlayers,
        humans: humans.length,
        bots: bots.length,
        total: humans.length + bots.length,
      },
      humans,
      bots,
    };

    room.status = "IN_MATCH";
    room.matchManifest = matchManifest;

    const snapshot = serializeRoom(room);
    emitUpdate(room);
    onMatchStarted?.(snapshot, matchManifest);
    return matchManifest;
  }

  function startMatch({ playerId, force = false } = {}) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can start the match.",
      };
    }
    if (room.status !== "LOBBY") {
      return {
        ok: false,
        error: "INVALID_STATE",
        message: `Cannot start match while room is ${room.status}.`,
      };
    }

    const connectedPlayers = Array.from(room.players.values()).filter((p) => p.connected);
    if (connectedPlayers.length === 0) {
      return { ok: false, error: "NO_PLAYERS", message: "No connected players in room." };
    }

    const unreadyOthers = connectedPlayers.filter(
      (p) => p.playerId !== room.hostPlayerId && !p.ready,
    );
    if (unreadyOthers.length > 0 && !force) {
      return {
        ok: false,
        error: "PLAYERS_NOT_READY",
        message: `${unreadyOthers.length} player(s) not ready (${unreadyOthers
          .map((p) => p.name)
          .slice(0, 3)
          .join(", ")}).`,
      };
    }

    const host = room.players.get(room.hostPlayerId);
    if (host) host.ready = true;

    room.status = "COUNTDOWN";
    room.countdownRemaining = room.config.countdownSec;
    const initialSnapshot = serializeRoom(room);
    emitUpdate(room);
    onCountdownTick?.(initialSnapshot, room.countdownRemaining);

    room.countdownTimer = setInterval(() => {
      if (!roomsById.has(room.roomId) || room.status !== "COUNTDOWN") {
        clearCountdownTimer(room);
        return;
      }
      room.countdownRemaining -= 1;
      if (room.countdownRemaining <= 0) {
        finalizeMatchStart(room);
        return;
      }
      const tickSnap = serializeRoom(room);
      emitUpdate(room);
      onCountdownTick?.(tickSnap, room.countdownRemaining);
    }, 1000);

    return { ok: true, room: initialSnapshot };
  }

  function cancelCountdown({ playerId }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can cancel countdown.",
      };
    }
    if (room.status !== "COUNTDOWN") {
      return { ok: false, error: "INVALID_STATE", message: "No countdown in progress." };
    }

    clearCountdownTimer(room);
    room.status = "LOBBY";
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function returnToLobby({ playerId }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can return the room to lobby.",
      };
    }

    clearCountdownTimer(room);
    room.status = "LOBBY";
    room.matchManifest = null;
    for (const player of room.players.values()) {
      player.ready = player.playerId === room.hostPlayerId;
    }

    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function handleSocketDisconnect({ socketId, playerId = null }) {
    let targetPlayer = null;
    let targetRoom = null;

    if (playerId && playerToRoomId.has(playerId)) {
      const r = roomsById.get(playerToRoomId.get(playerId));
      const p = r?.players.get(playerId);
      if (p && p.socketId === socketId) {
        targetPlayer = p;
        targetRoom = r;
      }
    }

    if (!targetPlayer) {
      for (const room of roomsById.values()) {
        for (const p of room.players.values()) {
          if (p.socketId === socketId) {
            targetPlayer = p;
            targetRoom = room;
            break;
          }
        }
        if (targetPlayer) break;
      }
    }

    if (!targetPlayer || !targetRoom) return null;

    targetPlayer.connected = false;
    targetPlayer.disconnectedAt = Date.now();
    clearPlayerGraceTimer(targetPlayer);

    const pid = targetPlayer.playerId;
    const rid = targetRoom.roomId;

    targetPlayer.graceTimer = setTimeout(() => {
      const latestRoom = roomsById.get(rid);
      const latestPlayer = latestRoom?.players.get(pid);
      if (!latestRoom || !latestPlayer || latestPlayer.connected) return;
      removePlayerFromCurrentRoom(pid, { reason: "disconnect_timeout" });
    }, disconnectGraceMs);

    const snapshot = serializeRoom(targetRoom);
    emitUpdate(targetRoom);
    return snapshot;
  }

  function getRoomForPlayer(playerId) {
    const rid = playerToRoomId.get(playerId);
    if (!rid) return null;
    return serializeRoom(roomsById.get(rid));
  }

  function listRoomsSummary() {
    return Array.from(roomsById.values()).map((room) => ({
      roomId: room.roomId,
      inviteCode: room.inviteCode,
      status: room.status,
      mode: room.config.mode,
      mapId: room.config.mapId,
      slots: computeSlotAllocation(room),
    }));
  }

  return {
    MAX_MATCH_CAPACITY,
    createRoom,
    joinRoom,
    leaveRoom: ({ playerId }) => removePlayerFromCurrentRoom(playerId, { reason: "left" }),
    setReady,
    updateConfig,
    transferHost,
    kickPlayer,
    startMatch,
    cancelCountdown,
    returnToLobby,
    handleSocketDisconnect,
    getRoomPreview,
    getRoomForPlayer,
    listRoomsSummary,
  };
}

module.exports = {
  MAX_MATCH_CAPACITY,
  MIN_ROOM_CAPACITY,
  VALID_MODES,
  VALID_MAPS,
  VALID_BOT_DIFFICULTIES,
  createRoomManager,
};

