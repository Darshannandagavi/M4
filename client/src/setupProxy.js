const net = require("net");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const RELAY_PORT = Number(process.env.RELAY_PORT || 4000);
const RELAY_TARGET = `http://127.0.0.1:${RELAY_PORT}`;
const SERVER_MODULE_PATH = path.resolve(__dirname, "../../server/server.js");

function loadRelayModule() {
  try {
    return require(SERVER_MODULE_PATH);
  } catch (err) {
    console.warn("[CRA Proxy] Unable to load server/server.js:", err?.message || err);
    return null;
  }
}

function isPortListening(port, host = "127.0.0.1", timeoutMs = 350) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    let settled = false;
    const finish = (alive) => {
      if (settled) return;
      settled = true;
      try {
        socket.destroy();
      } catch {}
      resolve(alive);
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

let autoRelayInitStarted = false;
async function ensureRelayRunning(relayMod) {
  if (autoRelayInitStarted || process.env.DISABLE_AUTO_RELAY === "1") return;
  autoRelayInitStarted = true;
  if (!relayMod || typeof relayMod.startRelayServer !== "function") return;

  const alreadyUp = await isPortListening(RELAY_PORT);
  if (alreadyUp) return;

  try {
    const { httpServer } = relayMod.startRelayServer(RELAY_PORT);
    httpServer.on("error", (err) => {
      if (err && err.code === "EADDRINUSE") {
        // Another relay process bound the port concurrently; proxy will reach it.
        return;
      }
      console.warn("[CRA Proxy] Relay server error:", err?.message || err);
    });
    const cleanup = () => {
      try {
        httpServer.close();
      } catch {}
    };
    process.once("exit", cleanup);
    process.once("SIGINT", cleanup);
    process.once("SIGTERM", cleanup);
    console.log(`[CRA Proxy] Auto-started Controller Relay on port ${RELAY_PORT}`);
  } catch (err) {
    console.warn("[CRA Proxy] Auto-start relay failed:", err?.message || err);
  }
}

module.exports = function setupProxy(app) {
  const relayMod = loadRelayModule();
  ensureRelayRunning(relayMod);

  app.get("/api/network-info", (_req, res) => {
    const ips =
      relayMod && typeof relayMod.getLanIPv4Addresses === "function"
        ? relayMod.getLanIPv4Addresses()
        : [];
    res.setHeader("Cache-Control", "no-store");
    res.json({
      ips,
      primaryIp: ips[0] || null,
      port: RELAY_PORT,
    });
  });

  app.use(
    createProxyMiddleware(["/socket.io", "/api"], {
      target: RELAY_TARGET,
      changeOrigin: true,
      ws: true,
      logLevel: "warn",
      onError(_err, _req, res) {
        if (res && typeof res.writeHead === "function" && !res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              ok: false,
              error: "Controller relay server is offline",
            }),
          );
        } else if (res && typeof res.end === "function") {
          try {
            res.end();
          } catch {}
        }
      },
    }),
  );
};

