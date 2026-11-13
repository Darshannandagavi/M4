const assert = require("assert");
const http = require("http");
const { io: ioClient } = require("../client/node_modules/socket.io-client");
const { createRoomManager } = require("./roomManager");
const { startRelayServer } = require("./server");

function fetchJson(port, path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(body) });
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}

function emitAck(socket, event, payload) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for ack on ${event}`)), 4000);
    socket.emit(event, payload, (res) => {
      clearTimeout(timer);
      resolve(res);
    });
  });
}

function waitForEvent(socket, event, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for event ${event}`)), timeoutMs);
    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function runUnitTests() {
  console.log("Running roomManager unit tests...");
  let startedManifest = null;
  const rm = createRoomManager({
    disconnectGraceMs: 120,
    onMatchStarted: (_room, manifest) => {
      startedManifest = manifest;
    },
  });

  // 1. Create room with 50-slot default (1 human + 49 bots)
  const created = rm.createRoom({
    playerId: "p-host",
    playerName: "AlphaHost",
    socketId: "s-host",
    config: { maxPlayers: 99 }, // must clamp to 50
  });
  assert.strictEqual(created.ok, true);
  assert.strictEqual(created.room.config.maxPlayers, 50);
  assert.strictEqual(created.room.slots.realPlayers, 1);
  assert.strictEqual(created.room.slots.bots, 49);
  assert.strictEqual(created.room.slots.totalOccupied, 50);
  assert.strictEqual(created.room.slots.availableSlots, 0);
  assert.strictEqual(created.room.botSummary.count, 49);
  assert.strictEqual(created.room.botSummary.isBotOnly, true);

  // 2. Join 29 more humans -> 30 humans + 20 bots = 50
  for (let i = 2; i <= 30; i += 1) {
    const joined = rm.joinRoom({
      inviteCode: created.room.inviteCode,
      playerId: `p-${i}`,
      playerName: `Player${i}`,
      socketId: `s-${i}`,
    });
    assert.strictEqual(joined.ok, true);
    assert.strictEqual(joined.room.slots.realPlayers, i);
    assert.strictEqual(joined.room.slots.bots, 50 - i);
    assert.strictEqual(joined.room.slots.totalOccupied, 50);
  }

  // 3. Bots disabled -> 30 humans + 0 bots + 20 availableSlots
  const noBots = rm.updateConfig({
    playerId: "p-host",
    patch: { botsEnabled: false, mode: "squad", mapId: "rainier", countdownSec: 3 },
  });
  assert.strictEqual(noBots.ok, true);
  assert.strictEqual(noBots.room.slots.bots, 0);
  assert.strictEqual(noBots.room.slots.availableSlots, 20);
  assert.strictEqual(noBots.room.players.find((p) => p.playerId === "p-5").teamId, 2);

  // 4. Re-enable autoFillBots and start -> manifest has 50 participants, no bots impersonating humans
  rm.updateConfig({ playerId: "p-host", patch: { botsEnabled: true, autoFillBots: true } });
  const unauthStart = rm.startMatch({ playerId: "p-2" });
  assert.strictEqual(unauthStart.ok, false);
  assert.strictEqual(unauthStart.error, "UNAUTHORIZED");

  const startRes = rm.startMatch({ playerId: "p-host", force: true });
  assert.strictEqual(startRes.ok, true);
  assert.strictEqual(startRes.room.status, "COUNTDOWN");
  assert.strictEqual(startRes.room.config.countdownSec, 3);

  await new Promise((r) => setTimeout(r, 3400));
  assert.ok(startedManifest, "Expected matchManifest after 3s countdown");
  assert.strictEqual(startedManifest.counts.humans, 30);
  assert.strictEqual(startedManifest.counts.bots, 20);
  assert.strictEqual(startedManifest.counts.total, 50);
  assert.strictEqual(startedManifest.humans.length, 30);
  assert.strictEqual(startedManifest.bots.length, 20);
  assert.strictEqual(startedManifest.humans.every((x) => !x.isBot), true);
  assert.strictEqual(startedManifest.bots.every((x) => x.isBot === true), true);

  // 5. Reject new join once match started
  const lateJoin = rm.joinRoom({
    inviteCode: created.room.inviteCode,
    playerId: "p-late",
    playerName: "Latecomer",
    socketId: "s-late",
  });
  assert.strictEqual(lateJoin.ok, false);
  assert.strictEqual(lateJoin.error, "MATCH_ALREADY_STARTED");

  // Clean up rooms
  for (let i = 1; i <= 30; i += 1) {
    rm.leaveRoom({ playerId: i === 1 ? "p-host" : `p-${i}` });
  }
  console.log("✓ roomManager unit tests passed");
}

async function runIntegrationTests() {
  console.log("Running Socket.IO & HTTP integration tests...");
  const server = startRelayServer(0, { disconnectGraceMs: 250, deferListen: true });
  await new Promise((resolve) => server.httpServer.listen(0, "127.0.0.1", resolve));
  const { port } = server.httpServer.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const sockets = [];
  const connectClient = (label) => {
    const s = ioClient(baseUrl, { transports: ["polling", "websocket"], timeout: 3000 });
    sockets.push(s);
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`Connect timeout for ${label}`)), 4000);
      s.once("connect", () => {
        clearTimeout(t);
        resolve(s);
      });
      s.once("connect_error", (err) => {
        clearTimeout(t);
        reject(new Error(`Connect error for ${label}: ${err.message} (${err.description || err.type || ""})`));
      });
    });
  };

  try {
    const healthProbe = await fetchJson(port, "/api/health");
    console.log("  -> healthProbe:", healthProbe.status, healthProbe.json.ok);
    console.log("  -> connecting sockets to", baseUrl);
    const host = await connectClient("host");
    const guest = await connectClient("guest");
    const guestB = await connectClient("guestB");
    const phoneA = await connectClient("phoneA");
    console.log("  -> sockets connected");

    host.emit("client:register", { role: "game", pairToken: "pair_alpha", playerId: "u-host", playerName: "HostAlpha" });
    guest.emit("client:register", { role: "game", pairToken: "pair_beta", playerId: "u-guest", playerName: "GuestBravo" });
    guestB.emit("client:register", { role: "game", pairToken: "pair_gamma", playerId: "u-charlie", playerName: "Charlie" });

    // 1. Host creates room
    const createRes = await emitAck(host, "room:create", {
      playerId: "u-host",
      playerName: "HostAlpha",
      config: { mapId: "bermuda", mode: "duo", countdownSec: 1 },
    });
    assert.strictEqual(createRes.ok, true);
    const { inviteCode, roomId } = createRes.room;
    assert.strictEqual(inviteCode.length, 6);

    // 2. HTTP room preview & summary
    const listHttp = await fetchJson(port, "/api/rooms");
    assert.strictEqual(listHttp.status, 200);
    assert.strictEqual(listHttp.json.rooms.length, 1);

    const previewHttp = await fetchJson(port, `/api/rooms/${inviteCode}`);
    assert.strictEqual(previewHttp.status, 200);
    assert.strictEqual(previewHttp.json.room.inviteCode, inviteCode);

    const missingHttp = await fetchJson(port, "/api/rooms/ZZZZZZ");
    assert.strictEqual(missingHttp.status, 404);

    // 3. Guest joins by invite code
    const joinRes = await emitAck(guest, "room:join", {
      inviteCode,
      playerId: "u-guest",
      playerName: "GuestBravo",
    });
    assert.strictEqual(joinRes.ok, true);
    assert.strictEqual(joinRes.room.slots.realPlayers, 2);
    assert.strictEqual(joinRes.room.slots.bots, 48);

    // 4. Host permission checks
    const unauthCfg = await emitAck(guest, "room:config", {
      playerId: "u-guest",
      patch: { mapId: "cotedazur" },
    });
    assert.strictEqual(unauthCfg.ok, false);
    assert.strictEqual(unauthCfg.error, "UNAUTHORIZED");

    // 5. Ready gate & start countdown -> match:started
    const blockedStart = await emitAck(host, "room:start", { playerId: "u-host", force: false });
    assert.strictEqual(blockedStart.ok, false);
    assert.strictEqual(blockedStart.error, "PLAYERS_NOT_READY");

    const readyRes = await emitAck(guest, "room:ready", { playerId: "u-guest", ready: true });
    assert.strictEqual(readyRes.ok, true);

    const matchStartedPromise = waitForEvent(guest, "match:started", 5000);
    const countdownPromise = waitForEvent(guest, "room:countdown", 3000);
    const startRes = await emitAck(host, "room:start", { playerId: "u-host", force: false });
    assert.strictEqual(startRes.ok, true);

    const tick = await countdownPromise;
    assert.strictEqual(tick.roomId, roomId);
    const started = await matchStartedPromise;
    assert.strictEqual(started.matchManifest.counts.humans, 2);
    assert.strictEqual(started.matchManifest.counts.bots, 48);
    assert.strictEqual(started.matchManifest.counts.total, 50);

    // 6. Return to lobby
    const retRes = await emitAck(host, "room:return-lobby", { playerId: "u-host" });
    assert.strictEqual(retRes.ok, true);
    assert.strictEqual(retRes.room.status, "LOBBY");

    // 7. Kick guestB after joining
    const joinC = await emitAck(guestB, "room:join", {
      inviteCode,
      playerId: "u-charlie",
      playerName: "Charlie",
    });
    assert.strictEqual(joinC.ok, true);
    const kickedNotice = waitForEvent(guestB, "room:kicked", 3000);
    const kickRes = await emitAck(host, "room:kick", {
      playerId: "u-host",
      targetPlayerId: "u-charlie",
    });
    assert.strictEqual(kickRes.ok, true);
    const kickedData = await kickedNotice;
    assert.strictEqual(kickedData.roomId, roomId);

    // 8. Scoped Phone Controller isolation (phoneA belongs to pair_alpha -> reaches host, NEVER guest on pair_beta)
    let betaReceivedPhoneInput = false;
    guest.on("controller:input", () => {
      betaReceivedPhoneInput = true;
    });
    const hostInputPromise = waitForEvent(host, "controller:input", 3000);
    phoneA.emit("client:register", { role: "controller", pairToken: "pair_alpha" });
    phoneA.emit("controller:input", { pairToken: "pair_alpha", throttle: 0.9, steer: -0.4 });
    const received = await hostInputPromise;
    assert.strictEqual(received.throttle, 0.9);
    await new Promise((r) => setTimeout(r, 120));
    assert.strictEqual(betaReceivedPhoneInput, false, "Phone input leaked across pairToken!");

    // 8b. Single-laptop "default" phone controller compatibility check:
    // Disconnect guest and guestB (leaving only host -> 1 active game on pair_alpha), then verify legacy phone without ?pair= routes to host.
    guest.disconnect();
    guestB.disconnect();
    await new Promise((r) => setTimeout(r, 120));
    const defaultPhone = await connectClient("defaultPhone");
    const defaultPairStatus = waitForEvent(defaultPhone, "controller:pair-status", 3000);
    defaultPhone.emit("client:register", "controller");
    const pStatus = await defaultPairStatus;
    assert.strictEqual(pStatus.linked, true, "Single-laptop fallback should link default phone");

    const hostLegacyInput = waitForEvent(host, "controller:input", 3000);
    defaultPhone.emit("controller:input", { fire: true, moveY: 1 });
    const legacyReceived = await hostLegacyInput;
    assert.strictEqual(legacyReceived.fire, true);
    defaultPhone.disconnect();

    // 9. Reconnect guest for unexpected host disconnect failover test
    const guest2 = await connectClient("guest2");
    guest2.emit("client:register", { role: "game", pairToken: "pair_beta", playerId: "u-guest", playerName: "GuestBravo" });
    await emitAck(guest2, "room:join", { inviteCode, playerId: "u-guest", playerName: "GuestBravo" });

    const hostPromotedUpdate = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Host failover timeout")), 3000);
      const listener = (room) => {
        if (room.hostPlayerId === "u-guest") {
          clearTimeout(timer);
          guest2.off("room:state", listener);
          resolve(room);
        }
      };
      guest2.on("room:state", listener);
    });
    host.disconnect();
    const updatedAfterDrop = await hostPromotedUpdate;
    assert.strictEqual(updatedAfterDrop.hostPlayerId, "u-guest");
    assert.strictEqual(updatedAfterDrop.slots.realPlayers, 1);

    console.log("✓ Socket.IO & HTTP integration tests passed");
  } finally {
    for (const s of sockets) {
      try {
        s.disconnect();
      } catch {}
    }
    await server.close();
  }
}

(async () => {
  try {
    await runUnitTests();
    await runIntegrationTests();
    console.log("\nALL PHASE 1 SERVER TESTS PASSED");
    process.exit(0);
  } catch (err) {
    console.error("\nTEST FAILED:", err);
    process.exit(1);
  }
})();
