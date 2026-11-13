const crypto = require("crypto");

const TICK_RATE_MS = 50; // 20 updates per second
const MAX_SPEED_UNITS_PER_SEC = 28; // Anti-cheat max speed limit (sprinting + slight slope allowance)
const PLAYER_DISCONNECT_GRACE_MS = 15000;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function round(val, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(val * factor) / factor;
}

function createMatchManager(options = {}) {
  const getIo = () => options.io || (typeof options.getIo === "function" ? options.getIo() : null);
  const onMatchEnd = options.onMatchEnd || null;

  const matchesById = new Map();
  const playerToMatchId = new Map();
  const socketToPlayerId = new Map();

  function matchChannel(matchId) {
    return `match:${matchId}`;
  }

  function initMatch({ roomId, matchId, matchManifest, config, onBroadcast }) {
    if (!matchId) matchId = `m_${crypto.randomBytes(5).toString("hex")}`;

    const playersMap = new Map();

    // Register all human players from manifest
    if (Array.isArray(matchManifest?.humans)) {
      matchManifest.humans.forEach((h, index) => {
        // Spawn players in slight formation near ground center (or aircraft line)
        const spawnAngle = (index / Math.max(1, matchManifest.humans.length)) * Math.PI * 2;
        const spawnDist = 4 + index * 2;
        const initialX = Math.cos(spawnAngle) * spawnDist;
        const initialZ = Math.sin(spawnAngle) * spawnDist;

        playersMap.set(h.id, {
          id: h.id,
          name: h.name || `Player-${index + 1}`,
          teamId: h.teamId || index + 1,
          slotIndex: h.slotIndex ?? index,
          isHost: Boolean(h.isHost),
          isBot: false,
          socketId: null,
          connected: true,
          alive: true,
          hp: 100,
          maxHp: 100,
          armor: 100,
          helmet: 100,
          kills: 0,
          damageDealt: 0,
          position: { x: initialX, y: 1.0, z: initialZ },
          rotation: { yaw: 0, pitch: 0 },
          velocity: { x: 0, y: 0, z: 0 },
          animation: "idle",
          weaponId: "fist",
          aiming: false,
          firing: false,
          vehicleMode: "onFoot",
          firstSync: true,
          lastStateTime: Date.now(),
          graceTimer: null,
        });
        playerToMatchId.set(h.id, matchId);
      });
    }

    // Register bots from manifest
    if (Array.isArray(matchManifest?.bots)) {
      matchManifest.bots.forEach((b, index) => {
        const botAngle = (index / Math.max(1, matchManifest.bots.length)) * Math.PI * 2;
        const botDist = 20 + (index % 5) * 8;
        const initialX = Math.cos(botAngle) * botDist;
        const initialZ = Math.sin(botAngle) * botDist;

        playersMap.set(b.id, {
          id: b.id,
          name: b.name || `[BOT] ${b.id}`,
          teamId: b.teamId || 99,
          slotIndex: b.slotIndex ?? (matchManifest.humans?.length || 0) + index,
          isHost: false,
          isBot: true,
          difficulty: b.difficulty || "normal",
          profile: b.profile || "tactical",
          socketId: null,
          connected: true,
          alive: true,
          hp: 100,
          maxHp: 100,
          armor: 50,
          helmet: 50,
          kills: 0,
          damageDealt: 0,
          position: { x: initialX, y: 1.0, z: initialZ },
          rotation: { yaw: 0, pitch: 0 },
          velocity: { x: 0, y: 0, z: 0 },
          animation: "idle",
          weaponId: "m4a1",
          aiming: false,
          firing: false,
          vehicleMode: "onFoot",
          firstSync: true,
          lastStateTime: Date.now(),
          graceTimer: null,
        });
      });
    }

    const match = {
      matchId,
      roomId,
      config: config || {},
      matchManifest,
      status: "ACTIVE", // ACTIVE | FINISHED
      startedAt: Date.now(),
      tickCount: 0,
      players: playersMap,
      tickTimer: null,
      onBroadcast: onBroadcast || null,
    };

    // Start 20Hz Simulation & Snapshot Broadcast Loop
    match.tickTimer = setInterval(() => {
      runMatchTick(match);
    }, TICK_RATE_MS);

    matchesById.set(matchId, match);
    return match;
  }

  function runMatchTick(match) {
    if (!match || match.status !== "ACTIVE") return;

    match.tickCount += 1;
    const now = Date.now();

    // Check alive players
    let aliveHumans = 0;
    let aliveBots = 0;
    const activePlayersPayload = [];

    for (const p of match.players.values()) {
      if (p.alive) {
        if (p.isBot) aliveBots += 1;
        else if (p.connected) aliveHumans += 1;
      }

      // Compact representation for low-bandwidth 20Hz snapshot
      activePlayersPayload.push({
        id: p.id,
        name: p.name,
        teamId: p.teamId,
        isBot: p.isBot,
        alive: p.alive,
        hp: p.hp,
        armor: p.armor,
        pos: [round(p.position.x, 2), round(p.position.y, 2), round(p.position.z, 2)],
        rot: [round(p.rotation.yaw, 3), round(p.rotation.pitch, 3)],
        vel: [round(p.velocity.x, 2), round(p.velocity.z, 2)],
        anim: p.animation,
        wep: p.weaponId,
        aim: p.aiming,
        fire: p.firing,
        veh: p.vehicleMode,
      });
    }

    const snapshot = {
      matchId: match.matchId,
      tick: match.tickCount,
      timestamp: now,
      aliveCount: aliveHumans + aliveBots,
      aliveHumans,
      players: activePlayersPayload,
    };

    const activeIo = getIo();
    if (activeIo) {
      activeIo.to(matchChannel(match.matchId)).emit("match:snapshot", snapshot);
    }
    if (typeof match.onBroadcast === "function") {
      match.onBroadcast(snapshot);
    }
  }

  function handlePlayerJoinMatch({ matchId, playerId, socketId }) {
    const match = matchesById.get(matchId);
    if (!match) {
      return { ok: false, error: "MATCH_NOT_FOUND", message: "Match not found or expired." };
    }

    const player = match.players.get(playerId);
    if (!player) {
      return { ok: false, error: "PLAYER_NOT_IN_MATCH", message: "Player not listed in match." };
    }

    if (player.graceTimer) {
      clearTimeout(player.graceTimer);
      player.graceTimer = null;
    }

    player.socketId = socketId;
    player.connected = true;
    socketToPlayerId.set(socketId, playerId);
    playerToMatchId.set(playerId, matchId);

    return {
      ok: true,
      matchId,
      player: {
        id: player.id,
        name: player.name,
        teamId: player.teamId,
        hp: player.hp,
        armor: player.armor,
        position: player.position,
      },
      matchManifest: match.matchManifest,
    };
  }

  function handlePlayerStateUpdate({ playerId, matchId, state }) {
    if (!playerId || !state) return false;
    const resolvedMatchId = matchId || playerToMatchId.get(playerId);
    const match = resolvedMatchId ? matchesById.get(resolvedMatchId) : null;
    if (!match || match.status !== "ACTIVE") return false;

    const player = match.players.get(playerId);
    if (!player || !player.alive) return false;

    const now = Date.now();
    const dt = Math.max(0.001, (now - player.lastStateTime) / 1000);
    player.lastStateTime = now;

    // Position & Movement Validation
    if (state.position && typeof state.position === "object") {
      const nextX = Number(state.position.x);
      const nextY = Number(state.position.y);
      const nextZ = Number(state.position.z);

      if (Number.isFinite(nextX) && Number.isFinite(nextY) && Number.isFinite(nextZ)) {
        const dx = nextX - player.position.x;
        const dz = nextZ - player.position.z;
        const horizontalDist = Math.hypot(dx, dz);
        const speed = horizontalDist / dt;

        // First state update accepts spawn position directly
        if (player.firstSync || state.isInitial) {
          player.firstSync = false;
          player.position.x = nextX;
          player.position.y = nextY;
          player.position.z = nextZ;
        } else if (speed <= MAX_SPEED_UNITS_PER_SEC || state.vehicleMode === "driving" || state.isDropping) {
          player.position.x = nextX;
          player.position.y = nextY;
          player.position.z = nextZ;
        } else {
          // Clamp move distance to maximum allowable travel
          const maxAllowedDist = MAX_SPEED_UNITS_PER_SEC * dt;
          const ratio = maxAllowedDist / horizontalDist;
          player.position.x += dx * ratio;
          player.position.y = nextY;
          player.position.z += dz * ratio;
        }
      }
    }

    // Rotation
    if (state.rotation && typeof state.rotation === "object") {
      const yaw = Number(state.rotation.yaw);
      const pitch = Number(state.rotation.pitch);
      if (Number.isFinite(yaw)) player.rotation.yaw = yaw;
      if (Number.isFinite(pitch)) player.rotation.pitch = clamp(pitch, -1.2, 1.2);
    }

    // Velocity
    if (state.velocity && typeof state.velocity === "object") {
      const vx = Number(state.velocity.x) || 0;
      const vz = Number(state.velocity.z) || 0;
      player.velocity.x = vx;
      player.velocity.z = vz;
    }

    // Animation & Combat Stance
    if (typeof state.animation === "string") {
      player.animation = state.animation.slice(0, 32);
    }
    if (typeof state.weaponId === "string") {
      player.weaponId = state.weaponId.slice(0, 24);
    }
    if (state.aiming !== undefined) {
      player.aiming = Boolean(state.aiming);
    }
    if (state.firing !== undefined) {
      player.firing = Boolean(state.firing);
    }
    if (typeof state.vehicleMode === "string") {
      player.vehicleMode = state.vehicleMode;
    }

    return true;
  }

  function handlePlayerDamage({
    matchId = null,
    attackerPlayerId,
    targetPlayerId,
    damage = 25,
    isHeadshot = false,
    weaponId = "m4a1",
  }) {
    const resolvedMatchId = matchId || playerToMatchId.get(targetPlayerId);
    const match = resolvedMatchId ? matchesById.get(resolvedMatchId) : null;
    if (!match || match.status !== "ACTIVE") {
      return { ok: false, error: "MATCH_NOT_ACTIVE" };
    }

    const target = match.players.get(targetPlayerId);
    if (!target || !target.alive) {
      return { ok: false, error: "TARGET_NOT_ALIVE" };
    }

    const attacker = match.players.get(attackerPlayerId);

    // Friendly fire restriction (Solo allows all, Duo/Squad forbids same teamId)
    if (attacker && attacker.id !== target.id && attacker.teamId && attacker.teamId === target.teamId) {
      return { ok: false, error: "FRIENDLY_FIRE_BLOCKED", message: "Cannot damage teammates." };
    }

    // Calculate damage: Armor absorbs 50% of damage until depleted
    let finalDamage = Number(damage) || 20;
    if (isHeadshot) {
      finalDamage = Math.round(finalDamage * 1.85); // Headshot multiplier
    }

    let armorAbsorbed = 0;
    if (target.armor > 0) {
      armorAbsorbed = Math.min(target.armor, Math.round(finalDamage * 0.5));
      target.armor = Math.max(0, target.armor - armorAbsorbed);
    }
    const healthDamage = finalDamage - armorAbsorbed;
    target.hp = Math.max(0, target.hp - healthDamage);

    if (attacker) {
      attacker.damageDealt = (attacker.damageDealt || 0) + finalDamage;
    }

    const isEliminated = target.hp <= 0;
    if (isEliminated) {
      target.alive = false;
      target.hp = 0;
      target.animation = "knockedOut";
      if (attacker) {
        attacker.kills = (attacker.kills || 0) + 1;
      }
    }

    const damagePayload = {
      matchId: resolvedMatchId,
      targetId: target.id,
      attackerId: attacker?.id || null,
      attackerName: attacker?.name || "Zone",
      targetName: target.name,
      damage: finalDamage,
      isHeadshot: Boolean(isHeadshot),
      remainingHp: target.hp,
      remainingArmor: target.armor,
      eliminated: isEliminated,
      weaponId: weaponId || attacker?.weaponId || "m4a1",
    };

    const activeIo = getIo();
    if (activeIo) {
      activeIo.to(matchChannel(resolvedMatchId)).emit("player:damaged", damagePayload);
      if (isEliminated) {
        activeIo.to(matchChannel(resolvedMatchId)).emit("match:elimination", {
          matchId: resolvedMatchId,
          victimId: target.id,
          victimName: target.name,
          attackerId: attacker?.id || null,
          attackerName: attacker?.name || "Zone",
          weaponId,
          isHeadshot,
        });
      }
    }

    return {
      ok: true,
      damagePayload,
    };
  }

  function handleSocketDisconnect({ socketId }) {
    const playerId = socketToPlayerId.get(socketId);
    if (!playerId) return;
    socketToPlayerId.delete(socketId);

    const matchId = playerToMatchId.get(playerId);
    const match = matchId ? matchesById.get(matchId) : null;
    if (!match) return;

    const player = match.players.get(playerId);
    if (!player) return;

    player.connected = false;
    player.socketId = null;

    if (player.graceTimer) clearTimeout(player.graceTimer);
    player.graceTimer = setTimeout(() => {
      // If player didn't reconnect, eliminate from match
      if (!player.connected && player.alive) {
        player.alive = false;
        player.hp = 0;
        player.animation = "knockedOut";
        const activeIo = getIo();
        if (activeIo) {
          activeIo.to(matchChannel(matchId)).emit("player:damaged", {
            matchId,
            targetId: player.id,
            attackerId: null,
            attackerName: "Disconnected",
            targetName: player.name,
            damage: 100,
            remainingHp: 0,
            remainingArmor: 0,
            eliminated: true,
          });
        }
      }
    }, PLAYER_DISCONNECT_GRACE_MS);
  }

  function endMatch(matchId, reason = "COMPLETED") {
    const match = matchesById.get(matchId);
    if (!match) return;

    match.status = "FINISHED";
    if (match.tickTimer) {
      clearInterval(match.tickTimer);
      match.tickTimer = null;
    }

    for (const p of match.players.values()) {
      if (p.graceTimer) clearTimeout(p.graceTimer);
      playerToMatchId.delete(p.id);
    }

    const activeIo = getIo();
    if (activeIo) {
      activeIo.to(matchChannel(matchId)).emit("match:ended", {
        matchId,
        reason,
        endedAt: Date.now(),
      });
    }

    matchesById.delete(matchId);
    onMatchEnd?.(match);
  }

  function getMatch(matchId) {
    return matchesById.get(matchId) || null;
  }

  function getMatchForPlayer(playerId) {
    const matchId = playerToMatchId.get(playerId);
    return matchId ? matchesById.get(matchId) || null : null;
  }

  return {
    initMatch,
    handlePlayerJoinMatch,
    handlePlayerStateUpdate,
    handlePlayerDamage,
    handleSocketDisconnect,
    endMatch,
    getMatch,
    getMatchForPlayer,
    matchChannel,
  };
}

module.exports = {
  createMatchManager,
  TICK_RATE_MS,
  MAX_SPEED_UNITS_PER_SEC,
};
