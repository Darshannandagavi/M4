const assert = require("assert");
const { io: ioClient } = require("../client/node_modules/socket.io-client");
const { createMatchManager } = require("./matchManager");
const { startRelayServer } = require("./server");

function emitAck(socket, event, payload) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for ack on ${event}`)), 5000);
    socket.emit(event, payload, (res) => {
      clearTimeout(timer);
      resolve(res);
    });
  });
}

function waitForEvent(socket, event, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for event ${event}`)), timeoutMs);
    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function runMatchUnitTests() {
  console.log("Running matchManager unit tests...");

  let broadcastSnapshots = [];
  const mm = createMatchManager({
    onMatchEnd: () => {},
  });

  const matchManifest = {
    matchId: "m_test123",
    roomId: "rm_abc",
    humans: [
      { id: "p1", name: "Alpha", teamId: 1, slotIndex: 0, isHost: true },
      { id: "p2", name: "Bravo", teamId: 2, slotIndex: 1, isHost: false },
    ],
    bots: Array.from({ length: 48 }, (_, i) => ({
      id: `bot_${i}`,
      name: `[BOT] Test-${i}`,
      teamId: Math.floor(i / 2) + 3,
      slotIndex: i + 2,
    })),
  };

  const match = mm.initMatch({
    roomId: "rm_abc",
    matchId: "m_test123",
    matchManifest,
    config: { mode: "solo" },
    onBroadcast: (snap) => broadcastSnapshots.push(snap),
  });

  assert.strictEqual(match.matchId, "m_test123");
  assert.strictEqual(match.players.size, 50, "Must have exactly 50 participants");

  // Verify Player 1 can join
  const joinRes1 = mm.handlePlayerJoinMatch({
    matchId: "m_test123",
    playerId: "p1",
    socketId: "sock_1",
  });
  assert.strictEqual(joinRes1.ok, true);
  assert.strictEqual(joinRes1.player.name, "Alpha");

  // Verify state update with valid position & speed
  const updateRes1 = mm.handlePlayerStateUpdate({
    playerId: "p1",
    matchId: "m_test123",
    state: {
      position: { x: 5, y: 1, z: 10 },
      rotation: { yaw: 1.2, pitch: 0.1 },
      velocity: { x: 2, z: 3 },
      animation: "running",
      weaponId: "m4a1",
      aiming: true,
      firing: false,
    },
  });
  assert.strictEqual(updateRes1, true);

  const p1 = match.players.get("p1");
  assert.strictEqual(p1.position.x, 5);
  assert.strictEqual(p1.position.z, 10);
  assert.strictEqual(p1.animation, "running");
  assert.strictEqual(p1.aiming, true);

  // Test Anti-Teleport validation: impossible travel distance in 0.05s
  mm.handlePlayerStateUpdate({
    playerId: "p1",
    matchId: "m_test123",
    state: {
      position: { x: 99999, y: 1, z: 99999 },
    },
  });
  assert(p1.position.x < 100, "Teleport hack must be clamped to max speed limit");

  // Test Damage & Armor system
  assert.strictEqual(p1.hp, 100);
  assert.strictEqual(p1.armor, 100);

  // P2 shoots P1 with 40 damage
  const dmgRes = mm.handlePlayerDamage({
    attackerPlayerId: "p2",
    targetPlayerId: "p1",
    damage: 40,
    isHeadshot: false,
    weaponId: "m4a1",
  });
  assert.strictEqual(dmgRes.ok, true);
  // 50% absorbed by armor (20 armor, 20 hp)
  assert.strictEqual(p1.armor, 80);
  assert.strictEqual(p1.hp, 80);

  // P2 shoots P1 with headshot for remaining health
  const lethalRes = mm.handlePlayerDamage({
    attackerPlayerId: "p2",
    targetPlayerId: "p1",
    damage: 100,
    isHeadshot: true,
    weaponId: "m4a1",
  });
  assert.strictEqual(lethalRes.ok, true);
  assert.strictEqual(p1.alive, false);
  assert.strictEqual(p1.hp, 0);
  assert.strictEqual(p1.animation, "knockedOut");

  // Friendly Fire protection in Duo/Squad
  const pTeam1A = { id: "ta", name: "TeamA", teamId: 10, isBot: false };
  const pTeam1B = { id: "tb", name: "TeamB", teamId: 10, isBot: false };
  match.players.set("ta", { ...pTeam1A, alive: true, hp: 100, armor: 0 });
  match.players.set("tb", { ...pTeam1B, alive: true, hp: 100, armor: 0 });
  const ffRes = mm.handlePlayerDamage({
    matchId: "m_test123",
    attackerPlayerId: "ta",
    targetPlayerId: "tb",
    damage: 30,
  });
  assert.strictEqual(ffRes.ok, false);
  assert.strictEqual(ffRes.error, "FRIENDLY_FIRE_BLOCKED");

  mm.endMatch("m_test123");
  console.log("✓ matchManager unit tests passed");
}

async function runMatchIntegrationTests() {
  console.log("Running Socket.IO match multiplayer integration tests...");

  // Start ephemeral server
  const serverInstance = startRelayServer(0, { deferListen: true });
  await new Promise((resolve) => serverInstance.httpServer.listen(0, "127.0.0.1", resolve));
  const port = serverInstance.httpServer.address().port;
  const serverUrl = `http://127.0.0.1:${port}`;

  const client1 = ioClient(serverUrl, { transports: ["websocket"] });
  const client2 = ioClient(serverUrl, { transports: ["websocket"] });

  await Promise.all([
    new Promise((resolve) => client1.on("connect", resolve)),
    new Promise((resolve) => client2.on("connect", resolve)),
  ]);

  // Identify players
  await emitAck(client1, "auth:identify", { playerId: "p_host", playerName: "HostPlayer" });
  await emitAck(client2, "auth:identify", { playerId: "p_guest", playerName: "GuestPlayer" });

  // Host creates custom room with 50 slots
  const createRes = await emitAck(client1, "room:create", {
    config: { mode: "solo", maxPlayers: 50, botsEnabled: true, autoFillBots: true, countdownSec: 3 },
  });
  assert.strictEqual(createRes.ok, true);
  const inviteCode = createRes.room.inviteCode;

  // Guest joins room
  const joinRes = await emitAck(client2, "room:join", { inviteCode });
  assert.strictEqual(joinRes.ok, true);

  // Both ready up
  await emitAck(client2, "room:ready", { ready: true });

  // Set up match:started listener on both clients
  const matchStartedP1 = waitForEvent(client1, "match:started");
  const matchStartedP2 = waitForEvent(client2, "match:started");

  // Host forces instant match start
  await emitAck(client1, "room:start", { force: true });

  const [matchPayload1, matchPayload2] = await Promise.all([matchStartedP1, matchStartedP2]);
  assert.strictEqual(matchPayload1.matchManifest.counts.humans, 2);
  assert.strictEqual(matchPayload1.matchManifest.counts.bots, 48);
  assert.strictEqual(matchPayload1.matchManifest.counts.total, 50);

  const matchId = matchPayload1.matchId || matchPayload1.matchManifest.matchId;

  // Both clients join match channel
  const joinMatchRes1 = await emitAck(client1, "match:join", { matchId, playerId: "p_host" });
  const joinMatchRes2 = await emitAck(client2, "match:join", { matchId, playerId: "p_guest" });
  assert.strictEqual(joinMatchRes1.ok, true);
  assert.strictEqual(joinMatchRes2.ok, true);

  // Client 1 moves: send player:state
  client1.emit("player:state", {
    matchId,
    playerId: "p_host",
    position: { x: 12.5, y: 1.0, z: -8.4 },
    rotation: { yaw: 2.14, pitch: -0.2 },
    velocity: { x: 4.2, z: 1.1 },
    animation: "run",
    weaponId: "ak47",
    aiming: true,
    firing: false,
  });

  // Client 2 must receive match:snapshot containing Client 1's position and rotation
  const snapshotP2 = await waitForEvent(client2, "match:snapshot");
  assert(snapshotP2.players.length >= 2);
  const p1Remote = snapshotP2.players.find((p) => p.id === "p_host");
  assert(p1Remote, "Client 2 must receive Client 1 in snapshot");
  assert.strictEqual(p1Remote.pos[0], 12.5);
  assert.strictEqual(p1Remote.pos[2], -8.4);
  assert.strictEqual(p1Remote.anim, "run");
  assert.strictEqual(p1Remote.wep, "ak47");
  assert.strictEqual(p1Remote.aim, true);

  // Client 2 damages Client 1
  const damageEventP1 = waitForEvent(client1, "player:damaged");
  const dmgRes = await emitAck(client2, "player:damage", {
    attackerId: "p_guest",
    targetId: "p_host",
    damage: 35,
    isHeadshot: false,
    weaponId: "m4a1",
  });
  assert.strictEqual(dmgRes.ok, true);

  const dmgEvent = await damageEventP1;
  assert.strictEqual(dmgEvent.targetId, "p_host");
  assert.strictEqual(dmgEvent.attackerName, "GuestPlayer");
  assert(dmgEvent.remainingHp < 100);

  client1.disconnect();
  client2.disconnect();
  await serverInstance.close();
  console.log("✓ Socket.IO match multiplayer integration tests passed");
}

async function main() {
  try {
    await runMatchUnitTests();
    await runMatchIntegrationTests();
    console.log("\nALL PHASE 1 MATCH MULTIPLAYER TESTS PASSED\n");
    process.exit(0);
  } catch (err) {
    console.error("\nTEST FAILED:", err);
    process.exit(1);
  }
}

main();
