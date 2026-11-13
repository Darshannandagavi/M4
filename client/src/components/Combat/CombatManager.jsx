import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import CharacterModel from "../Character/CharacterModel";
import WorldHtml from "../UI/WorldHtml";
import { WEAPONS } from "../../config/gameConstants";

const BOT_NAMES = ["Kelly", "Hayato", "Alok", "Chrono", "Moco", "Maxim"];
const BOT_COUNT = BOT_NAMES.length; // 6 bots + 1 player = 7 combatants
const BOT_SPEED = 2.7;
const BOT_BURST_DAMAGE = 14;

const _rayOrigin = new THREE.Vector3();
const _rayDir = new THREE.Vector3();
const _muzzleOrigin = new THREE.Vector3();
const _muzzleDir = new THREE.Vector3();
const _botMoveDir = new THREE.Vector3();
const _botEye = new THREE.Vector3();
const _targetChest = new THREE.Vector3();
const _targetHead = new THREE.Vector3();
const _tempToTarget = new THREE.Vector3();
const _losDir = new THREE.Vector3();
const _tracerDir = new THREE.Vector3();
const _tracerMid = new THREE.Vector3();
const _shotTarget = new THREE.Vector3();
const _down = new THREE.Vector3(0, -1, 0);
const _worldNormal = new THREE.Vector3();

const _groundRay = new THREE.Raycaster();
const _shotRay = new THREE.Raycaster();
const _muzzleRay = new THREE.Raycaster();
const _losRay = new THREE.Raycaster();
const _botProbeRay = new THREE.Raycaster();

const _nearbyMeshes = [];

// Shared hitbox resources across all bots (allocated once)
const _bodyHitboxGeo = new THREE.CylinderGeometry(0.38, 0.38, 1.35, 8);
const _headHitboxGeo = new THREE.SphereGeometry(0.26, 8, 8);
const _hitboxMat = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

const TRACER_POOL_SIZE = 16;

function isGroundFace(hit) {
  if (!hit.face) return false;
  _worldNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
  return Math.abs(_worldNormal.y) > 0.45;
}

function getColumnMeshes(colliders, x, z, pad = 0.5) {
  _nearbyMeshes.length = 0;
  if (Array.isArray(colliders) && colliders.length > 0) {
    for (let i = 0; i < colliders.length; i += 1) {
      const c = colliders[i];
      if (!c || !c.mesh) continue;
      if (c.box) {
        if (
          x >= c.box.min.x - pad &&
          x <= c.box.max.x + pad &&
          z >= c.box.min.z - pad &&
          z <= c.box.max.z + pad
        ) {
          _nearbyMeshes.push(c.mesh);
        }
      } else {
        _nearbyMeshes.push(c.mesh);
      }
    }
    if (_nearbyMeshes.length > 0) return _nearbyMeshes;
  }
  if (colliders?.meshes?.length) return colliders.meshes;
  return _nearbyMeshes;
}

function sampleGroundY(colliders, x, z, fallbackY = 1) {
  if (!colliders || (colliders.ready === false) || (!colliders.meshes?.length && !colliders.length)) {
    return fallbackY;
  }

  const meshes = getColumnMeshes(colliders, x, z, 1.0);
  if (!meshes.length) return fallbackY;

  const probeStartY = Math.max(fallbackY + 35, 60);
  _rayOrigin.set(x, probeStartY, z);
  _groundRay.set(_rayOrigin, _down);
  _groundRay.far = 120;

  const hits = _groundRay.intersectObjects(meshes, false);
  let bestY = null;

  for (let i = 0; i < hits.length; i += 1) {
    const hit = hits[i];
    if (!isGroundFace(hit)) continue;
    const y = hit.point.y;
    if (bestY === null || (y > bestY && y <= probeStartY)) {
      bestY = y;
    }
  }

  return bestY !== null ? bestY : fallbackY;
}

function createBot(id, centerPos, colliders) {
  const name = BOT_NAMES[id] || `Player_${id + 1}`;
  const angle = (id / BOT_COUNT) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
  // Spread bots across Bermuda island territory (14m to 50m radius)
  const dist = 14 + id * 5.5 + Math.random() * 6;
  const x = (centerPos?.x || 0) + Math.cos(angle) * dist;
  const z = (centerPos?.z || 0) + Math.sin(angle) * dist;
  const startY = centerPos?.y ?? 1;
  const y = sampleGroundY(colliders, x, z, startY);

  const patrolTarget = new THREE.Vector3(
    THREE.MathUtils.clamp(x + (Math.random() - 0.5) * 24, -55, 55),
    y,
    THREE.MathUtils.clamp(z + (Math.random() - 0.5) * 24, -55, 55),
  );

  return {
    id,
    name,
    position: new THREE.Vector3(x, y, z),
    yaw: angle + Math.PI,
    hp: 100,
    maxHp: 100,
    state: "patrol", // "patrol" | "combat" | "relocating" | "knockedOut"
    anim: "walk",
    patrolTarget,
    patrolTimer: 5 + Math.random() * 6,
    burstShotsTarget: 1, // 1 or 2 shots
    burstShotsFired: 0,
    shotTimer: 0,
    relocateTimer: 0,
    relocateDir: new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
    attackCooldown: 1.5 + Math.random() * 2.5,
    scanTimer: id * 0.045, // Staggered AI perception timer
    probeTimer: id * 0.03, // Staggered wall-probe timer
    lastGroundX: x,
    lastGroundZ: z,
    targetType: null, // "player" | "bot"
    targetId: null,
  };
}

export default function CombatManager({
  enabled = true,
  characterRef,
  collidersRef,
  weaponId = "m4a1",
  firing = false,
  canFire = true,
  remoteInputRef = null,
  dragFireUp = false,
  dragUpRatio = 0,
  resetToken = 0,
  collidersReadyVersion = 0,
  onShotEvaluated,
  onPlayerDamaged,
  onBotEliminated,
  onAllBotsEliminated,
  onAliveCountChange,
  onAimAssistChange,
  onPunch,
  onBotsPositionUpdate,
}) {
  const { camera } = useThree();
  const botsRef = useRef([]);
  const botGroupRefs = useRef({});
  const hitboxRefs = useRef({});
  const fireCooldownRef = useRef(0);
  const tracersGroupRef = useRef(null);
  const tracerPoolRef = useRef([]);
  const tracerIndexRef = useRef(0);
  const needsGroundSnapRef = useRef(true);
  const popupTimeoutsRef = useRef(new Set());
  const lastBotPosUpdateRef = useRef(0);
  const prevAimAssistRef = useRef({ locked: false, headshot: false, botId: null });

  const [botsHud, setBotsHud] = useState([]);
  const [damagePopups, setDamagePopups] = useState([]);

  // Clear pending popup timers on unmount
  useEffect(() => {
    const timers = popupTimeoutsRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
    };
  }, []);

  // Initialize Tracer Mesh Pool & dispose cleanly on unmount
  useEffect(() => {
    const group = tracersGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const pool = [];
    const geom = new THREE.CylinderGeometry(0.016, 0.016, 1, 6);
    geom.rotateX(Math.PI / 2);

    for (let i = 0; i < TRACER_POOL_SIZE; i += 1) {
      const mat = new THREE.MeshBasicMaterial({
        color: "#ffdd57",
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.visible = false;
      mesh.frustumCulled = false;
      group.add(mesh);
      pool.push({ mesh, mat, life: 0 });
    }

    tracerPoolRef.current = pool;

    return () => {
      for (let i = 0; i < pool.length; i += 1) {
        group.remove(pool[i].mesh);
        pool[i].mat.dispose();
      }
      geom.dispose();
      tracerPoolRef.current = [];
    };
  }, []);

  const spawnTracer = (start, end, colorHex = "#ffdd57") => {
    const pool = tracerPoolRef.current;
    if (!pool || !pool.length) return;

    const item = pool[tracerIndexRef.current % pool.length];
    tracerIndexRef.current += 1;

    _tracerDir.subVectors(end, start);
    const len = _tracerDir.length();
    if (len < 0.1) return;

    _tracerMid.addVectors(start, end).multiplyScalar(0.5);
    item.mesh.position.copy(_tracerMid);
    item.mesh.lookAt(end);
    item.mesh.scale.set(1, 1, len);
    item.mat.color.set(colorHex);
    item.mesh.visible = true;
    item.life = 0.09;
  };

  // Initialize or reset bots
  useEffect(() => {
    const colliders = collidersRef.current;
    // Always spawn bots around Bermuda playfield center (not airplane altitude)
    const startPos = { x: 0, y: 1, z: 0 };

    const initialBots = Array.from({ length: BOT_COUNT }, (_, idx) =>
      createBot(idx, startPos, colliders),
    );
    botsRef.current = initialBots;
    needsGroundSnapRef.current = !colliders?.ready;

    setBotsHud(
      initialBots.map((b) => ({
        id: b.id,
        name: b.name,
        hp: b.hp,
        maxHp: b.maxHp,
        anim: b.anim,
        state: b.state,
      })),
    );

    // Initial alive count: 6 bots + 1 player = 7
    onAliveCountChange?.(BOT_COUNT + 1);
  }, [collidersRef, resetToken, onAliveCountChange]);

  // Snap bot heights to actual Bermuda terrain as soon as OpenWorldMap BVH finishes
  useEffect(() => {
    if (!needsGroundSnapRef.current) return;
    const colliders = collidersRef.current;
    if (!colliders?.ready) return;

    const bots = botsRef.current;
    for (let i = 0; i < bots.length; i += 1) {
      const b = bots[i];
      if (b.state === "knockedOut") continue;
      const snappedY = sampleGroundY(colliders, b.position.x, b.position.z, 1);
      b.position.y = snappedY;
      b.patrolTarget.y = snappedY;
      b.lastGroundX = b.position.x;
      b.lastGroundZ = b.position.z;
    }
    needsGroundSnapRef.current = false;
  }, [collidersRef, collidersReadyVersion, resetToken]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    fireCooldownRef.current = Math.max(0, fireCooldownRef.current - dt);

    // Update tracers lifespan
    const pool = tracerPoolRef.current;
    if (pool) {
      for (let i = 0; i < pool.length; i += 1) {
        const t = pool[i];
        if (t.mesh.visible) {
          t.life -= dt;
          if (t.life <= 0) {
            t.mesh.visible = false;
          }
        }
      }
    }

    const playerPos = enabled ? characterRef?.current?.position : null;
    const colliders = collidersRef.current;
    const collidersReady = Boolean(
      colliders && colliders.ready !== false && (colliders.meshes?.length || colliders.length),
    );
    const worldMeshes = collidersReady
      ? colliders.meshes || colliders.map((c) => c.mesh).filter(Boolean)
      : [];

    let hudNeedsUpdate = false;
    const bots = botsRef.current;

    // AI Bots Simulation Loop
    for (let i = 0; i < bots.length; i += 1) {
      const bot = bots[i];
      const botObj = botGroupRefs.current[bot.id];
      if (!botObj) continue;

      // 1. Eliminated / Knocked Out Bot (No Respawn in Battle Royale)
      if (bot.state === "knockedOut") {
        botObj.position.copy(bot.position);
        botObj.rotation.y = bot.yaw;
        continue;
      }

      bot.attackCooldown = Math.max(0, bot.attackCooldown - dt);
      bot.probeTimer -= dt;
      bot.scanTimer -= dt;

      // -------------------------------------------------------------
      // 2. STATE: RELOCATING (Ran away after firing 1-2 shots)
      // -------------------------------------------------------------
      if (bot.state === "relocating") {
        bot.relocateTimer -= dt;
        bot.anim = "run";

        const runYaw = Math.atan2(bot.relocateDir.x, bot.relocateDir.z);
        let diffYaw = runYaw - bot.yaw;
        diffYaw = Math.atan2(Math.sin(diffYaw), Math.cos(diffYaw));
        bot.yaw += diffYaw * Math.min(1, 8 * dt);

        _botMoveDir.copy(bot.relocateDir);

        // Throttled obstacle avoidance while relocating
        if (worldMeshes.length && bot.probeTimer <= 0) {
          bot.probeTimer = 0.14;
          const nearby = getColumnMeshes(colliders, bot.position.x, bot.position.z, 2.2);
          if (nearby.length) {
            _botEye.set(bot.position.x, bot.position.y + 0.85, bot.position.z);
            _botProbeRay.set(_botEye, _botMoveDir);
            _botProbeRay.far = 1.6;

            const probeHits = _botProbeRay.intersectObjects(nearby, false);
            for (let h = 0; h < probeHits.length; h += 1) {
              const hit = probeHits[h];
              if (!hit.face) continue;
              _worldNormal
                .copy(hit.face.normal)
                .transformDirection(hit.object.matrixWorld);
              if (Math.abs(_worldNormal.y) < 0.65) {
                _botMoveDir
                  .addScaledVector(_worldNormal, -_botMoveDir.dot(_worldNormal))
                  .normalize();
                bot.relocateDir.copy(_botMoveDir);
                break;
              }
            }
          }
        }

        const sprintSpeed = BOT_SPEED * 1.4;
        bot.position.x += _botMoveDir.x * sprintSpeed * dt;
        bot.position.z += _botMoveDir.z * sprintSpeed * dt;

        if (
          collidersReady &&
          Math.hypot(bot.position.x - bot.lastGroundX, bot.position.z - bot.lastGroundZ) > 0.35
        ) {
          const groundY = sampleGroundY(
            colliders,
            bot.position.x,
            bot.position.z,
            bot.position.y || 62,
          );
          bot.position.y = THREE.MathUtils.lerp(bot.position.y, groundY, 0.35);
          bot.lastGroundX = bot.position.x;
          bot.lastGroundZ = bot.position.z;
        }

        if (bot.relocateTimer <= 0) {
          bot.state = "patrol";
          bot.anim = "walk";
          bot.patrolTimer = 6.0 + Math.random() * 6.0;
          bot.attackCooldown = 2.0 + Math.random() * 2.5;
          bot.patrolTarget.set(
            THREE.MathUtils.clamp(bot.position.x + (Math.random() - 0.5) * 28, -55, 55),
            bot.position.y,
            THREE.MathUtils.clamp(bot.position.z + (Math.random() - 0.5) * 28, -55, 55),
          );
          hudNeedsUpdate = true;
        }

        botObj.position.copy(bot.position);
        botObj.rotation.y = bot.yaw;
        continue;
      }

      // -------------------------------------------------------------
      // 3. STATE: COMBAT (Fires 1 or 2 burst shots, then relocates)
      // -------------------------------------------------------------
      if (bot.state === "combat") {
        let targetPosition = null;
        let otherBotTarget = null;

        if (bot.targetType === "player" && playerPos) {
          targetPosition = playerPos;
        } else if (bot.targetType === "bot") {
          for (let j = 0; j < bots.length; j += 1) {
            if (bots[j].id === bot.targetId && bots[j].state !== "knockedOut") {
              otherBotTarget = bots[j];
              targetPosition = otherBotTarget.position;
              break;
            }
          }
        }

        if (!targetPosition) {
          bot.state = "patrol";
          bot.anim = "walk";
          bot.targetType = null;
          bot.targetId = null;
          hudNeedsUpdate = true;
          botObj.position.copy(bot.position);
          botObj.rotation.y = bot.yaw;
          continue;
        }

        const dx = targetPosition.x - bot.position.x;
        const dz = targetPosition.z - bot.position.z;
        const aimYaw = Math.atan2(dx, dz);
        let diffYaw = aimYaw - bot.yaw;
        diffYaw = Math.atan2(Math.sin(diffYaw), Math.cos(diffYaw));
        bot.yaw += diffYaw * Math.min(1, 10 * dt);

        bot.anim = "idle";
        bot.shotTimer -= dt;

        if (bot.shotTimer <= 0) {
          _botEye.set(bot.position.x, bot.position.y + 1.35, bot.position.z);
          _targetChest.set(
            targetPosition.x,
            targetPosition.y + 1.2,
            targetPosition.z,
          );

          _losDir.subVectors(_targetChest, _botEye);
          const losDist = _losDir.length();
          _losDir.normalize();

          let hasClearLos = true;
          if (worldMeshes.length && losDist > 0.01) {
            _losRay.set(_botEye, _losDir);
            _losRay.far = losDist;
            const obstructions = _losRay.intersectObjects(worldMeshes, false);
            hasClearLos =
              obstructions.length === 0 || obstructions[0].distance >= losDist - 0.5;
          }

          if (hasClearLos) {
            spawnTracer(_botEye, _targetChest, "#ff3b5c");

            if (bot.targetType === "player") {
              onPlayerDamaged?.(BOT_BURST_DAMAGE);
            } else if (otherBotTarget && otherBotTarget.state !== "knockedOut") {
              otherBotTarget.hp = Math.max(0, otherBotTarget.hp - BOT_BURST_DAMAGE);
              if (otherBotTarget.hp <= 0) {
                otherBotTarget.state = "knockedOut";
                otherBotTarget.anim = "knockedOut";
                onBotEliminated?.(otherBotTarget, bot.name, false);

                let living = 0;
                for (let k = 0; k < bots.length; k += 1) {
                  if (bots[k].state !== "knockedOut") living += 1;
                }
                onAliveCountChange?.(living + 1);

                if (living === 0) {
                  onAllBotsEliminated?.();
                }
              }
            }
          }

          bot.burstShotsFired += 1;

          if (bot.burstShotsFired < bot.burstShotsTarget) {
            bot.shotTimer = 0.32;
          } else {
            bot.state = "relocating";
            bot.anim = "run";

            const awayAngle = Math.atan2(-dx, -dz) + (Math.random() - 0.5) * 1.6;
            bot.relocateDir.set(Math.sin(awayAngle), 0, Math.cos(awayAngle)).normalize();
            bot.relocateTimer = 4.5 + Math.random() * 3.5;
            bot.targetType = null;
            bot.targetId = null;
            hudNeedsUpdate = true;
          }
        }

        botObj.position.copy(bot.position);
        botObj.rotation.y = bot.yaw;
        continue;
      }

      // -------------------------------------------------------------
      // 4. STATE: PATROL (Wandering independently, exploring map)
      // -------------------------------------------------------------
      bot.patrolTimer -= dt;
      bot.anim = "walk";

      const pdx = bot.patrolTarget.x - bot.position.x;
      const pdz = bot.patrolTarget.z - bot.position.z;
      const distToPatrol = Math.hypot(pdx, pdz);

      if (distToPatrol < 3.0 || bot.patrolTimer <= 0) {
        const randAngle = Math.random() * Math.PI * 2;
        const randDist = 10 + Math.random() * 24;
        bot.patrolTarget.set(
          THREE.MathUtils.clamp(bot.position.x + Math.cos(randAngle) * randDist, -55, 55),
          bot.position.y,
          THREE.MathUtils.clamp(bot.position.z + Math.sin(randAngle) * randDist, -55, 55),
        );
        bot.patrolTimer = 6.0 + Math.random() * 6.0;
      }

      const patrolYaw = Math.atan2(pdx, pdz);
      let diffYaw = patrolYaw - bot.yaw;
      diffYaw = Math.atan2(Math.sin(diffYaw), Math.cos(diffYaw));
      bot.yaw += diffYaw * Math.min(1, 4 * dt);

      _botMoveDir.set(Math.sin(bot.yaw), 0, Math.cos(bot.yaw)).normalize();

      // Throttled wall / building collision avoidance
      if (worldMeshes.length && bot.probeTimer <= 0) {
        bot.probeTimer = 0.16;
        const nearby = getColumnMeshes(colliders, bot.position.x, bot.position.z, 2.0);
        if (nearby.length) {
          _botEye.set(bot.position.x, bot.position.y + 0.85, bot.position.z);
          _botProbeRay.set(_botEye, _botMoveDir);
          _botProbeRay.far = 1.3;

          const probeHits = _botProbeRay.intersectObjects(nearby, false);
          for (let h = 0; h < probeHits.length; h += 1) {
            const hit = probeHits[h];
            if (!hit.face) continue;
            _worldNormal
              .copy(hit.face.normal)
              .transformDirection(hit.object.matrixWorld);
            if (Math.abs(_worldNormal.y) < 0.65) {
              _botMoveDir
                .addScaledVector(_worldNormal, -_botMoveDir.dot(_worldNormal))
                .normalize();
              break;
            }
          }
        }
      }

      bot.position.x += _botMoveDir.x * (BOT_SPEED * 0.75) * dt;
      bot.position.z += _botMoveDir.z * (BOT_SPEED * 0.75) * dt;

      if (
        collidersReady &&
        Math.hypot(bot.position.x - bot.lastGroundX, bot.position.z - bot.lastGroundZ) > 0.35
      ) {
        const groundY = sampleGroundY(
          colliders,
          bot.position.x,
          bot.position.z,
          bot.position.y || 62,
        );
        bot.position.y = THREE.MathUtils.lerp(bot.position.y, groundY, 0.3);
        bot.lastGroundX = bot.position.x;
        bot.lastGroundZ = bot.position.z;
      }

      // Staggered TARGET DETECTION WHILE PATROLLING (~4 Hz per bot)
      if (enabled && bot.attackCooldown <= 0 && bot.scanTimer <= 0) {
        bot.scanTimer = 0.22 + Math.random() * 0.12;

        // A. Check Player Detection
        if (playerPos) {
          const playerDist = bot.position.distanceTo(playerPos);
          if (playerDist < 26) {
            _botEye.set(bot.position.x, bot.position.y + 1.35, bot.position.z);
            _targetChest.set(playerPos.x, playerPos.y + 1.2, playerPos.z);
            _losDir.subVectors(_targetChest, _botEye);
            const lDist = _losDir.length();
            _losDir.normalize();

            let clear = true;
            if (worldMeshes.length && lDist > 0.01) {
              _losRay.set(_botEye, _losDir);
              _losRay.far = lDist;
              const hits = _losRay.intersectObjects(worldMeshes, false);
              clear = hits.length === 0 || hits[0].distance >= lDist - 0.5;
            }

            if (clear) {
              bot.state = "combat";
              bot.targetType = "player";
              bot.targetId = null;
              bot.burstShotsTarget = Math.random() < 0.5 ? 1 : 2;
              bot.burstShotsFired = 0;
              bot.shotTimer = 0.25;
              hudNeedsUpdate = true;
            }
          }
        }

        // B. Check Other Bot Detection (Skirmish between bots!)
        if (bot.state === "patrol") {
          for (let j = 0; j < bots.length; j += 1) {
            const other = bots[j];
            if (other.id === bot.id || other.state === "knockedOut") continue;
            const bDist = bot.position.distanceTo(other.position);
            if (bDist < 22) {
              _botEye.set(bot.position.x, bot.position.y + 1.35, bot.position.z);
              _targetChest.set(
                other.position.x,
                other.position.y + 1.2,
                other.position.z,
              );
              _losDir.subVectors(_targetChest, _botEye);
              const lDist = _losDir.length();
              _losDir.normalize();

              let clear = true;
              if (worldMeshes.length && lDist > 0.01) {
                _losRay.set(_botEye, _losDir);
                _losRay.far = lDist;
                const hits = _losRay.intersectObjects(worldMeshes, false);
                clear = hits.length === 0 || hits[0].distance >= lDist - 0.5;
              }

              if (clear) {
                bot.state = "combat";
                bot.targetType = "bot";
                bot.targetId = other.id;
                bot.burstShotsTarget = Math.random() < 0.5 ? 1 : 2;
                bot.burstShotsFired = 0;
                bot.shotTimer = 0.3;
                hudNeedsUpdate = true;
                break;
              }
            }
          }
        }
      }

      botObj.position.copy(bot.position);
      botObj.rotation.y = bot.yaw;
    }

    if (hudNeedsUpdate) {
      setBotsHud(
        bots.map((b) => ({
          id: b.id,
          name: b.name,
          hp: b.hp,
          maxHp: b.maxHp,
          anim: b.anim,
          state: b.state,
        })),
      );
    }

    // Real-time Bot Positions for Minimap & Radar (throttled to ~100ms for smooth radar without 60fps React re-renders)
    const now = performance.now();
    if (onBotsPositionUpdate && bots.length && now - lastBotPosUpdateRef.current >= 100) {
      lastBotPosUpdateRef.current = now;
      const livingBots = bots
        .filter((b) => b.state !== "knockedOut")
        .map((b) => ({
          id: b.id,
          name: b.name,
          x: b.position.x,
          z: b.position.z,
          headingDeg: Math.round((-b.yaw * 180) / Math.PI) % 360,
          state: b.state,
        }));
      onBotsPositionUpdate(livingBots);
    }

    // -------------------------------------------------------------
    // Free Fire Default Aim Assist (Jelly Stickiness & Drag Headshot)
    // -------------------------------------------------------------
    let aimAssistLocked = false;
    let isHeadshotLocked = false;
    let bestAimBot = null;
    let bestAimAngle = 0.28; // ~16 deg target lock cone

    camera.getWorldPosition(_rayOrigin);
    camera.getWorldDirection(_rayDir);

    for (let i = 0; i < bots.length; i += 1) {
      const b = bots[i];
      if (b.state === "knockedOut") continue;

      _targetChest.set(b.position.x, b.position.y + 1.15, b.position.z);
      _tempToTarget.subVectors(_targetChest, _rayOrigin);
      const dist = _tempToTarget.length();
      if (dist > 65 || dist < 0.5) continue;
      _tempToTarget.divideScalar(dist);

      const dot = _rayDir.dot(_tempToTarget);
      const angle = Math.acos(THREE.MathUtils.clamp(dot, -1, 1));

      if (angle < bestAimAngle) {
        bestAimAngle = angle;
        bestAimBot = b;
      }
    }

    if (bestAimBot) {
      aimAssistLocked = true;
      const isUpwardDrag =
        Boolean(dragFireUp) ||
        Boolean(remoteInputRef?.current?.dragUp) ||
        (remoteInputRef?.current?.lookDeltaY && remoteInputRef.current.lookDeltaY < -0.005) ||
        dragUpRatio > 0.12;

      if (isUpwardDrag) {
        isHeadshotLocked = true;
      }
    }

    // Only notify when aim assist lock/headshot state actually changes
    const targetBotId = bestAimBot ? bestAimBot.id : null;
    const prevAssist = prevAimAssistRef.current;
    if (
      prevAssist.locked !== aimAssistLocked ||
      prevAssist.headshot !== isHeadshotLocked ||
      prevAssist.botId !== targetBotId
    ) {
      prevAimAssistRef.current = {
        locked: aimAssistLocked,
        headshot: isHeadshotLocked,
        botId: targetBotId,
      };
      onAimAssistChange?.({
        locked: aimAssistLocked,
        headshot: isHeadshotLocked,
        targetBot: bestAimBot,
      });
    }

    // -------------------------------------------------------------
    // Handle Player Active Weapon Firing & Hit Evaluation
    // -------------------------------------------------------------
    const weapon = WEAPONS[weaponId];
    const isFist = weaponId === "fist" || !weapon;
    const remoteFirePulsed = Boolean(remoteInputRef?.current?.firePulse);
    const activeFire = firing || (canFire && remoteFirePulsed);

    // MELEE PUNCH ATTACK (FIST)
    if (isFist) {
      if (!enabled || !activeFire || fireCooldownRef.current > 0) {
        if (remoteFirePulsed && remoteInputRef?.current) {
          remoteInputRef.current.firePulse = false;
        }
        return;
      }
      if (remoteFirePulsed && remoteInputRef?.current) {
        remoteInputRef.current.firePulse = false;
      }
      fireCooldownRef.current = 0.36; // Punch strike cooldown
      onPunch?.();

      const playerPos = characterRef.current?.position;
      if (playerPos) {
        camera.getWorldDirection(_rayDir);
        let closestBot = null;
        let closestDist = 2.6; // Melee forward reach

        for (let i = 0; i < bots.length; i += 1) {
          const b = bots[i];
          if (b.state === "knockedOut") continue;
          const d = Math.hypot(b.position.x - playerPos.x, b.position.z - playerPos.z);
          if (d < closestDist) {
            _tempToTarget.set(b.position.x - playerPos.x, 0, b.position.z - playerPos.z).normalize();
            _muzzleDir.set(_rayDir.x, 0, _rayDir.z).normalize();
            if (_tempToTarget.dot(_muzzleDir) > 0.32) {
              closestDist = d;
              closestBot = b;
            }
          }
        }

        if (closestBot) {
          const isHead = isHeadshotLocked || camera.position.y > closestBot.position.y + 1.5;
          const punchDmg = isHead ? 70 : 35;
          closestBot.hp = Math.max(0, closestBot.hp - punchDmg);
          const killed = closestBot.hp <= 0;

          const popupId = `${Date.now()}-${Math.random()}`;
          const popupPos = [closestBot.position.x, closestBot.position.y + 1.4, closestBot.position.z];
          setDamagePopups((prev) => [
            ...prev.slice(-6),
            {
              id: popupId,
              position: popupPos,
              damage: punchDmg,
              headshot: isHead,
            },
          ]);

          const timerId = window.setTimeout(() => {
            popupTimeoutsRef.current.delete(timerId);
            setDamagePopups((prev) => prev.filter((p) => p.id !== popupId));
          }, 650);
          popupTimeoutsRef.current.add(timerId);

          if (killed) {
            closestBot.state = "knockedOut";
            closestBot.anim = "knockedOut";
            onBotEliminated?.(closestBot, "YOU", isHead);

            let living = 0;
            for (let k = 0; k < bots.length; k += 1) {
              if (bots[k].state !== "knockedOut") living += 1;
            }
            onAliveCountChange?.(living + 1);

            if (living === 0) {
              onAllBotsEliminated?.();
            }
          } else {
            if (closestBot.state !== "combat" && closestBot.state !== "relocating") {
              closestBot.state = "combat";
              closestBot.targetType = "player";
              closestBot.targetId = null;
              closestBot.burstShotsTarget = 1;
              closestBot.burstShotsFired = 0;
              closestBot.shotTimer = 0.2;
            }
          }

          setBotsHud(
            bots.map((b) => ({
              id: b.id,
              name: b.name,
              hp: b.hp,
              maxHp: b.maxHp,
              anim: b.anim,
              state: b.state,
            })),
          );

          onShotEvaluated?.({
            hit: true,
            headshot: isHead,
            killed,
            damage: punchDmg,
            isPunch: true,
          });
        } else {
          onShotEvaluated?.({
            hit: false,
            headshot: false,
            killed: false,
            damage: 0,
            isPunch: true,
          });
        }
      }
      return;
    }

    if (!enabled || !activeFire || fireCooldownRef.current > 0) {
      if (remoteFirePulsed && remoteInputRef?.current) {
        remoteInputRef.current.firePulse = false;
      }
      return;
    }

    if (remoteFirePulsed && remoteInputRef?.current) {
      remoteInputRef.current.firePulse = false;
    }
    fireCooldownRef.current = weapon.fireRate;

    camera.getWorldPosition(_rayOrigin);
    camera.getWorldDirection(_rayDir);

    // If Free Fire Drag Headshot is locked, aim ray directly targets the head!
    if (isHeadshotLocked && bestAimBot) {
      _targetHead.set(bestAimBot.position.x, bestAimBot.position.y + 1.65, bestAimBot.position.z);
      _rayDir.subVectors(_targetHead, _rayOrigin).normalize();
    } else {
      _rayDir.x += (Math.random() - 0.5) * weapon.spread;
      _rayDir.y += (Math.random() - 0.5) * weapon.spread;
      _rayDir.z += (Math.random() - 0.5) * weapon.spread;
      _rayDir.normalize();
    }

    _shotRay.set(_rayOrigin, _rayDir);
    _shotRay.far = weapon.range;

    const activeHitboxes = Object.values(hitboxRefs.current).filter(Boolean);
    const botHits = activeHitboxes.length ? _shotRay.intersectObjects(activeHitboxes, false) : [];

    const worldHits = worldMeshes.length ? _shotRay.intersectObjects(worldMeshes, false) : [];
    const closestWorldDist = worldHits.length ? worldHits[0].distance : Infinity;

    _shotTarget
      .copy(_rayOrigin)
      .addScaledVector(_rayDir, Math.min(weapon.range, closestWorldDist));

    if (characterRef.current) {
      const p = characterRef.current.position;
      _muzzleOrigin.set(p.x, p.y + 1.35, p.z);
    } else {
      _muzzleOrigin.copy(_rayOrigin);
    }

    _muzzleDir.subVectors(_shotTarget, _muzzleOrigin);
    const muzzleDist = _muzzleDir.length();
    if (muzzleDist > 0.001) {
      _muzzleDir.divideScalar(muzzleDist);
    }

    _muzzleRay.set(_muzzleOrigin, _muzzleDir);
    _muzzleRay.far = muzzleDist;

    const muzzleObstacles = worldMeshes.length
      ? _muzzleRay.intersectObjects(worldMeshes, false)
      : [];
    const isShotBlockedByWall =
      muzzleObstacles.length > 0 &&
      muzzleObstacles[0].distance < muzzleDist - 0.3;

    if (isShotBlockedByWall) {
      _shotTarget.copy(muzzleObstacles[0].point);
    }

    let hitResult = { hit: false, headshot: false, killed: false, damage: 0 };

    if (
      !isShotBlockedByWall &&
      botHits.length &&
      botHits[0].distance <= closestWorldDist
    ) {
      const topHit = botHits[0];
      _shotTarget.copy(topHit.point);
      const { botId, isHead } = topHit.object.userData;
      const targetBot = bots.find((b) => b.id === botId);

      if (targetBot && targetBot.state !== "knockedOut") {
        const dmg = isHead ? weapon.headshotDamage : weapon.damage;
        targetBot.hp = Math.max(0, targetBot.hp - dmg);
        const killed = targetBot.hp <= 0;

        if (killed) {
          targetBot.state = "knockedOut";
          targetBot.anim = "knockedOut";
          onBotEliminated?.(targetBot, "YOU", Boolean(isHead));

          let living = 0;
          for (let k = 0; k < bots.length; k += 1) {
            if (bots[k].state !== "knockedOut") living += 1;
          }
          onAliveCountChange?.(living + 1);

          if (living === 0) {
            onAllBotsEliminated?.();
          }
        } else {
          if (targetBot.state !== "combat" && targetBot.state !== "relocating") {
            targetBot.state = "combat";
            targetBot.targetType = "player";
            targetBot.targetId = null;
            targetBot.burstShotsTarget = Math.random() < 0.5 ? 1 : 2;
            targetBot.burstShotsFired = 0;
            targetBot.shotTimer = 0.2;
          }
        }

        hitResult = {
          hit: true,
          headshot: Boolean(isHead),
          killed,
          damage: dmg,
        };

        const popupId = `${Date.now()}-${Math.random()}`;
        const popupPos = [_shotTarget.x, _shotTarget.y + 0.35, _shotTarget.z];
        setDamagePopups((prev) => [
          ...prev.slice(-6),
          {
            id: popupId,
            position: popupPos,
            damage: dmg,
            headshot: Boolean(isHead),
          },
        ]);

        const timerId = window.setTimeout(() => {
          popupTimeoutsRef.current.delete(timerId);
          setDamagePopups((prev) => prev.filter((p) => p.id !== popupId));
        }, 650);
        popupTimeoutsRef.current.add(timerId);

        setBotsHud(
          bots.map((b) => ({
            id: b.id,
            name: b.name,
            hp: b.hp,
            maxHp: b.maxHp,
            anim: b.anim,
            state: b.state,
          })),
        );
      }
    }

    spawnTracer(
      _muzzleOrigin,
      _shotTarget,
      hitResult.headshot ? "#ff2a5f" : "#ffdd57",
    );

    onShotEvaluated?.(hitResult);
  });

  return (
    <group>
      <group ref={tracersGroupRef} />

      {botsHud.map((botState) => (
        <group
          key={botState.id}
          ref={(el) => {
            if (el) botGroupRefs.current[botState.id] = el;
            else delete botGroupRefs.current[botState.id];
          }}
        >
          <CharacterModel
            animation={botState.anim}
            weaponId={botState.state === "knockedOut" ? "fist" : "mp40"}
            aiming={botState.state === "combat"}
            bodyColor="#ff3b5c"
          />

          {botState.state !== "knockedOut" && (
            <WorldHtml position={[0, 2.15, 0]} center distanceFactor={14}>
              <div className="ff-bot-nametag">
                <span className="ff-bot-name-label">{botState.name}</span>
                <div className="ff-bot-hp-track">
                  <div
                    className="ff-bot-hp-fill"
                    style={{
                      width: `${(botState.hp / botState.maxHp) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </WorldHtml>
          )}

          {botState.state !== "knockedOut" && (
            <>
              <mesh
                position={[0, 0.88, 0]}
                geometry={_bodyHitboxGeo}
                material={_hitboxMat}
                userData={{ botId: botState.id, isHead: false }}
                ref={(el) => {
                  if (el) hitboxRefs.current[`body-${botState.id}`] = el;
                  else delete hitboxRefs.current[`body-${botState.id}`];
                }}
              />
              <mesh
                position={[0, 1.68, 0]}
                geometry={_headHitboxGeo}
                material={_hitboxMat}
                userData={{ botId: botState.id, isHead: true }}
                ref={(el) => {
                  if (el) hitboxRefs.current[`head-${botState.id}`] = el;
                  else delete hitboxRefs.current[`head-${botState.id}`];
                }}
              />
            </>
          )}
        </group>
      ))}

      {damagePopups.map((popup) => (
        <WorldHtml key={popup.id} position={popup.position} center>
          <div
            className={
              popup.headshot ? "ff-dmg-popup ff-dmg-headshot" : "ff-dmg-popup"
            }
          >
            {popup.headshot ? `HEADSHOT ${popup.damage}` : popup.damage}
          </div>
        </WorldHtml>
      ))}
    </group>
  );
}
