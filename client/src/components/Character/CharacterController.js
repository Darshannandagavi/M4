import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Movement tuning                                                    */
/* ------------------------------------------------------------------ */

const WALK_SPEED = 3.2;
const RUN_SPEED = 5.4;
const SPRINT_SPEED = 7.8;
const CROUCH_SPEED = 1.85;

const GROUND_ACCEL = 42;
const GROUND_DECEL = 52;
const AIR_ACCEL = 14;
const TURN_RATE = 14;

const GRAVITY = 22;
const JUMP_FORCE = 8.4;

const COYOTE_TIME = 0.12;
const JUMP_BUFFER = 0.14;

const CHARACTER_RADIUS = 0.34;
const CHARACTER_HEIGHT = 1.8;

const STEP_HEIGHT = 0.55;
const MAX_GROUND_DROP = 15.0;

const DEFAULT_GROUND_Y = 0;

const COLLIDER_REFRESH_DISTANCE = 4;
const COLLIDER_SEARCH_RADIUS = 60;

const CAR_COLLISION_HALF_LEN = 1.72;
const CAR_COLLISION_HALF_WID = 0.78;

const CONTROL_KEYS = new Set([
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "space",
  "shift",
  "alt",
  "c",
  "control",
]);

/* ------------------------------------------------------------------ */
/* Shared Three.js objects                                            */
/* ------------------------------------------------------------------ */

const DOWN = new THREE.Vector3(0, -1, 0);

const _origin = new THREE.Vector3();
const _direction = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _movement = new THREE.Vector3();
const _remaining = new THREE.Vector3();
const _travel = new THREE.Vector3();
const _horizontalVelocity = new THREE.Vector3();

const _cameraForward = new THREE.Vector3();
const _cameraRight = new THREE.Vector3();
const _wishDirection = new THREE.Vector3();

const _groundRaycaster = new THREE.Raycaster();
const _wallRaycaster = new THREE.Raycaster();

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalizeKey(key) {
  if (key === " ") return "space";
  const normalized = key.toLowerCase();
  if (normalized === "controlleft" || normalized === "controlright") {
    return "control";
  }
  if (normalized === "shiftleft" || normalized === "shiftright") {
    return "shift";
  }
  if (normalized === "altleft" || normalized === "altright") {
    return "alt";
  }
  return normalized;
}

function isGroundFace(hit) {
  if (!hit.face) return false;
  _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
  return Math.abs(_normal.y) > 0.5;
}

function getNearbyMeshes(cache, colliderEntries, position) {
  if (!colliderEntries?.ready || !colliderEntries.length) {
    cache.meshes = [];
    return cache.meshes;
  }

  const moved = Math.hypot(
    position.x - cache.position.x,
    position.y - cache.position.y,
    position.z - cache.position.z,
  );

  const shouldRefresh =
    cache.source !== colliderEntries ||
    moved > COLLIDER_REFRESH_DISTANCE ||
    cache.meshes.length === 0;

  if (!shouldRefresh) {
    return cache.meshes;
  }

  cache.source = colliderEntries;
  cache.position.copy(position);

  cache.meshes = colliderEntries
    .filter(({ box }) => {
      return box && box.distanceToPoint(position) < COLLIDER_SEARCH_RADIUS;
    })
    .map(({ mesh }) => mesh)
    .filter(Boolean);

  return cache.meshes;
}

function findGround(character, meshes) {
  _origin.set(
    character.position.x,
    character.position.y + 3.0,
    character.position.z,
  );

  _groundRaycaster.set(_origin, DOWN);
  _groundRaycaster.near = 0;
  _groundRaycaster.far = 3.0 + MAX_GROUND_DROP;

  const hits = _groundRaycaster.intersectObjects(meshes, false);
  let bestGroundY = null;

  for (const hit of hits) {
    if (!isGroundFace(hit)) continue;
    const groundY = hit.point.y;

    if (groundY > character.position.y + STEP_HEIGHT) continue;

    if (bestGroundY === null || groundY > bestGroundY) {
      bestGroundY = groundY;
    }
  }

  // High-altitude recovery if character is in mid-air or dropping from terrain
  if (bestGroundY === null) {
    _origin.set(
      character.position.x,
      Math.max(character.position.y + 20, 200),
      character.position.z,
    );
    _groundRaycaster.set(_origin, DOWN);
    _groundRaycaster.far = 400;
    const recoveryHits = _groundRaycaster.intersectObjects(meshes, false);
    for (const hit of recoveryHits) {
      if (!isGroundFace(hit)) continue;
      if (bestGroundY === null || hit.point.y > bestGroundY) {
        bestGroundY = hit.point.y;
      }
    }
  }

  return bestGroundY;
}

function moveWithCollision(character, displacement, meshes) {
  _remaining.copy(displacement);
  if (_remaining.lengthSq() < 0.000001) return;

  const heights = [0.35, CHARACTER_HEIGHT * 0.5, CHARACTER_HEIGHT * 0.85];

  for (let pass = 0; pass < 2; pass += 1) {
    const distance = _remaining.length();
    if (distance < 0.0001) break;

    _direction.copy(_remaining).normalize();
    let closestHit = null;

    for (const height of heights) {
      _origin.copy(character.position).add(new THREE.Vector3(0, height, 0));

      _wallRaycaster.set(_origin, _direction);
      _wallRaycaster.near = 0;
      _wallRaycaster.far = distance + CHARACTER_RADIUS;

      const hits = _wallRaycaster.intersectObjects(meshes, false);

      for (const hit of hits) {
        if (!hit.face) continue;

        _normal
          .copy(hit.face.normal)
          .transformDirection(hit.object.matrixWorld);

        // Discard walkable slopes and floor geometry
        if (Math.abs(_normal.y) > 0.6) continue;

        if (!closestHit || hit.distance < closestHit.distance) {
          closestHit = hit;
        }
      }
    }

    if (!closestHit) {
      character.position.add(_remaining);
      _remaining.set(0, 0, 0);
      break;
    }

    _normal
      .copy(closestHit.face.normal)
      .transformDirection(closestHit.object.matrixWorld);

    _normal.y = 0;
    _normal.normalize();

    if (_normal.dot(_direction) > 0) {
      _normal.negate();
    }

    // Active push-out to prevent penetrating inside walls or corners
    if (closestHit.distance < CHARACTER_RADIUS) {
      const penetration = CHARACTER_RADIUS - closestHit.distance;
      character.position.addScaledVector(_normal, penetration + 0.015);
    }

    const allowedDistance = Math.max(0, closestHit.distance - CHARACTER_RADIUS);

    _travel
      .copy(_direction)
      .multiplyScalar(Math.min(distance, allowedDistance));

    character.position.add(_travel);
    _remaining.sub(_travel);

    const intoWall = _remaining.dot(_normal);
    if (intoWall < 0) {
      _remaining.addScaledVector(_normal, -intoWall);
    }
  }
}

function pushOutFromCar(character, car) {
  if (!car) return;
  const dx = character.position.x - car.position.x;
  const dz = character.position.z - car.position.z;
  const dy = Math.abs(character.position.y - car.position.y);
  if (dy > 2.2) return;

  const yaw = car.rotation.y;
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);

  const localX = dx * cosY - dz * sinY;
  const localZ = dx * sinY + dz * cosY;

  const halfL = CAR_COLLISION_HALF_LEN + CHARACTER_RADIUS;
  const halfW = CAR_COLLISION_HALF_WID + CHARACTER_RADIUS;

  if (Math.abs(localX) < halfL && Math.abs(localZ) < halfW) {
    const overlapX = halfL - Math.abs(localX);
    const overlapZ = halfW - Math.abs(localZ);

    let pushLocalX = 0;
    let pushLocalZ = 0;
    if (overlapX < overlapZ) {
      pushLocalX = localX >= 0 ? overlapX : -overlapX;
    } else {
      pushLocalZ = localZ >= 0 ? overlapZ : -overlapZ;
    }

    character.position.x += pushLocalX * cosY + pushLocalZ * sinY;
    character.position.z += -pushLocalX * sinY + pushLocalZ * cosY;
  }
}

function selectAnimation({
  airborne,
  hasInput,
  sprinting,
  running,
  crouching,
  speed,
  combatStanceActive = false,
  forwardInput = 0,
  strafeInput = 0,
}) {
  if (airborne) return "jump";

  if (crouching) {
    return speed > 0.2 ? "crouchWalk" : "crouchIdle";
  }

  if (!hasInput || speed < 0.2) {
    return "idle";
  }

  if (combatStanceActive) {
    if (forwardInput < -0.2) return "backward";
    if (Math.abs(strafeInput) > 0.4 && Math.abs(forwardInput) < 0.3) {
      return strafeInput > 0 ? "strafeRight" : "strafeLeft";
    }
  }

  if (sprinting) return "sprint";
  if (running) return "run";

  return "walk";
}

/* ------------------------------------------------------------------ */
/* Character controller                                               */
/* ------------------------------------------------------------------ */

export default function CharacterController({
  characterRef,
  carRef,
  collidersRef,
  enabled,
  emoteActive = false,
  combatStanceActive = false,
  cameraYawRef,
  remoteInputRef,
  onAnimationChange,
  onEmote,
  onPositionUpdate,
}) {
  const keys = useRef(Object.create(null));
  const velocity = useRef(new THREE.Vector3());

  const airborne = useRef(false);
  const grounded = useRef(false);

  const jumpWasDown = useRef(false);
  const jumpBufferTimer = useRef(0);
  const coyoteTimer = useRef(0);

  const enabledRef = useRef(enabled);
  const emoteRef = useRef(emoteActive);

  const nearbyCache = useRef({
    source: null,
    position: new THREE.Vector3(Infinity, Infinity, Infinity),
    meshes: [],
  });

  const lastAnimation = useRef("");

  enabledRef.current = enabled;
  emoteRef.current = emoteActive;

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = normalizeKey(event.key);
      if (!enabledRef.current) return;

      if (
        event.target?.tagName === "INPUT" ||
        event.target?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (/^[1-6]$/.test(key)) {
        event.preventDefault();
        if (!emoteRef.current) {
          onEmote?.(key);
        }
        return;
      }

      if (!CONTROL_KEYS.has(key)) return;
      event.preventDefault();

      if (key === "space" && !keys.current.space) {
        jumpBufferTimer.current = JUMP_BUFFER;
      }

      keys.current[key] = true;
    };

    const onKeyUp = (event) => {
      const key = normalizeKey(event.key);
      keys.current[key] = false;
    };

    const clearKeys = () => {
      keys.current = Object.create(null);
      jumpWasDown.current = false;
      jumpBufferTimer.current = 0;
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
    };
    
  }, [onEmote]);

  useEffect(() => {
    if (!enabled) {
      keys.current = Object.create(null);
      velocity.current.set(0, 0, 0);
      airborne.current = false;
      grounded.current = false;
      jumpWasDown.current = false;
      jumpBufferTimer.current = 0;
      coyoteTimer.current = 0;
      lastAnimation.current = "";
    }
  }, [enabled]);

  useFrame((_, rawDelta) => {
    const character = characterRef?.current;
    if (!enabled || !character) return;

    const dt = Math.min(rawDelta, 0.04);
    if (dt <= 0) return;

    const input = keys.current;
    const remote = remoteInputRef?.current;
    const v = velocity.current;

    const colliderEntries = collidersRef?.current;
    const meshes = getNearbyMeshes(
      nearbyCache.current,
      colliderEntries,
      character.position,
    );

    /* ---------------------------------------------------------- */
    /* Combine Keyboard + Joystick + Continuous Auto-Run Input    */
    /* ---------------------------------------------------------- */

    const kbForward =
      (input.w || input.arrowup ? 1 : 0) - (input.s || input.arrowdown ? 1 : 0);
    const kbStrafe =
      (input.d || input.arrowright ? 1 : 0) -
      (input.a || input.arrowleft ? 1 : 0);

    const joyMoveY =
      remote && Math.abs(remote.moveY || 0) > 0.04 ? remote.moveY : 0;
    const joyMoveX =
      remote && Math.abs(remote.moveX || 0) > 0.04 ? remote.moveX : 0;

    const autoRunActive = Boolean(remote?.autoRun);

    // If Auto-Run is active, move straight forward (+1) unless joystick Y overrides it
    const joyForward = joyMoveY !== 0 ? joyMoveY : autoRunActive ? 1 : 0;
    const joyStrafe = joyMoveX;

    const forwardInput = kbForward !== 0 ? kbForward : joyForward;
    const strafeInput = kbStrafe !== 0 ? kbStrafe : joyStrafe;

    const camYaw = cameraYawRef?.current ?? 0;

    _cameraForward.set(-Math.sin(camYaw), 0, -Math.cos(camYaw));
    _cameraRight.set(Math.cos(camYaw), 0, -Math.sin(camYaw));

    _wishDirection.set(0, 0, 0);
    _wishDirection.addScaledVector(_cameraForward, forwardInput);
    _wishDirection.addScaledVector(_cameraRight, strafeInput);

    const inputMagnitude = Math.min(1, _wishDirection.length());
    const hasInput = inputMagnitude > 0.04 && !emoteActive;

    if (hasInput) {
      _wishDirection.normalize();
    }

    /* ---------------------------------------------------------- */
    /* Movement modes                                             */
    /* ---------------------------------------------------------- */

    const crouching = Boolean(input.c || input.control || remote?.crouch);
    const sprinting = Boolean(input.shift || remote?.sprint) && !crouching;
    const running =
      (Boolean(input.alt) || autoRunActive || inputMagnitude > 0.72) &&
      !sprinting &&
      !crouching;

    let targetSpeed = WALK_SPEED;
    if (crouching) {
      targetSpeed = CROUCH_SPEED;
    } else if (sprinting) {
      targetSpeed = SPRINT_SPEED;
    } else if (running) {
      targetSpeed = RUN_SPEED;
    }

    // Joystick allows fine, slow in-place stepping when tilted slightly
    const effectiveSpeed =
      kbForward !== 0 || kbStrafe !== 0 || autoRunActive
        ? targetSpeed
        : targetSpeed * Math.max(0.28, inputMagnitude);

    /* ---------------------------------------------------------- */
    /* Horizontal acceleration                                    */
    /* ---------------------------------------------------------- */

    _horizontalVelocity.set(v.x, 0, v.z);

    if (hasInput) {
      const targetVelocity = _wishDirection
        .clone()
        .multiplyScalar(effectiveSpeed);
      const difference = targetVelocity.sub(_horizontalVelocity);
      const acceleration = airborne.current ? AIR_ACCEL : GROUND_ACCEL;
      const maxChange = acceleration * dt;

      if (difference.length() > maxChange) {
        difference.setLength(maxChange);
      }

      _horizontalVelocity.add(difference);
    } else {
      const currentSpeed = _horizontalVelocity.length();
      if (currentSpeed > 0) {
        const deceleration = airborne.current ? AIR_ACCEL : GROUND_DECEL;
        const drop = Math.min(currentSpeed, deceleration * dt);
        _horizontalVelocity.multiplyScalar(
          (currentSpeed - drop) / currentSpeed,
        );
      }
    }

    v.x = _horizontalVelocity.x;
    v.z = _horizontalVelocity.z;

    /* ---------------------------------------------------------- */
    /* Character facing                                           */
    /* ---------------------------------------------------------- */

    /* ---------------------------------------------------------- */
    /* Character facing                                           */
    /* ---------------------------------------------------------- */

    if (combatStanceActive) {
      // Face directly along the camera sightline during ADS or firing
      const targetYaw = camYaw + Math.PI;
      let angleDifference = targetYaw - character.rotation.y;
      angleDifference = Math.atan2(
        Math.sin(angleDifference),
        Math.cos(angleDifference),
      );
      const turnAlpha = 1 - Math.exp(-TURN_RATE * 1.8 * dt);
      character.rotation.y += angleDifference * turnAlpha;
    } else if (hasInput) {
      const targetYaw = Math.atan2(_wishDirection.x, _wishDirection.z);

      let angleDifference = targetYaw - character.rotation.y;
      angleDifference = Math.atan2(
        Math.sin(angleDifference),
        Math.cos(angleDifference),
      );

      const turnAlpha = 1 - Math.exp(-TURN_RATE * dt);
      character.rotation.y += angleDifference * turnAlpha;
    }

    /* ---------------------------------------------------------- */
    /* Horizontal movement and wall + car collision               */
    /* ---------------------------------------------------------- */

    _movement.set(v.x * dt, 0, v.z * dt);

    if (meshes.length) {
      moveWithCollision(character, _movement, meshes);
    } else {
      character.position.add(_movement);
    }

    if (carRef?.current) {
      pushOutFromCar(character, carRef.current);
    }

    /* ---------------------------------------------------------- */
    /* Ground detection                                           */
    /* ---------------------------------------------------------- */

    let groundY = DEFAULT_GROUND_Y;

    if (meshes.length) {
      const detectedGround = findGround(character, meshes);
      if (detectedGround !== null) {
        groundY = detectedGround;
      } else {
        groundY = carRef?.current ? carRef.current.position.y : null;
      }
    }

    const wasGrounded = grounded.current;

    const canStandOnGround =
      groundY !== null &&
      v.y <= 0 &&
      character.position.y <= groundY + STEP_HEIGHT;

    if (canStandOnGround) {
      character.position.y = groundY;
      v.y = 0;
      grounded.current = true;
      airborne.current = false;
      coyoteTimer.current = COYOTE_TIME;
    } else {
      grounded.current = false;
      airborne.current = true;
      coyoteTimer.current = Math.max(0, coyoteTimer.current - dt);
    }

    /* ---------------------------------------------------------- */
    /* Jump buffering and coyote time                             */
    /* ---------------------------------------------------------- */

    const remoteJumpTriggered = Boolean(remote?.jumpPulse);
    if (remote?.jumpPulse) {
      remote.jumpPulse = false;
    }
    const jumpDown = Boolean(input.space || remote?.jump || remoteJumpTriggered) && !emoteActive;

    if (jumpDown && !jumpWasDown.current) {
      jumpBufferTimer.current = JUMP_BUFFER;
    }

    jumpWasDown.current = jumpDown;
    jumpBufferTimer.current = Math.max(0, jumpBufferTimer.current - dt);

    const canJump = grounded.current || coyoteTimer.current > 0;

    if (jumpBufferTimer.current > 0 && canJump && !emoteActive) {
      v.y = JUMP_FORCE;
      grounded.current = false;
      airborne.current = true;
      jumpBufferTimer.current = 0;
      coyoteTimer.current = 0;
    }

    /* ---------------------------------------------------------- */
    /* Gravity and landing                                        */
    /* ---------------------------------------------------------- */

    if (airborne.current) {
      v.y -= GRAVITY * dt;
      character.position.y += v.y * dt;

      if (groundY !== null && v.y <= 0 && character.position.y <= groundY) {
        character.position.y = groundY;
        v.y = 0;
        airborne.current = false;
        grounded.current = true;
        coyoteTimer.current = COYOTE_TIME;
      }
    }

    if (wasGrounded && !grounded.current) {
      airborne.current = true;
    }

    // Safety check against falling below world bounds
    if (character.position.y < -30 && groundY !== null) {
      character.position.y = Math.max(groundY, 0);
      v.y = 0;
      airborne.current = false;
      grounded.current = true;
    }

    /* ---------------------------------------------------------- */
    /* Animation selection                                        */
    /* ---------------------------------------------------------- */

    const horizontalSpeed = Math.hypot(v.x, v.z);

    if (!emoteActive) {
      const nextAnimation = selectAnimation({
        airborne: airborne.current,
        hasInput,
        sprinting,
        running,
        crouching,
        speed: horizontalSpeed,
        combatStanceActive,
        forwardInput,
        strafeInput,
      });

      if (lastAnimation.current !== nextAnimation) {
        lastAnimation.current = nextAnimation;
        onAnimationChange?.(nextAnimation);
      }
    }

    onPositionUpdate?.(character.position);
  });

  return null;
}
