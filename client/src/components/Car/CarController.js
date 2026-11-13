import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BMW_M4_SCALE } from "./BMWM4";

/* ------------------------------------------------------------------ */
/*  Tuning                                                            */
/* ------------------------------------------------------------------ */

const MAX_FORWARD_SPEED = 31;
const MAX_REVERSE_SPEED = 9;
const ACCELERATION = 7.5;
const BRAKE_DECELERATION = 17;
const COAST_DECELERATION = 1.8;
const HANDBRAKE_DECELERATION = 5;
const BOOST_SPEED_MULT = 1.3;
const BOOST_ACCEL_MULT = 1.7;

const WHEELBASE = 2.85;
const WHEEL_RADIUS = 0.34;
const MAX_STEERING_ANGLE = 0.48;
const MAX_LATERAL_ACCEL = 17;
const HANDBRAKE_LATERAL_BOOST = 1.8;
const GRIP = 9;
const HANDBRAKE_GRIP = 0.9;

const GRAVITY = 24;
const SUBSTEP = 1 / 120;
const MAX_SUBSTEPS = 4;
const RAY_UP = 0.7;
const SUSPENSION_TRAVEL = 0.4;
const MIN_CONTACTS = 2;
const HEAVE_STIFFNESS = 170;
const HEAVE_DAMPING = 15;

const SPAWN = { x: 0, z: 0, yaw: 0 };
const SPAWN_RAY_HEIGHT = 1000;
const KILL_DEPTH = 250;

const CAR_HALF_LENGTH = 2.3 * BMW_M4_SCALE;
const CAR_HALF_WIDTH = 0.95 * BMW_M4_SCALE;
const WALL_RAY_HEIGHT = 0.55;
const WALL_RAY_COUNT = 16;
const MAX_PUSH = 0.9;
const WALL_RESTITUTION = 0.1;
const WALL_SCRAPE = 0.04;
const NEARBY_RADIUS = 30;
const NEARBY_REFRESH = 10;

const GEAR_TOP_SPEEDS = [7, 13, 19, 25, MAX_FORWARD_SPEED];
const EMPTY = [];
const CONTROL_KEYS = ["w", "a", "s", "d", "space", "shift", "j"];

/* ------------------------------------------------------------------ */
/*  Scratch objects                                                   */
/* ------------------------------------------------------------------ */

const UP = new THREE.Vector3(0, 1, 0);
const _v = new THREE.Vector3();
const _before = new THREE.Vector3();
const _origin = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _down = new THREE.Vector3(0, -1, 0);
const raycaster = new THREE.Raycaster();
raycaster.firstHitOnly = true;

const WALL_PROBES = Array.from({ length: WALL_RAY_COUNT }, (_, i) => {
  const angle = (i / WALL_RAY_COUNT) * Math.PI * 2;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const radius =
    (CAR_HALF_LENGTH * CAR_HALF_WIDTH) /
    Math.hypot(CAR_HALF_WIDTH * c, CAR_HALF_LENGTH * s);
  return { dir: new THREE.Vector3(c, 0, s), radius };
});

function createState() {
  return {
    lon: 0,
    lat: 0,
    y: 0,
    vy: 0,
    vyGround: 0,
    airborne: false,
    yawRate: 0,
    steering: 0,
    grip: GRIP,
    groundPitch: 0,
    groundRoll: 0,
    bodyPitch: 0,
    bodyRoll: 0,
    heave: 0,
    heaveVel: 0,
    prevLon: 0,
    aLon: 0,
    ground: { contacts: 0, targetY: 0, pitch: 0, roll: 0 },
    spawned: false,
    resetRequested: false,
    killY: -Infinity,
    safe: null,
    safeTimer: 0,
    jumpWasDown: false,
    collisionCooldown: 0,
  };
}

function getNearbyMeshes(cache, colliders, position) {
  const moved = Math.hypot(
    position.x - cache.x,
    position.y - cache.y,
    position.z - cache.z,
  );

  if (
    cache.source !== colliders ||
    cache.count !== colliders.length ||
    moved > NEARBY_REFRESH
  ) {
    cache.source = colliders;
    cache.count = colliders.length;
    cache.x = position.x;
    cache.y = position.y;
    cache.z = position.z;
    cache.meshes = colliders
      .filter(({ box }) => box.distanceToPoint(position) < NEARBY_RADIUS)
      .map(({ mesh }) => mesh);
  }

  return cache.meshes;
}

function meshesAtXZ(colliders, x, z) {
  const out = [];
  for (const { box, mesh } of colliders) {
    if (x >= box.min.x && x <= box.max.x && z >= box.min.z && z <= box.max.z) {
      out.push(mesh);
    }
  }
  return out;
}

function findGroundHeight(meshes, x, z, refY) {
  _origin.set(x, SPAWN_RAY_HEIGHT, z);
  raycaster.set(_origin, _down);
  raycaster.far = SPAWN_RAY_HEIGHT * 2.5;
  raycaster.firstHitOnly = false;

  let best = null;
  try {
    for (const hit of raycaster.intersectObjects(meshes, false)) {
      if (!hit.face) continue;
      _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
      if (Math.abs(_normal.y) < 0.5) continue;
      if (
        best === null ||
        Math.abs(hit.point.y - refY) < Math.abs(best - refY)
      ) {
        best = hit.point.y;
      }
    }
  } finally {
    raycaster.firstHitOnly = true;
  }
  return best;
}

function collideWithWalls(car, meshes) {
  for (const probe of WALL_PROBES) {
    _dir.copy(probe.dir).applyAxisAngle(UP, car.rotation.y);
    _origin.set(
      car.position.x,
      car.position.y + WALL_RAY_HEIGHT,
      car.position.z,
    );

    raycaster.set(_origin, _dir);
    raycaster.far = probe.radius;

    const hit = raycaster.intersectObjects(meshes, false)[0];
    if (!hit || !hit.face) continue;

    _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
    if (Math.abs(_normal.y) > 0.7) continue;

    _normal.y = 0;
    _normal.normalize();
    if (_normal.dot(_dir) > 0) _normal.negate();

    const depth = (probe.radius - hit.distance) * Math.abs(_normal.dot(_dir));
    car.position.addScaledVector(_normal, Math.min(depth, MAX_PUSH));
  }
}

function buildRig(car, assemblies) {
  const scale = car.scale.x;
  const wheels = [];

  assemblies.forEach((wheel) => {
    const pivot = wheel.steeringPivot;
    const model = pivot && pivot.parent;
    if (!model) return;

    model.updateMatrix();
    _v.copy(pivot.position).applyMatrix4(model.matrix).multiplyScalar(scale);
    const radius = wheel.radius || WHEEL_RADIUS * scale;

    wheels.push({
      x: _v.x,
      z: _v.z,
      bottom: _v.y - radius,
      front: Boolean(wheel.isFront),
      left: _v.z < 0,
    });
  });

  if (wheels.length < 4) {
    wheels.length = 0;
    const hx = (WHEELBASE / 2) * scale;
    const hz = 0.82 * scale;
    [
      [hx, -hz, true, true],
      [hx, hz, true, false],
      [-hx, -hz, false, true],
      [-hx, hz, false, false],
    ].forEach(([x, z, front, left]) =>
      wheels.push({ x, z, bottom: 0, front, left }),
    );
  }

  const mean = (list, key) =>
    list.reduce((sum, w) => sum + w[key], 0) / Math.max(1, list.length);
  const front = wheels.filter((w) => w.front);
  const rear = wheels.filter((w) => !w.front);
  const left = wheels.filter((w) => w.left);
  const right = wheels.filter((w) => !w.left);

  return {
    source: assemblies,
    wheels,
    bottom: mean(wheels, "bottom"),
    length: Math.max(0.5, mean(front, "x") - mean(rear, "x")),
    width: Math.max(0.5, mean(right, "z") - mean(left, "z")),
  };
}

function castGround(meshes, x, y, z, length) {
  _origin.set(x, y, z);
  raycaster.set(_origin, _down);
  raycaster.far = length;

  for (const hit of raycaster.intersectObjects(meshes, false)) {
    if (!hit.face) continue;
    _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
    if (Math.abs(_normal.y) > 0.5) return hit.point.y;
  }
  return null;
}

function sampleGround(car, meshes, rig, y, vy, h, out) {
  const cosY = Math.cos(car.rotation.y);
  const sinY = Math.sin(car.rotation.y);
  const fall = Math.max(0, -vy) * h * 2;

  let fSum = 0,
    fN = 0,
    rSum = 0,
    rN = 0;
  let lSum = 0,
    lN = 0,
    rtSum = 0,
    rtN = 0;
  let targetSum = 0;
  let contacts = 0;

  for (const w of rig.wheels) {
    const wx = car.position.x + w.x * cosY + w.z * sinY;
    const wz = car.position.z - w.x * sinY + w.z * cosY;
    const gy = castGround(
      meshes,
      wx,
      y + w.bottom + RAY_UP,
      wz,
      RAY_UP + SUSPENSION_TRAVEL + fall,
    );
    if (gy === null) continue;

    contacts += 1;
    targetSum += gy - w.bottom;
    if (w.front) {
      fSum += gy;
      fN += 1;
    } else {
      rSum += gy;
      rN += 1;
    }
    if (w.left) {
      lSum += gy;
      lN += 1;
    } else {
      rtSum += gy;
      rtN += 1;
    }
  }

  out.contacts = contacts;
  if (contacts > 0) {
    out.targetY = targetSum / contacts;
    out.pitch = fN && rN ? Math.atan2(fSum / fN - rSum / rN, rig.length) : 0;
    out.roll = lN && rtN ? Math.atan2(lSum / lN - rtSum / rtN, rig.width) : 0;
  }
  return out;
}

function placeCar(car, s, colliders, rig, x, z, yaw, knownGroundY) {
  let groundY =
    knownGroundY !== undefined
      ? knownGroundY
      : findGroundHeight(meshesAtXZ(colliders, x, z), x, z, car.position.y);
  if (groundY === null) groundY = car.position.y;

  s.y = groundY - rig.bottom + 0.02;
  car.rotation.set(0, yaw, 0);
  car.position.set(x, s.y, z);

  s.lon = 0;
  s.lat = 0;
  s.vy = 0;
  s.vyGround = 0;
  s.yawRate = 0;
  s.steering = 0;
  s.grip = GRIP;
  s.groundPitch = 0;
  s.groundRoll = 0;
  s.bodyPitch = 0;
  s.bodyRoll = 0;
  s.heave = 0;
  s.heaveVel = 0;
  s.prevLon = 0;
  s.aLon = 0;
  s.airborne = true;
  s.killY = groundY - KILL_DEPTH;
  s.spawned = true;
  s.resetRequested = false;
}

function getGearAndRpm(speed) {
  const abs = Math.abs(speed);
  if (abs < 0.3) return { gear: "N", rpm: 850 };
  if (speed < 0) {
    return {
      gear: "R",
      rpm: Math.round(850 + (abs / MAX_REVERSE_SPEED) * 3200),
    };
  }

  const found = GEAR_TOP_SPEEDS.findIndex((top) => abs <= top);
  const index = found === -1 ? GEAR_TOP_SPEEDS.length - 1 : found;
  const low = index === 0 ? 0 : GEAR_TOP_SPEEDS[index - 1];
  const ratio = (abs - low) / (GEAR_TOP_SPEEDS[index] - low);

  return { gear: String(index + 1), rpm: Math.round(2200 + ratio * 4800) };
}

export default function CarController({
  carRef,
  wheelAssembliesRef,
  collidersRef,
  enabled,
  onTelemetryChange,
  physicsStateRef,
  remoteInputRef,
  onCollision,
}) {
  const keys = useRef({});
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const state = useRef(createState());
  const rig = useRef(null);
  const uiTimer = useRef(0);
  const nearby = useRef({
    source: null,
    count: -1,
    x: 0,
    y: 0,
    z: 0,
    meshes: [],
  });

  useEffect(() => {
    const normalizeKey = (key) => (key === " " ? "space" : key.toLowerCase());

    const onKeyDown = (event) => {
      if (!enabledRef.current) return;
      const key = normalizeKey(event.key);
      if (CONTROL_KEYS.includes(key)) {
        event.preventDefault();
        keys.current[key] = true;
      }
      if (key === "r") state.current.resetRequested = true;
    };

    const onKeyUp = (event) => {
      keys.current[normalizeKey(event.key)] = false;
    };

    const clearKeys = () => {
      keys.current = {};
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
    };
  }, []);

  useEffect(() => {
    // A mode switch pauses the vehicle controller; it must not recreate the
    // physics state or move the car back to its spawn point. The player can
    // only enter/exit while nearly stationary, so the current state is safe
    // to preserve and resume when driving is enabled again.
    keys.current = {};
  }, [enabled]);

  useFrame((_, rawDelta) => {
    const car = carRef.current;
    if (!car) return;

    const colliders = collidersRef?.current;
    if (!colliders || !colliders.ready) return;

    const s = state.current;
    const remote = remoteInputRef?.current;

    if (remote?.reset) {
      s.resetRequested = true;
      remote.reset = false;
    }

    if (car.rotation.order !== "YXZ") car.rotation.order = "YXZ";

    const assemblies = wheelAssembliesRef.current || EMPTY;
    if (!rig.current || rig.current.source !== assemblies) {
      rig.current = buildRig(car, assemblies);
    }
    const rigData = rig.current;

    if (!s.spawned || s.resetRequested || s.spawnedColliders !== colliders) {
      s.spawnedColliders = colliders;
      placeCar(car, s, colliders, rigData, SPAWN.x, SPAWN.z, SPAWN.yaw);
    }

    if (!enabled) return;

    const frameDelta = Math.min(rawDelta, 0.05);
    if (frameDelta <= 0) return;

    const input = keys.current;
    s.collisionCooldown = Math.max(0, s.collisionCooldown - frameDelta);

    const remoteJumpTriggered = Boolean(remote?.jumpPulse);
    if (remote?.jumpPulse) {
      remote.jumpPulse = false;
    }
    const jumpDown = Boolean(input.j || remote?.jump || remoteJumpTriggered);
    if (jumpDown && !s.jumpWasDown && !s.airborne) {
      s.airborne = true;
      s.vy = 9.5;
      s.vyGround = 0;
    }
    s.jumpWasDown = jumpDown;

    const meshes = getNearbyMeshes(nearby.current, colliders, car.position);

    // Combine Laptop Keyboard + Phone Remote Controller
    const forwardActive = input.w || remote?.accelerate;
    const brakeActive = input.s || remote?.brake;
    const throttle = (forwardActive ? 1 : 0) - (brakeActive ? 1 : 0);

    // Positive steering = left (+1 = full left, -1 = full right)
    const kbSteer = (input.a ? 1 : 0) - (input.d ? 1 : 0);
    const phoneSteer = remote ? remote.steer : 0;
    const steerInput =
      kbSteer !== 0 ? kbSteer : THREE.MathUtils.clamp(phoneSteer, -1, 1);

    const handbrake = Boolean(input.space || remote?.handbrake);
    const boostKey = Boolean(input.shift || remote?.boost);

    const steps = Math.min(MAX_SUBSTEPS, Math.ceil(frameDelta / SUBSTEP));
    const h = frameDelta / steps;
    let yaw = car.rotation.y;
    let boosting = false;

    /* ---------------- physics sub-steps ---------------- */
    for (let i = 0; i < steps; i++) {
      const grounded = !s.airborne;
      const speedAbs = Math.abs(s.lon);
      boosting = false;

      if (grounded) {
        boosting = boostKey && throttle > 0 && s.lon > -0.5;
        const vMax = MAX_FORWARD_SPEED * (boosting ? BOOST_SPEED_MULT : 1);
        let accel = 0;

        if (throttle > 0) {
          if (s.lon < -0.5) {
            accel = BRAKE_DECELERATION;
          } else {
            const ratio = THREE.MathUtils.clamp(s.lon / vMax, 0, 1);
            accel =
              ACCELERATION *
              (boosting ? BOOST_ACCEL_MULT : 1) *
              Math.max(0.12, 1 - ratio * ratio);
          }
        } else if (throttle < 0) {
          if (s.lon > 0.5) {
            accel = -BRAKE_DECELERATION;
          } else {
            const ratio = THREE.MathUtils.clamp(
              -s.lon / MAX_REVERSE_SPEED,
              0,
              1,
            );
            accel = -ACCELERATION * Math.max(0.12, 1 - ratio * ratio);
          }
        } else {
          s.lon = THREE.MathUtils.damp(s.lon, 0, COAST_DECELERATION, h);
        }

        s.lon += accel * h;

        if (handbrake) {
          const d = HANDBRAKE_DECELERATION * h;
          s.lon = Math.abs(s.lon) <= d ? 0 : s.lon - Math.sign(s.lon) * d;
        }

        if (speedAbs > 1 || throttle !== 0) {
          s.lon -= GRAVITY * Math.sin(s.groundPitch) * h;
        }

        if (s.lon > vMax) s.lon = THREE.MathUtils.damp(s.lon, vMax, 2.5, h);
        s.lon = Math.max(s.lon, -MAX_REVERSE_SPEED);
      }

      const aMax =
        MAX_LATERAL_ACCEL * (handbrake ? HANDBRAKE_LATERAL_BOOST : 1);
      const steerLimit = Math.min(
        MAX_STEERING_ANGLE,
        Math.atan((aMax * WHEELBASE) / Math.max(speedAbs * speedAbs, 1)),
      );
      s.steering = THREE.MathUtils.damp(
        s.steering,
        steerInput * steerLimit,
        9,
        h,
      );

      if (grounded) {
        const target = (s.lon / WHEELBASE) * Math.tan(s.steering);
        s.yawRate = THREE.MathUtils.damp(s.yawRate, target, 12, h);
      } else {
        s.yawRate = THREE.MathUtils.damp(s.yawRate, 0, 0.6, h);
      }

      const dYaw = s.yawRate * h;
      yaw += dYaw;
      const cosD = Math.cos(dYaw);
      const sinD = Math.sin(dYaw);
      const lon = s.lon * cosD - s.lat * sinD;
      const lat = s.lon * sinD + s.lat * cosD;
      s.lon = lon;
      s.lat = lat;

      if (grounded) {
        const saturated = Math.abs(steerInput) > 0.85 && speedAbs > 20;
        const gripTarget = handbrake
          ? HANDBRAKE_GRIP
          : saturated
            ? GRIP * 0.7
            : GRIP;
        s.grip = THREE.MathUtils.damp(
          s.grip,
          gripTarget,
          handbrake ? 14 : 3,
          h,
        );
        s.lat *= Math.exp(-s.grip * h);
      }

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      car.position.x += (s.lon * cosY + s.lat * sinY) * h;
      car.position.z += (-s.lon * sinY + s.lat * cosY) * h;
      car.rotation.y = yaw;

      const g = sampleGround(car, meshes, rigData, s.y, s.vy, h, s.ground);
      const hasGround = g.contacts >= MIN_CONTACTS;

      if (!s.airborne) {
        if (hasGround) {
          const est = (g.targetY - s.y) / h;
          s.vyGround = THREE.MathUtils.damp(s.vyGround, est, 25, h);
          s.vy = s.vyGround;
          s.y = g.targetY;
        } else {
          s.airborne = true;
          s.vy = THREE.MathUtils.clamp(s.vyGround, -25, 25);
        }
      }

      if (s.airborne) {
        s.vy -= GRAVITY * h;
        s.y += s.vy * h;

        if (hasGround && s.y <= g.targetY) {
          const impact = Math.max(0, -s.vy);
          s.y = g.targetY;
          s.vy = 0;
          s.vyGround = 0;
          s.airborne = false;

          if (impact > 1.5) {
            s.heaveVel -= Math.min(impact, 14) * 0.4;
            s.lon *= 1 - Math.min(0.12, impact * 0.008);
          }
        }
      }
    }

    /* ---------------- wall collision ---------------- */
    car.position.y = s.y;
    _before.copy(car.position);
    collideWithWalls(car, meshes);

    const pushX = car.position.x - _before.x;
    const pushZ = car.position.z - _before.z;
    const pushLen = Math.hypot(pushX, pushZ);
    let collisionImpactSpeed = 0;

    if (pushLen > 1e-4) {
      const nx = pushX / pushLen;
      const nz = pushZ / pushLen;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const nForward = nx * cosY - nz * sinY;
      const nRight = nx * sinY + nz * cosY;
      const vn = s.lon * nForward + s.lat * nRight;

      if (vn < 0) {
        collisionImpactSpeed = Math.max(collisionImpactSpeed, Math.abs(vn));
        const j = -(1 + WALL_RESTITUTION) * vn;
        s.lon += j * nForward;
        s.lat += j * nRight;
      }
      const scrape = 1 - WALL_SCRAPE * Math.min(1, pushLen / MAX_PUSH);
      s.lon *= scrape;
      s.lat *= scrape;
    }

    if (collisionImpactSpeed > 2.2 && s.collisionCooldown <= 0) {
      onCollision?.(collisionImpactSpeed);
      s.collisionCooldown = 0.42;
    }

    /* ---------------- body attitude (visual) ---------------- */
    const dt = frameDelta;

    const aLonNow = (s.lon - s.prevLon) / dt;
    s.prevLon = s.lon;
    s.aLon = THREE.MathUtils.damp(s.aLon, aLonNow, 10, dt);
    const aLat = s.yawRate * s.lon;
    s.bodyPitch = THREE.MathUtils.damp(
      s.bodyPitch,
      THREE.MathUtils.clamp(s.aLon * 0.0035, -0.07, 0.05),
      7,
      dt,
    );
    s.bodyRoll = THREE.MathUtils.damp(
      s.bodyRoll,
      THREE.MathUtils.clamp(aLat * 0.0022, -0.07, 0.07),
      7,
      dt,
    );

    if (!s.airborne && s.ground.contacts >= MIN_CONTACTS) {
      s.groundPitch = THREE.MathUtils.damp(
        s.groundPitch,
        s.ground.pitch,
        14,
        dt,
      );
      s.groundRoll = THREE.MathUtils.damp(s.groundRoll, s.ground.roll, 14, dt);
    } else {
      const airPitch = THREE.MathUtils.clamp(
        Math.atan2(s.vy, Math.max(Math.abs(s.lon), 4)) * 0.6,
        -0.45,
        0.45,
      );
      s.groundPitch = THREE.MathUtils.damp(s.groundPitch, airPitch, 2, dt);
      s.groundRoll = THREE.MathUtils.damp(s.groundRoll, 0, 1.5, dt);
    }

    s.heaveVel +=
      (-HEAVE_STIFFNESS * s.heave - HEAVE_DAMPING * s.heaveVel) * dt;
    s.heave = THREE.MathUtils.clamp(s.heave + s.heaveVel * dt, -0.2, 0.06);

    car.rotation.set(
      s.groundRoll + s.bodyRoll,
      yaw,
      s.groundPitch + s.bodyPitch,
    );
    car.position.y = s.y + s.heave;

    /* ---------------- safety net ---------------- */
    if (!s.airborne) {
      s.safeTimer += dt;
      if (s.safeTimer > 0.5) {
        s.safeTimer = 0;
        s.safe = {
          x: car.position.x,
          z: car.position.z,
          yaw,
          groundY: s.y + rigData.bottom,
        };
      }
    }
    if (s.y < s.killY) {
      const p = s.safe || { ...SPAWN, groundY: undefined };
      placeCar(car, s, colliders, rigData, p.x, p.z, p.yaw, p.groundY);
    }

    /* ---------------- wheels ---------------- */
    (wheelAssembliesRef.current || EMPTY).forEach((wheel) => {
      if (!wheel.steeringPivot || !wheel.rollingPivot) return;

      wheel.steeringPivot.rotation.y = wheel.isFront ? s.steering : 0;

      if (handbrake && !wheel.isFront) return;
      wheel.rollingPivot.rotation.x +=
        (s.lon * dt) / (wheel.radius || WHEEL_RADIUS);
    });

    /* ---------------- shared state for FollowCamera + HUD ---------------- */
    const slip = Math.atan2(Math.abs(s.lat), Math.max(Math.abs(s.lon), 0.1));
    const planarSpeed = Math.hypot(s.lon, s.lat);
    const drifting = !s.airborne && planarSpeed > 6 && slip > 0.14;

    const phys = physicsStateRef?.current;
    if (phys) {
      phys.vx = s.lon;
      phys.vy = s.lat;
      phys.steering = s.steering;
      phys.isDrifting = drifting;
      phys.boost = boosting;
    }

    uiTimer.current += dt;
    if (uiTimer.current >= 0.05) {
      uiTimer.current = 0;
      const { gear, rpm } = getGearAndRpm(s.lon);
      onTelemetryChange?.({
        speed: Math.round(planarSpeed * 3.6),
        rpm,
        gear,
        drifting,
        driftAngle: drifting ? Math.round((slip * 180) / Math.PI) : 0,
        boost: boosting,
        steerInput,
      });
    }
  });

  return null;
}
