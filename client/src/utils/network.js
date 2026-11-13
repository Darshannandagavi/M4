import { io } from "socket.io-client";

export function isLoopbackHost(hostname) {
  if (!hostname) return false;
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]" || h === "0.0.0.0";
}

export function getSocketUrl() {
  if (typeof window === "undefined") return "http://localhost:4000";
  const envUrl = process.env.REACT_APP_SOCKET_URL;
  if (envUrl) return envUrl;
  return window.location.origin;
}

export function getUrlParam(name) {
  if (typeof window === "undefined") return "";
  try {
    return new URLSearchParams(window.location.search).get(name) || "";
  } catch {
    return "";
  }
}

export function getRoomCodeFromUrl() {
  const raw = getUrlParam("room");
  return raw ? raw.trim().toUpperCase() : "";
}

export function getPairTokenFromUrl() {
  const raw = getUrlParam("pair");
  const cleaned = raw.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  return cleaned || "default";
}

function randomToken(len = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const arr = new Uint8Array(len);
    window.crypto.getRandomValues(arr);
    for (let i = 0; i < len; i += 1) {
      out += chars[arr[i] % chars.length];
    }
    return out;
  }
  for (let i = 0; i < len; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function getOrCreatePlayerSession() {
  if (typeof window === "undefined") {
    return {
      playerId: "plr_ssr",
      pairToken: "default",
      playerName: "Survivor",
    };
  }
  try {
    let playerId = window.sessionStorage.getItem("ff_player_id");
    if (!playerId) {
      playerId = `plr_${randomToken(8)}`;
      window.sessionStorage.setItem("ff_player_id", playerId);
    }

    let pairToken = window.sessionStorage.getItem("ff_pair_token");
    if (!pairToken) {
      pairToken = `pair_${randomToken(8)}`;
      window.sessionStorage.setItem("ff_pair_token", pairToken);
    }

    let playerName = window.sessionStorage.getItem("ff_player_name");
    if (!playerName) {
      playerName = `Survivor-${playerId.slice(-4).toUpperCase()}`;
      window.sessionStorage.setItem("ff_player_name", playerName);
    }

    return { playerId, pairToken, playerName };
  } catch {
    return {
      playerId: `plr_${randomToken(8)}`,
      pairToken: `pair_${randomToken(8)}`,
      playerName: "Survivor",
    };
  }
}

export function setSessionPlayerName(name) {
  if (typeof window === "undefined" || typeof name !== "string") return;
  const cleaned = name.replace(/[\r\n\t<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 20);
  if (!cleaned) return;
  try {
    window.sessionStorage.setItem("ff_player_name", cleaned);
  } catch {}
}

function buildOriginWithHost(overrideHost = null) {
  if (typeof window === "undefined") return "";
  const { hostname, port, protocol } = window.location;
  const targetHost =
    overrideHost && typeof overrideHost === "string" ? overrideHost : hostname;
  const formattedHost = targetHost.includes(":") && !targetHost.startsWith("[")
    ? `[${targetHost}]`
    : targetHost;
  return `${protocol}//${formattedHost}${port ? `:${port}` : ""}`;
}

export function getNetworkControllerUrl(overrideHost = null, pairToken = null) {
  if (typeof window === "undefined") return "";
  const origin = buildOriginWithHost(overrideHost);
  const pairSuffix =
    pairToken && typeof pairToken === "string"
      ? `&pair=${encodeURIComponent(pairToken)}`
      : "";
  return `${origin}/?controller=1${pairSuffix}`;
}

export function getRoomInviteUrl(inviteCode, overrideHost = null) {
  if (typeof window === "undefined" || !inviteCode) return "";
  const origin = buildOriginWithHost(overrideHost);
  return `${origin}/?room=${encodeURIComponent(inviteCode.trim().toUpperCase())}`;
}

export function getSocketCandidates() {
  if (typeof window === "undefined") return ["http://localhost:4000"];
  const list = [];
  if (process.env.REACT_APP_SOCKET_URL) {
    list.push(process.env.REACT_APP_SOCKET_URL);
  }

  // Always prefer same-origin first so CRA setupProxy (/socket.io -> :4000),
  // direct server.js hosting, and HTTPS/tunnels share the reachable page port.
  if (window.location.origin) {
    list.push(window.location.origin);
  }

  // Direct relay port fallback (e.g. bare static server serving client/build)
  const { protocol, hostname, port } = window.location;
  const isSecure = protocol === "https:";
  if (port !== "4000" && (!isSecure || isLoopbackHost(hostname))) {
    const cleanHost = hostname.includes(":") && !hostname.startsWith("[")
      ? `[${hostname}]`
      : hostname;
    list.push(`${protocol}//${cleanHost}:4000`);
  }

  return [...new Set(list)];
}

async function fetchJsonWithTimeout(url, timeoutMs = 1500) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer =
    controller && typeof window !== "undefined"
      ? window.setTimeout(() => controller.abort(), timeoutMs)
      : null;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller?.signal,
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}

export async function fetchNetworkInfo() {
  if (typeof window === "undefined") {
    return { ips: [], primaryIp: null, port: 4000 };
  }

  const sameOrigin = await fetchJsonWithTimeout("/api/network-info", 1200);
  if (sameOrigin && Array.isArray(sameOrigin.ips)) {
    return sameOrigin;
  }

  const { protocol, hostname, port } = window.location;
  if (port !== "4000") {
    const fallbackUrl = `${protocol}//${hostname}:4000/api/network-info`;
    const direct = await fetchJsonWithTimeout(fallbackUrl, 1200);
    if (direct && Array.isArray(direct.ips)) {
      return direct;
    }
  }

  return { ips: [], primaryIp: null, port: 4000 };
}

async function probeSocketEndpoint(baseUrl, timeoutMs = 1500) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer =
    controller && typeof window !== "undefined"
      ? window.setTimeout(() => controller.abort(), timeoutMs)
      : null;

  try {
    const cleanBase = baseUrl.replace(/\/+$/, "");
    const res = await fetch(
      `${cleanBase}/socket.io/?EIO=4&transport=polling&t=${Date.now()}`,
      {
        cache: "no-store",
        signal: controller?.signal,
      },
    );
    if (!res.ok) return false;
    const text = await res.text();
    // Engine.IO polling handshake begins with packet type '0' + JSON object ("0{...}")
    return typeof text === "string" && text.includes('"sid"');
  } catch {
    return false;
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}

export async function resolveWorkingSocketUrl() {
  const candidates = getSocketCandidates();
  for (const url of candidates) {
    const ok = await probeSocketEndpoint(url);
    if (ok) return url;
  }
  return null;
}

/**
 * Resolves a working Socket.IO relay (same-origin proxy first, then :4000 fallback),
 * registers the client role ("game" | "controller"), and auto-recovers if the relay
 * starts slightly later or restarts.
 */
export function connectRelaySocket({
  role,
  pairToken = "default",
  playerId = null,
  playerName = null,
  onSocket,
  onStatusChange,
  onCleanupSocket,
}) {
  let disposed = false;
  let activeSocket = null;
  let retryTimer = null;
  let consecutiveErrors = 0;

  const clearRetry = () => {
    if (retryTimer && typeof window !== "undefined") {
      window.clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  const teardownSocket = () => {
    if (!activeSocket) return;
    const old = activeSocket;
    activeSocket = null;
    try {
      onCleanupSocket?.(old);
    } catch {}
    try {
      old.disconnect();
    } catch {}
  };

  const scheduleReconnectProbe = (delayMs = 1800) => {
    if (disposed) return;
    clearRetry();
    if (typeof window !== "undefined") {
      retryTimer = window.setTimeout(() => {
        retryTimer = null;
        attemptConnect();
      }, delayMs);
    }
  };

  const attemptConnect = async () => {
    if (disposed) return;
    onStatusChange?.({ status: "connecting" });

    const targetUrl = await resolveWorkingSocketUrl();
    if (disposed) return;

    if (!targetUrl) {
      onStatusChange?.({
        status: "offline",
        reason: "Controller relay server not reachable",
      });
      scheduleReconnectProbe(1800);
      return;
    }

    teardownSocket();
    consecutiveErrors = 0;

    const socket = io(targetUrl, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionDelay: 600,
      reconnectionDelayMax: 3000,
    });
    activeSocket = socket;

    socket.on("connect", () => {
      if (disposed || activeSocket !== socket) return;
      consecutiveErrors = 0;
      if (role) {
        socket.emit("client:register", {
          role,
          pairToken,
          playerId,
          playerName,
        });
      }
      onStatusChange?.({ status: "connected", url: targetUrl });
    });

    socket.on("disconnect", (reason) => {
      if (disposed || activeSocket !== socket) return;
      onStatusChange?.({ status: "reconnecting", url: targetUrl, reason });
    });

    socket.on("connect_error", (err) => {
      if (disposed || activeSocket !== socket) return;
      consecutiveErrors += 1;
      onStatusChange?.({
        status: "error",
        url: targetUrl,
        reason: err?.message || "Connection failed",
      });
      if (consecutiveErrors >= 3) {
        // Endpoint may have moved or relay restarted; tear down and re-probe candidates
        teardownSocket();
        scheduleReconnectProbe(1500);
      }
    });

    onSocket?.(socket);
  };

  attemptConnect();

  return () => {
    disposed = true;
    clearRetry();
    teardownSocket();
  };
}

export function getScreenAngle() {
  if (
    typeof window !== "undefined" &&
    window.screen?.orientation?.angle !== undefined
  ) {
    return window.screen.orientation.angle;
  }
  return typeof window !== "undefined" ? window.orientation || 0 : 0;
}

export function extractTiltDegrees(event, isForcedLandscape) {
  const beta = event.beta ?? 0;
  const gamma = event.gamma ?? 0;
  const angle = getScreenAngle();

  if (angle === 90) return beta;
  if (angle === -90 || angle === 270) return -beta;
  if (isForcedLandscape) return beta;
  return gamma;
}
