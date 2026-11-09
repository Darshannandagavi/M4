# Project Context

You are helping with an existing software project.

## Instructions

1. First understand the project architecture before answering.
2. Do not modify unrelated files.
3. Reuse the existing project structure and coding style.
4. Make only the minimum required changes.
5. Mention every file that needs to be modified.
6. If additional files are required, ask only for those files.

---

## Project Structure

```text
├── App.css
├── App.js
├── App.jsx
├── App.test.js
├── components
│   ├── Car
│   │   ├── BMWM4.js
│   │   └── CarController.js
│   ├── Character
│   │   ├── CharacterController.js
│   │   └── CharacterModel.jsx
│   ├── Controller
│   │   └── PhoneControllerApp.jsx
│   ├── Game
│   │   └── LaptopGameApp.jsx
│   ├── UI
│   │   ├── GameModals.jsx
│   │   ├── HoldButton.jsx
│   │   ├── Icons.jsx
│   │   ├── SportSpeedometer.jsx
│   │   └── SteeringWheelGraphic.jsx
│   └── World
│       ├── DrivingWorld.jsx
│       ├── FollowCamera.jsx
│       └── OpenWorldMap.js
├── config
│   └── gameConstants.js
├── index.css
├── index.js
├── main.jsx
├── reportWebVitals.js
├── setupTests.js
└── utils
    └── network.js
```

===============================================================================
FILE: App.css
===============================================================================

```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

===============================================================================
FILE: App.js
===============================================================================

```js
export { default } from "./App.jsx";
```

===============================================================================
FILE: App.jsx
===============================================================================

```jsx
import React, { useMemo } from "react";
import PhoneControllerApp from "./components/Controller/PhoneControllerApp";
import LaptopGameApp from "./components/Game/LaptopGameApp";
import "./index.css";

export default function App() {
  const isPhoneController = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("controller") === "1") return true;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  return isPhoneController ? <PhoneControllerApp /> : <LaptopGameApp />;
}
```

===============================================================================
FILE: App.test.js
===============================================================================

```js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

===============================================================================
FILE: components/Car/BMWM4.js
===============================================================================

```js
import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import modelUrl from "../../assets/models/2021_bmw_m4_competition.glb";

export const BMW_M4_SCALE = 0.73;

const CAR_ENV_INTENSITY = 1.2;
const MODEL_YAW = Math.PI / 2;
const PRE_POSED_STEER = -0.34906585;

const WHEEL_DEFINITIONS = [
  {
    id: "front-right",
    front: true,
    tyreNames: ["tire06", "tire07"],
    rimName: "Rim",
    discName: "brake disc",
    caliperName: "Brake",
  },
  {
    id: "front-left",
    front: true,
    tyreNames: ["tire012", "tire013"],
    rimName: "Rim002",
    discName: "brake disc002",
    caliperName: "Brake002",
  },
  {
    id: "rear-right",
    front: false,
    tyreNames: ["tire008", "tire009"],
    rimName: "Rim001",
    discName: "brake disc001",
    caliperName: "Brake001",
  },
  {
    id: "rear-left",
    front: false,
    tyreNames: ["tire010", "tire011"],
    rimName: "Rim003",
    discName: "brake disc003",
    caliperName: "Brake003",
  },
];

const DOOR_NAME_REGEX =
  /door.*(l|left|fl|front_l|driver)|^(door_l|door_lf|lf_door|driver_door)/i;
const GLASS_NAME_REGEX = /glass|window|windshield|windscreen|win_/i;

function getNode(root, name) {
  const loadedName = THREE.PropertyBinding.sanitizeNodeName(name);
  let object = root.getObjectByName(loadedName) || root.getObjectByName(name);

  if (!object) {
    root.traverse((child) => {
      if (!object && child.userData?.name === name) object = child;
    });
  }

  if (!object) console.warn(`[BMW M4] GLB node missing: ${name}`);
  return object || null;
}

function buildWheelAssemblies(model) {
  model.updateWorldMatrix(true, true);

  const assemblies = [];

  for (const definition of WHEEL_DEFINITIONS) {
    const tyres = definition.tyreNames
      .map((name) => getNode(model, name))
      .filter(Boolean);
    const rim = getNode(model, definition.rimName);
    const disc = getNode(model, definition.discName);
    const caliper = getNode(model, definition.caliperName);

    if (!tyres.length || !rim) {
      console.warn(`[BMW M4] Incomplete wheel assembly: ${definition.id}`);
      continue;
    }

    const rollingParts = [...tyres, rim];
    if (disc) rollingParts.push(disc);

    const box = new THREE.Box3();
    [...tyres, rim].forEach((part) => box.expandByObject(part));
    const centerLocal = model.worldToLocal(box.getCenter(new THREE.Vector3()));
    const radius = (box.max.y - box.min.y) / 2;

    const steeringPivot = new THREE.Group();
    steeringPivot.name = `GAME_STEER_${definition.id}`;
    steeringPivot.position.copy(centerLocal);
    model.add(steeringPivot);

    const rollingPivot = new THREE.Group();
    rollingPivot.name = `GAME_ROLL_${definition.id}`;
    steeringPivot.add(rollingPivot);

    steeringPivot.rotation.y = definition.front ? PRE_POSED_STEER : 0;
    steeringPivot.updateMatrixWorld(true);

    rollingParts.forEach((part) => rollingPivot.attach(part));
    if (caliper) steeringPivot.attach(caliper);

    steeringPivot.rotation.y = 0;
    steeringPivot.updateMatrixWorld(true);

    assemblies.push({
      id: definition.id,
      isFront: definition.front,
      steeringPivot,
      rollingPivot,
      radius: radius > 0.05 && radius < 1.5 ? radius : undefined,
    });
  }

  return assemblies;
}

function buildDriverDoorRig(model) {
  model.updateWorldMatrix(true, true);
  const doorParts = [];

  model.traverse((child) => {
    if (!child.isMesh) return;
    const combinedName = `${child.name} ${child.parent?.name || ""}`;
    if (DOOR_NAME_REGEX.test(combinedName)) {
      doorParts.push(child);
    }
  });

  if (!doorParts.length) return null;

  const box = new THREE.Box3();
  doorParts.forEach((part) => box.expandByObject(part));

  // Hinge at front-outer edge of the left door
  const hingeWorld = new THREE.Vector3(
    box.max.x,
    (box.min.y + box.max.y) * 0.5,
    box.max.z,
  );
  const hingeLocal = model.worldToLocal(hingeWorld);

  const doorPivot = new THREE.Group();
  doorPivot.name = "GAME_DRIVER_DOOR_PIVOT";
  doorPivot.position.copy(hingeLocal);
  model.add(doorPivot);
  doorPivot.updateMatrixWorld(true);

  doorParts.forEach((part) => doorPivot.attach(part));
  return doorPivot;
}

const wheelRigCache = new WeakMap();
const doorRigCache = new WeakMap();

const BMWM4 = forwardRef(function BMWM4(
  { onWheelsReady, onError, doorOpen = false },
  forwardedRef,
) {
  const { scene } = useGLTF(modelUrl);
  const gl = useThree((state) => state.gl);
  const doorPivotRef = useRef(null);
  const animatedDoorRef = useRef(null);
  const doorAngleRef = useRef(0);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.rotation.y = MODEL_YAW;
    return clone;
  }, [scene]);

  const envMap = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);

  useEffect(() => {
    let mounted = true;

    try {
      model.traverse((object) => {
        if (!object.isMesh) return;

        object.castShadow = true;
        object.receiveShadow = true;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.filter(Boolean).forEach((material) => {
          if (material.isMeshStandardMaterial) {
            material.envMap = envMap;
            material.envMapIntensity = CAR_ENV_INTENSITY;
            material.needsUpdate = true;
          }

          // Make windows/windshield semi-transparent so the seated driver is visible inside
          const matName = `${material.name || ""} ${object.name || ""}`;
          if (GLASS_NAME_REGEX.test(matName) || material.opacity < 0.95) {
            material.transparent = true;
            material.opacity = Math.min(material.opacity || 0.42, 0.42);
            material.depthWrite = false;
            material.needsUpdate = true;
          }

          [
            "map",
            "normalMap",
            "roughnessMap",
            "metalnessMap",
            "emissiveMap",
          ].forEach((key) => {
            if (material[key]) material[key].anisotropy = 8;
          });
        });
      });

      let assemblies = wheelRigCache.get(model);
      if (!assemblies) {
        assemblies = buildWheelAssemblies(model);
        wheelRigCache.set(model, assemblies);
      }

      let doorPivot = doorRigCache.get(model);
      if (doorPivot === undefined) {
        doorPivot = buildDriverDoorRig(model);
        doorRigCache.set(model, doorPivot);
      }
      doorPivotRef.current = doorPivot;

      if (mounted) onWheelsReady?.(assemblies);
    } catch (error) {
      console.error("[BMW M4] Setup failed:", error);
      if (mounted) onError?.(error);
    }

    return () => {
      mounted = false;
      onWheelsReady?.([]);
    };
  }, [model, envMap, onError, onWheelsReady]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const targetAngle = doorOpen ? 1.08 : 0;
    doorAngleRef.current = THREE.MathUtils.damp(
      doorAngleRef.current,
      targetAngle,
      9,
      dt,
    );

    if (doorPivotRef.current) {
      doorPivotRef.current.rotation.y = -doorAngleRef.current;
    }
    if (animatedDoorRef.current) {
      animatedDoorRef.current.rotation.y = doorAngleRef.current;
      animatedDoorRef.current.visible = doorAngleRef.current > 0.03;
    }
  });

  return (
    <group ref={forwardedRef} scale={BMW_M4_SCALE}>
      <primitive object={model} />
      {/* Fallback visual driver door swing panel when GLB body is a single merged mesh */}
      {!doorPivotRef.current && (
        <group
          ref={animatedDoorRef}
          position={[0.55, 0.72, -0.92]}
          visible={false}
        >
          <mesh position={[-0.58, 0, -0.02]} castShadow>
            <boxGeometry args={[1.15, 0.62, 0.05]} />
            <meshStandardMaterial
              color="#1c2430"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
});

useGLTF.preload(modelUrl);

export default BMWM4;
```

===============================================================================
FILE: components/Car/CarController.js
===============================================================================

```js
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
    if (!enabled || !car) return;

    const colliders = collidersRef?.current;
    if (!colliders || !colliders.ready) return;

    const frameDelta = Math.min(rawDelta, 0.05);
    if (frameDelta <= 0) return;

    const s = state.current;
    const input = keys.current;
    const remote = remoteInputRef?.current;
    s.collisionCooldown = Math.max(0, s.collisionCooldown - frameDelta);

    const jumpDown = Boolean(input.j || remote?.jump);
    if (jumpDown && !s.jumpWasDown && !s.airborne) {
      s.airborne = true;
      s.vy = 9.5;
      s.vyGround = 0;
    }
    s.jumpWasDown = jumpDown;

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

    if (!s.spawned || s.resetRequested) {
      placeCar(car, s, colliders, rigData, SPAWN.x, SPAWN.z, SPAWN.yaw);
    }

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
```

===============================================================================
FILE: components/Character/CharacterController.js
===============================================================================

```js
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

const STEP_HEIGHT = 0.42;
const MAX_GROUND_DROP = 6.0;

const DEFAULT_GROUND_Y = 0;

const COLLIDER_REFRESH_DISTANCE = 5;
const COLLIDER_SEARCH_RADIUS = 22;

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
    character.position.y + 2.5,
    character.position.z,
  );

  _groundRaycaster.set(_origin, DOWN);
  _groundRaycaster.near = 0;
  _groundRaycaster.far = 2.5 + MAX_GROUND_DROP;

  const hits = _groundRaycaster.intersectObjects(meshes, false);
  let bestGroundY = null;

  for (const hit of hits) {
    if (!isGroundFace(hit)) continue;
    const groundY = hit.point.y;

    if (groundY > character.position.y + STEP_HEIGHT) continue;
    if (groundY < character.position.y - MAX_GROUND_DROP) continue;

    if (bestGroundY === null || groundY > bestGroundY) {
      bestGroundY = groundY;
    }
  }

  return bestGroundY;
}

function moveWithCollision(character, displacement, meshes) {
  _remaining.copy(displacement);
  if (_remaining.lengthSq() < 0.000001) return;

  const heights = [0.42, CHARACTER_HEIGHT * 0.52, CHARACTER_HEIGHT * 0.85];

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

        if (Math.abs(_normal.y) > 0.55) continue;

        if (!closestHit || hit.distance < closestHit.distance) {
          closestHit = hit;
        }
        break;
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
}) {
  if (airborne) return "jump";

  if (crouching) {
    return speed > 0.2 ? "crouchWalk" : "crouchIdle";
  }

  if (!hasInput || speed < 0.2) {
    return "idle";
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

    if (hasInput) {
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

    const jumpDown = Boolean(input.space || remote?.jump) && !emoteActive;

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
```

===============================================================================
FILE: components/Character/CharacterModel.jsx
===============================================================================

```jsx
import React, { forwardRef, useEffect, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useAnimations, useFBX } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

import characterUrl from "../../assets/models/Characters/X Bot.fbx";

export const CHARACTER_SCALE = 0.01;

/* ------------------------------------------------------------------ */
/* Discover animation files                                           */
/* ------------------------------------------------------------------ */

const animationContext = require.context(
  "../../assets/models/Characters",
  false,
  /\.fbx$/i,
);

const animationKeys = animationContext
  .keys()
  .filter((key) => !/x\s*bot\.fbx$/i.test(key));

const animationUrls = animationKeys.map((key) => animationContext(key));

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const ANIMATION_ALIASES = {
  idle: ["idle", "standingidle"],
  walk: ["walking", "walk"],
  run: ["running", "run"],
  sprint: ["sprint", "running", "run"],
  backward: ["walkingbackwards", "walkbackwards", "backwardwalking"],
  strafeLeft: ["leftstrafe", "strafingleft"],
  strafeRight: ["rightstrafe", "strafingright", "leftstrafe"],
  crouchIdle: ["crouchingidle", "crouchidle"],
  crouchWalk: ["crouchwalk", "crouchingwalk"],
  jump: ["jumping", "jump"],
  wave: ["wave", "waving", "idle"],
  dance: ["MacarenaDance", "hiphopdancing", "breakdance", "crouchwalk"],
  salute: ["salute", "jumping"],
  celebrate: ["celebrate", "celebration", "victory", "jumping"],
  point: ["point", "pointing", "crouchingidle"],
  sit: ["sit", "sittingidle", "sitting", "crouchingidle"],
  drivingSeat: ["driving"],
  enterCar: ["enteringcar"],
  exitCar: ["exitingcar"],
};

const ONE_SHOT = new Set([
  "wave",
  "dance",
  "salute",
  "celebrate",
  "point",
  "sit",
  "enterCar",
  "exitCar",
]);

const MISSING_CLIP_FALLBACK_MS = 650;

/**
 * Mixamo FBX animations bake horizontal root motion into the Hips position track,
 * which makes the character mesh drift away from its collider and snap back.
 * Lock X and Z on the Hips position track to keep animations in-place.
 */
function stripRootMotion(clip) {
  clip.tracks.forEach((track) => {
    if (/hips\.position$/i.test(track.name)) {
      const values = track.values;
      const baseX = values[0] || 0;
      const baseZ = values[2] || 0;
      for (let i = 0; i < values.length; i += 3) {
        values[i] = baseX;
        values[i + 2] = baseZ;
      }
    }
  });
  return clip;
}

const CharacterModel = forwardRef(function CharacterModel(
  { animation = "idle", visible = true, steerValue = 0, onAnimationFinished },
  forwardedRef,
) {
  const sourceCharacter = useFBX(characterUrl);

  const character = useMemo(
    () => cloneSkeleton(sourceCharacter),
    [sourceCharacter],
  );

  const bonesRef = useMemo(() => ({}), []);

  const animationModels = useLoader(FBXLoader, animationUrls);

  const clips = useMemo(() => {
    const output = [];

    animationModels.forEach((fbx, index) => {
      const filePath = animationKeys[index];
      const fileName = filePath
        .split("/")
        .pop()
        .replace(/\.fbx$/i, "");

      const sourceClip = fbx.animations?.[0];
      if (!sourceClip) return;

      const clip = stripRootMotion(sourceClip.clone());
      clip.name = normalize(fileName);
      output.push(clip);
    });

    return output;
  }, [animationModels]);

  const { actions, mixer } = useAnimations(clips, forwardedRef);

  useEffect(() => {
    character.traverse((node) => {
      if (node.isBone) {
        bonesRef[node.name] = node;
      }
      if (!node.isMesh) return;

      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;

      if (node.material) {
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];

        materials.forEach((material) => {
          if (!material) return;
          material.side = THREE.FrontSide;
          material.needsUpdate = true;
        });
      }
    });
  }, [character, bonesRef]);

  useEffect(() => {
    // Rotate the inner FBX model by +90 deg so local +X is forward (matching CarController),
    // or keep standard Mixamo +Z and let CharacterController align rotation.
    character.rotation.set(0, 0, 0);
  }, [character]);

  
useEffect(() => {
  const aliases = ANIMATION_ALIASES[animation] || [normalize(animation)];

  let action = null;

  for (const alias of aliases) {
    if (actions[alias]) {
      action = actions[alias];
      break;
    }
  }

  Object.values(actions).forEach((candidate) => {
    if (candidate && candidate !== action) {
      candidate.fadeOut(0.15);
    }
  });

  if (!action) {
    console.error(
      `[CharacterModel] Animation not found: ${animation}`,
      Object.keys(actions),
    );

    if (ONE_SHOT.has(animation)) {
      const timer = window.setTimeout(() => {
        onAnimationFinished?.(animation);
      }, MISSING_CLIP_FALLBACK_MS);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }

  const oneShot = ONE_SHOT.has(animation);

  action.reset();
  action.enabled = true;
  action.paused = false;
  action.clampWhenFinished = oneShot;
  action.timeScale = 1;

  action.setLoop(
    oneShot ? THREE.LoopOnce : THREE.LoopRepeat,
    oneShot ? 1 : Infinity,
  );

  console.log("[Character Animation]", {
    requested: animation,
    selected: action.getClip().name,
    duration: action.getClip().duration,
    oneShot,
  });

  const handleFinished = (event) => {
    if (event.action !== action) return;
    onAnimationFinished?.(animation);
  };

  if (oneShot) {
    mixer.addEventListener("finished", handleFinished);
  }

  action.fadeIn(0.2).play();

  return () => {
    if (oneShot) {
      mixer.removeEventListener("finished", handleFinished);
    }

    action.fadeOut(0.15);
  };
}, [animation, actions, mixer, onAnimationFinished]);

  // Apply seated driving posture when inside the car

  useEffect(() => {
    return () => {
      mixer.stopAllAction();
    };
  }, [mixer]);

  return (
    <group ref={forwardedRef} scale={CHARACTER_SCALE} visible={visible}>
      <primitive object={character} />
    </group>
  );
});

export default CharacterModel;
```

===============================================================================
FILE: components/Controller/PhoneControllerApp.jsx
===============================================================================

```jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { io } from "socket.io-client";
import {
  MAX_TILT_DEG,
  MAX_WHEEL_ROTATION_DEG,
  SCENE_PRESETS,
  TILT_DEADZONE_DEG,
} from "../../config/gameConstants";
import { extractTiltDegrees, getSocketUrl } from "../../utils/network";
import Icons from "../UI/Icons";
import HoldButton from "../UI/HoldButton";
import SteeringWheelGraphic from "../UI/SteeringWheelGraphic";

const CONTROLLER_EMOTES = [
  { id: "wave", label: "WAVE" },
  { id: "dance", label: "DANCE" },
  { id: "salute", label: "SALUTE" },
  { id: "celebrate", label: "WIN" },
];

export default function PhoneControllerApp() {
  const [connected, setConnected] = useState(false);
  const [steerMode, setSteerMode] = useState("wheel");
  const [steerSide, setSteerSide] = useState("left");
  const [scenePreset, setScenePreset] = useState("track");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroPermNeeded, setGyroPermNeeded] = useState(false);
  const [gyroPromptOpen, setGyroPromptOpen] = useState(false);
  const [gyroError, setGyroError] = useState("");
  const [gyroSensorDetected, setGyroSensorDetected] = useState(false);
  const [steerVal, setSteerVal] = useState(0);
  const [wheelGrabbed, setWheelGrabbed] = useState(false);
  const [joyKnob, setJoyKnob] = useState({ x: 0, y: 0, active: false });
  const [autoRun, setAutoRun] = useState(false);
  const [swipeIndicator, setSwipeIndicator] = useState({
    active: false,
    offset: 0,
  });

  const [telemetry, setTelemetry] = useState({
    speed: 0,
    gear: "N",
    rpm: 850,
    drifting: false,
    boost: false,
    playerMode: "driving",
    nearCar: false,
  });

  const [isPortraitViewport, setIsPortraitViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.innerHeight > window.innerWidth
      : false,
  );

  const socketRef = useRef(null);
  const inputRef = useRef({
    accelerate: false,
    brake: false,
    handbrake: false,
    boost: false,
    jump: false,
    crouch: false,
    sprint: false,
    autoRun: false,
    steer: 0,
    moveX: 0,
    moveY: 0,
    lookX: 0,
    lookY: 0,
  });
  const rawTiltRef = useRef(0);
  const tiltZeroRef = useRef(0);
  const wheelBoxRef = useRef(null);
  const joyBoxRef = useRef(null);
  const swipeBoxRef = useRef(null);
  const prevSwipePtRef = useRef(null);
  const prevFingerAngleRef = useRef(null);
  const wheelAngleDegRef = useRef(0);

  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("selectstart", prevent);

    const onResize = () => {
      setIsPortraitViewport(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("selectstart", prevent);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const emitInput = useCallback((extra = undefined) => {
    const payload = extra
      ? { ...inputRef.current, ...extra }
      : inputRef.current;
    socketRef.current?.emit("controller:input", payload);
  }, []);

  useEffect(() => {
    const socket = io(getSocketUrl(), { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("controller:action", "syncState");
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("game:telemetry", (data) => {
      if (!data) return;
      setTelemetry((prev) => ({
        ...prev,
        ...data,
        playerMode: data.playerMode || prev.playerMode,
      }));
    });
    socket.on("game:haptic", (pattern) => {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    });

    const heartbeat = setInterval(() => {
      if (socket.connected) {
        socket.emit("controller:input", inputRef.current);
      }
    }, 30);

    return () => {
      clearInterval(heartbeat);
      socket.disconnect();
    };
  }, []);

  // Automatically clear stale inputs when switching between Car HUD and Character HUD
  useEffect(() => {
    if (telemetry.playerMode === "driving") {
      setAutoRun(false);
      inputRef.current.autoRun = false;
      inputRef.current.moveX = 0;
      inputRef.current.moveY = 0;
      inputRef.current.sprint = false;
      inputRef.current.crouch = false;
      setJoyKnob({ x: 0, y: 0, active: false });
    } else if (telemetry.playerMode === "onFoot") {
      inputRef.current.accelerate = false;
      inputRef.current.brake = false;
      inputRef.current.handbrake = false;
      inputRef.current.boost = false;
      inputRef.current.steer = 0;
      setSteerVal(0);
    }
  }, [telemetry.playerMode]);

  const updateField = useCallback(
    (key, value) => {
      inputRef.current[key] = value;
      emitInput();
    },
    [emitInput],
  );

  const toggleAutoRun = useCallback(() => {
    setAutoRun((prev) => {
      const next = !prev;
      inputRef.current.autoRun = next;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(20);
      }
      emitInput();
      return next;
    });
  }, [emitInput]);

  /* Left Joystick for Small / In-Place Movements */
  const mapTouchDelta = useCallback(
    (el, clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;

      if (isPortraitViewport) {
        const temp = dx;
        dx = dy;
        dy = -temp;
      }

      const maxR = Math.min(rect.width, rect.height) * 0.38;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) {
        dx = (dx / dist) * maxR;
        dy = (dy / dist) * maxR;
      }

      return {
        dx,
        dy,
        normX: THREE.MathUtils.clamp(dx / maxR, -1, 1),
        normY: THREE.MathUtils.clamp(-dy / maxR, -1, 1),
      };
    },
    [isPortraitViewport],
  );

  const handleMoveJoyUpdate = useCallback(
    (e) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      const el = joyBoxRef.current;
      if (!el) return;
      const pt = e.targetTouches?.[0] || e.touches?.[0] || e;
      const { dx, dy, normX, normY } = mapTouchDelta(
        el,
        pt.clientX,
        pt.clientY,
      );
      inputRef.current.moveX = normX;
      inputRef.current.moveY = normY;

      // Pulling backward on the joystick stops continuous auto-run
      if (normY < -0.35 && inputRef.current.autoRun) {
        inputRef.current.autoRun = false;
        setAutoRun(false);
      }

      setJoyKnob({ x: dx, y: dy, active: true });
      emitInput();
    },
    [mapTouchDelta, emitInput],
  );

  const handleMoveJoyEnd = useCallback(
    (e) => {
      if (e && e.cancelable) e.preventDefault();
      inputRef.current.moveX = 0;
      inputRef.current.moveY = 0;
      setJoyKnob({ x: 0, y: 0, active: false });
      emitInput();
    },
    [emitInput],
  );

  /* Right Horizontal Swipe Pad for Turning Character Direction */
  const extractLandscapeXY = useCallback(
    (pt) => {
      if (isPortraitViewport) {
        return { x: pt.clientY, y: -pt.clientX };
      }
      return { x: pt.clientX, y: pt.clientY };
    },
    [isPortraitViewport],
  );

  const handleSwipeStart = useCallback(
    (e) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      const pt = e.targetTouches?.[0] || e.touches?.[0] || e;
      const pos = extractLandscapeXY(pt);
      prevSwipePtRef.current = { x: pos.x, y: pos.y, startX: pos.x };
      setSwipeIndicator({ active: true, offset: 0 });
    },
    [extractLandscapeXY],
  );

  const handleSwipeMove = useCallback(
    (e) => {
      if (!prevSwipePtRef.current) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      const pt = e.targetTouches?.[0] || e.touches?.[0] || e;
      const pos = extractLandscapeXY(pt);

      const deltaX = pos.x - prevSwipePtRef.current.x;
      const deltaY = pos.y - prevSwipePtRef.current.y;
      prevSwipePtRef.current.x = pos.x;
      prevSwipePtRef.current.y = pos.y;

      const visualOffset = THREE.MathUtils.clamp(
        pos.x - prevSwipePtRef.current.startX,
        -58,
        58,
      );
      setSwipeIndicator({ active: true, offset: visualOffset });

      emitInput({
        lookDeltaX: deltaX * 0.012,
        lookDeltaY: deltaY * 0.006,
      });
    },
    [extractLandscapeXY, emitInput],
  );

  const handleSwipeEnd = useCallback((e) => {
    if (e && e.cancelable) e.preventDefault();
    prevSwipePtRef.current = null;
    setSwipeIndicator({ active: false, offset: 0 });
  }, []);

  const openGyroPrompt = useCallback(() => {
    setSteerMode("tilt");
    setGyroPromptOpen(true);
    setGyroError("");
  }, []);

  const requestAndEnableGyro = useCallback(async () => {
    if (!window.isSecureContext) {
      setGyroError(
        "GYROSCOPE ACCESS REQUIRES HTTPS OR LOCALHOST. A LOCAL WI-FI HTTP ADDRESS MAY BE BLOCKED.",
      );
      setGyroPermNeeded(true);
      return;
    }

    if (typeof DeviceOrientationEvent === "undefined") {
      setGyroError("DEVICE ORIENTATION IS NOT SUPPORTED BY THIS BROWSER.");
      setGyroPermNeeded(true);
      return;
    }

    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") {
          setGyroActive(false);
          setGyroPermNeeded(true);
          setGyroError(
            "SENSOR PERMISSION WAS DENIED. ALLOW MOTION ACCESS AND RETRY.",
          );
          return;
        }
      }

      setGyroPermNeeded(false);
      setGyroError("");
      setGyroSensorDetected(false);
      rawTiltRef.current = 0;
      tiltZeroRef.current = 0;
      setGyroActive(true);
      setGyroPromptOpen(false);
    } catch (error) {
      console.error("Gyroscope activation failed:", error);
      setGyroActive(false);
      setGyroPermNeeded(true);
      setGyroError(error?.message || "UNABLE TO INITIALIZE GYROSCOPE.");
    }
  }, []);

  const calibrateTilt = useCallback(() => {
    tiltZeroRef.current = rawTiltRef.current;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(25);
    }
  }, []);

  useEffect(() => {
    if (steerMode !== "tilt" || !gyroActive) {
      inputRef.current.steer = 0;
      setSteerVal(0);
      emitInput();
      return undefined;
    }

    const onOrientation = (event) => {
      if (event.beta === null && event.gamma === null) return;

      setGyroSensorDetected(true);
      const deg = extractTiltDegrees(event, isPortraitViewport);
      rawTiltRef.current = deg;

      const calibrated = deg - tiltZeroRef.current;
      const abs = Math.abs(calibrated);

      let nextSteer = 0;
      if (abs >= TILT_DEADZONE_DEG) {
        const effective = Math.sign(calibrated) * (abs - TILT_DEADZONE_DEG);
        const normRight = THREE.MathUtils.clamp(
          effective / (MAX_TILT_DEG - TILT_DEADZONE_DEG),
          -1,
          1,
        );
        nextSteer = -normRight;
      }

      inputRef.current.steer = nextSteer;
      setSteerVal(nextSteer);
      emitInput();
    };

    window.addEventListener("deviceorientation", onOrientation, true);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  }, [steerMode, gyroActive, isPortraitViewport, emitInput]);

  const getFingerPolarAngle = useCallback(
    (point) => {
      const el = wheelBoxRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      let dx = point.clientX - cx;
      let dy = point.clientY - cy;

      if (isPortraitViewport) {
        const temp = dx;
        dx = dy;
        dy = -temp;
      }

      return (Math.atan2(dx, -dy) * 180) / Math.PI;
    },
    [isPortraitViewport],
  );

  const handleWheelStart = useCallback(
    (e) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      const pt = e.targetTouches?.[0] || e.touches?.[0] || e;
      prevFingerAngleRef.current = getFingerPolarAngle(pt);
      setWheelGrabbed(true);
    },
    [getFingerPolarAngle],
  );

  const handleWheelMove = useCallback(
    (e) => {
      if (prevFingerAngleRef.current === null) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const pt = e.targetTouches?.[0] || e.touches?.[0] || e;
      const currentFingerAngle = getFingerPolarAngle(pt);

      let deltaDeg = currentFingerAngle - prevFingerAngleRef.current;
      if (deltaDeg > 180) deltaDeg -= 360;
      if (deltaDeg < -180) deltaDeg += 360;

      prevFingerAngleRef.current = currentFingerAngle;

      wheelAngleDegRef.current = THREE.MathUtils.clamp(
        wheelAngleDegRef.current + deltaDeg,
        -MAX_WHEEL_ROTATION_DEG,
        MAX_WHEEL_ROTATION_DEG,
      );

      const nextSteer = THREE.MathUtils.clamp(
        -wheelAngleDegRef.current / MAX_WHEEL_ROTATION_DEG,
        -1,
        1,
      );
      inputRef.current.steer = nextSteer;
      setSteerVal(nextSteer);
      emitInput();
    },
    [getFingerPolarAngle, emitInput],
  );

  const handleWheelEnd = useCallback(
    (e) => {
      if (e && e.cancelable) e.preventDefault();
      prevFingerAngleRef.current = null;
      wheelAngleDegRef.current = 0;
      setWheelGrabbed(false);
      inputRef.current.steer = 0;
      setSteerVal(0);
      emitInput();
    },
    [emitInput],
  );

  const toggleFullscreen = useCallback(() => {
    const docEl = document.documentElement;
    if (!document.fullscreenElement && docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
      if (window.screen?.orientation?.lock) {
        window.screen.orientation.lock("landscape").catch(() => {});
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleSteerSideChange = useCallback((side) => {
    setSteerSide(side);
    socketRef.current?.emit("controller:settings", { steerHudSide: side });
  }, []);

  const handleSceneChange = useCallback((presetKey) => {
    setScenePreset(presetKey);
    socketRef.current?.emit("controller:settings", { scenePreset: presetKey });
  }, []);

  const isOnFoot =
    telemetry.playerMode === "onFoot" || telemetry.playerMode === "exiting";
  const rpmRatio = Math.min(1, (telemetry.rpm || 850) / 7500);
  const ledCount = 14;
  const activeLeds = Math.round(rpmRatio * ledCount);

  return (
    <div
      className={
        isPortraitViewport ? "mc-viewport mc-force-landscape" : "mc-viewport"
      }
    >
      <div className="mc-rpm-strip">
        {Array.from({ length: ledCount }).map((_, idx) => {
          const isOn = idx < activeLeds;
          const tier = idx < 6 ? "green" : idx < 10 ? "blue" : "red";
          return (
            <span
              key={idx}
              className={`mc-shift-led ${isOn ? `on ${tier}` : ""}`}
            />
          );
        })}
      </div>

      <header className="mc-header">
        <div className="mc-brand-status">
          <div className="mc-m-badge">M</div>
          <div>
            <div className="mc-conn-row">
              <span
                className={
                  connected ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"
                }
              />
              <span className="mc-conn-text">
                {connected ? "M-LINK ACTIVE" : "CONNECTING..."}
              </span>
            </div>
            <div className="mc-sub-mode">
              {isOnFoot
                ? "ON FOOT · JOYSTICK + AUTO-RUN + SWIPE TURN"
                : steerMode === "tilt"
                  ? "GYRO TILT · L: BRAKE | R: ACCEL"
                  : `WHEEL (${steerSide.toUpperCase()}) · CIRCULAR TOUCH`}
            </div>
          </div>
        </div>

        <div className="mc-digital-cluster">
          <div className="mc-speed-block">
            <span className="mc-speed-digits">
              {String(Math.abs(telemetry.speed || 0)).padStart(3, "0")}
            </span>
            <span className="mc-speed-unit">KM/H</span>
          </div>
          <div className="mc-cluster-divider" />
          <div className="mc-gear-block">
            <span className="mc-gear-label">MODE</span>
            <span className="mc-gear-digit">
              {isOnFoot ? (autoRun ? "RUN" : "WALK") : telemetry.gear || "N"}
            </span>
          </div>
        </div>

        <div className="mc-icon-toolbar">
          <button
            type="button"
            className="mc-icon-btn mc-action-pill"
            onClick={() =>
              socketRef.current?.emit("controller:action", "toggleVehicle")
            }
            title="Enter / Exit Car"
          >
            {isOnFoot ? "ENTER CAR" : "EXIT CAR"}
          </button>

          <button
            type="button"
            className="mc-icon-btn"
            onClick={() =>
              socketRef.current?.emit("controller:action", "camera")
            }
            title="Switch Camera"
          >
            <Icons.Camera />
          </button>

          <button
            type="button"
            className="mc-icon-btn"
            onClick={() =>
              socketRef.current?.emit("controller:action", "reset")
            }
            title="Reset Car"
          >
            <Icons.Reset />
          </button>

          <button
            type="button"
            className="mc-icon-btn"
            onClick={toggleFullscreen}
            title="Fullscreen Landscape"
          >
            <Icons.Fullscreen />
          </button>

          <button
            type="button"
            className="mc-icon-btn mc-settings-trigger"
            onClick={() => setSettingsOpen(true)}
            title="Controller Settings"
          >
            <Icons.Settings />
          </button>
        </div>
      </header>

      {isOnFoot ? (
        <div className="mc-character-layout">
          {/* Left Zone: Analog Joystick for Small / In-Place Movements */}
          <div
            ref={joyBoxRef}
            className="mc-joy-zone"
            onTouchStart={handleMoveJoyUpdate}
            onTouchMove={handleMoveJoyUpdate}
            onTouchEnd={handleMoveJoyEnd}
            onTouchCancel={handleMoveJoyEnd}
            onMouseDown={handleMoveJoyUpdate}
            onMouseMove={(e) => {
              if (e.buttons === 1) handleMoveJoyUpdate(e);
            }}
            onMouseUp={handleMoveJoyEnd}
            onMouseLeave={handleMoveJoyEnd}
          >
            <div className="mc-joy-ring">
              <div
                className={
                  joyKnob.active ? "mc-joy-knob active" : "mc-joy-knob"
                }
                style={{
                  transform: `translate(${joyKnob.x}px, ${joyKnob.y}px)`,
                }}
              />
            </div>
            <div className="mc-rotary-footer">
              <span className="mc-rotary-hint">FINE MOVE JOYSTICK</span>
              <span className="mc-rotary-deg">
                {Math.round(
                  Math.hypot(inputRef.current.moveX, inputRef.current.moveY) *
                    100,
                )}
                %
              </span>
            </div>
          </div>

          {/* Center Zone: Continuous Auto-Run Button + Sprint, Jump, Crouch, Enter Car, Emotes */}
          <div className="mc-char-center-actions">
            <button
              type="button"
              className={
                autoRun ? "mc-autorun-btn is-running" : "mc-autorun-btn"
              }
              onClick={toggleAutoRun}
            >
              <span className="mc-autorun-dot" />
              <div className="mc-autorun-text">
                <span className="mc-autorun-title">
                  {autoRun
                    ? "RUNNING STRAIGHT (TAP TO STOP)"
                    : "RUN CONTINUOUSLY"}
                </span>
                <span className="mc-autorun-sub">
                  SWIPE RIGHT PAD HORIZONTALLY TO STEER DIRECTION
                </span>
              </div>
            </button>

            <div className="mc-char-primary-grid">
              <HoldButton
                className="mc-aux-btn mc-boost-btn"
                activeClassName="is-pressed"
                onChange={(v) => updateField("sprint", v)}
              >
                <span className="mc-aux-label">SPRINT</span>
              </HoldButton>

              <HoldButton
                className="mc-aux-btn mc-drift-btn"
                activeClassName="is-pressed"
                onChange={(v) => updateField("jump", v)}
              >
                <span className="mc-aux-label">JUMP ↑</span>
              </HoldButton>

              <HoldButton
                className="mc-aux-btn mc-crouch-btn"
                activeClassName="is-pressed"
                onChange={(v) => updateField("crouch", v)}
              >
                <span className="mc-aux-label">CROUCH</span>
              </HoldButton>

              <button
                type="button"
                className={`mc-aux-btn mc-enter-car-btn ${telemetry.nearCar ? "ready" : ""}`}
                onClick={() =>
                  socketRef.current?.emit("controller:action", "toggleVehicle")
                }
              >
                <span className="mc-aux-label">ENTER BMW</span>
              </button>
            </div>

            <div className="mc-char-emote-row">
              {CONTROLLER_EMOTES.map((emote) => (
                <button
                  key={emote.id}
                  type="button"
                  className="mc-mini-emote-btn"
                  onClick={() =>
                    socketRef.current?.emit(
                      "controller:action",
                      `emote:${emote.id}`,
                    )
                  }
                >
                  {emote.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Zone: Horizontal Swipe Trackpad for Turning Direction */}
          <div
            ref={swipeBoxRef}
            className="mc-swipe-turn-zone"
            onTouchStart={handleSwipeStart}
            onTouchMove={handleSwipeMove}
            onTouchEnd={handleSwipeEnd}
            onTouchCancel={handleSwipeEnd}
            onMouseDown={handleSwipeStart}
            onMouseMove={(e) => {
              if (e.buttons === 1) handleSwipeMove(e);
            }}
            onMouseUp={handleSwipeEnd}
            onMouseLeave={handleSwipeEnd}
          >
            <div className="mc-swipe-header">SWIPE HORIZONTALLY TO TURN</div>

            <div className="mc-swipe-track">
              <span className="mc-swipe-arrow">‹‹ LEFT</span>
              <div
                className={
                  swipeIndicator.active
                    ? "mc-swipe-puck active"
                    : "mc-swipe-puck"
                }
                style={{
                  transform: `translateX(${swipeIndicator.offset}px)`,
                }}
              />
              <span className="mc-swipe-arrow">RIGHT ››</span>
            </div>

            <div className="mc-rotary-footer">
              <span className="mc-rotary-hint">DIRECTION TRACKPAD</span>
              <span className="mc-rotary-deg">360° TURN</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="mc-jump-btn mc-jump-floating"
            onPointerDown={(event) => {
              event.preventDefault();
              updateField("jump", true);
            }}
            onPointerUp={() => updateField("jump", false)}
            onPointerCancel={() => updateField("jump", false)}
            onPointerLeave={() => updateField("jump", false)}
          >
            <span className="mc-jump-icon">↑</span>
            <span>JUMP</span>
          </button>

          {steerMode === "tilt" ? (
            <div className="mc-gyro-layout">
              <div className="mc-gyro-side">
                <HoldButton
                  className="mc-aux-btn mc-drift-btn"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("handbrake", v)}
                >
                  <span className="mc-btn-icon">
                    <Icons.Drift />
                  </span>
                  <span className="mc-aux-label">DRIFT</span>
                </HoldButton>

                <HoldButton
                  className="mc-pedal mc-brake-pedal"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("brake", v)}
                >
                  <div className="mc-pedal-treads">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="mc-pedal-icon">
                    <Icons.BrakeDisc />
                  </div>
                  <div className="mc-pedal-title">BRAKE</div>
                  <div className="mc-pedal-sub">REVERSE</div>
                </HoldButton>
              </div>

              <div className="mc-gyro-center-card">
                <div className="mc-gyro-badge">
                  <Icons.Gyro />
                  <span>TILT PHONE TO STEER</span>
                </div>

                {!gyroActive ? (
                  <button
                    type="button"
                    className="mc-enable-gyro-action-btn"
                    onClick={openGyroPrompt}
                  >
                    ENABLE GYRO SENSORS
                  </button>
                ) : (
                  <div className="mc-gyro-horizon">
                    <div
                      className="mc-gyro-horizon-bar"
                      style={{
                        transform: `rotate(${Math.round(-steerVal * 35)}deg)`,
                      }}
                    >
                      <span className="mc-horizon-tip" />
                      <span className="mc-horizon-center" />
                      <span className="mc-horizon-tip" />
                    </div>
                    <div className="mc-gyro-angle-val">
                      {steerVal > 0.04
                        ? `LEFT ${Math.round(steerVal * 100)}%`
                        : steerVal < -0.04
                          ? `RIGHT ${Math.round(Math.abs(steerVal) * 100)}%`
                          : "0° CENTER"}
                    </div>
                  </div>
                )}

                {gyroPermNeeded && (
                  <div className="mc-gyro-perm-warning">
                    PERMISSION DENIED. CHECK BROWSER HTTPS/PERMISSIONS.
                  </div>
                )}

                <button
                  type="button"
                  className="mc-recenter-pill"
                  onClick={calibrateTilt}
                >
                  ZERO TILT (CENTER)
                </button>
              </div>

              <div className="mc-gyro-side">
                <HoldButton
                  className="mc-aux-btn mc-boost-btn"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("boost", v)}
                >
                  <span className="mc-btn-icon">
                    <Icons.Boost />
                  </span>
                  <span className="mc-aux-label">M-BOOST</span>
                </HoldButton>

                <HoldButton
                  className="mc-pedal mc-gas-pedal"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("accelerate", v)}
                >
                  <div className="mc-pedal-treads">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="mc-pedal-icon">
                    <Icons.GasPedal />
                  </div>
                  <div className="mc-pedal-title">ACCEL</div>
                  <div className="mc-pedal-sub">THROTTLE</div>
                </HoldButton>
              </div>
            </div>
          ) : (
            <div
              className={
                steerSide === "right"
                  ? "mc-wheel-layout wheel-on-right"
                  : "mc-wheel-layout wheel-on-left"
              }
            >
              <div
                ref={wheelBoxRef}
                className="mc-rotary-wheel-zone"
                onTouchStart={handleWheelStart}
                onTouchMove={handleWheelMove}
                onTouchEnd={handleWheelEnd}
                onTouchCancel={handleWheelEnd}
                onMouseDown={handleWheelStart}
                onMouseMove={(e) => {
                  if (e.buttons === 1) handleWheelMove(e);
                }}
                onMouseUp={handleWheelEnd}
                onMouseLeave={handleWheelEnd}
              >
                <div className="mc-rotary-ring-guide">
                  <div className="mc-rotary-glow" />
                  <SteeringWheelGraphic
                    steerValue={steerVal}
                    activeGrab={wheelGrabbed}
                  />
                </div>

                <div className="mc-rotary-footer">
                  <span className="mc-rotary-hint">CIRCULAR ROTATION</span>
                  <span className="mc-rotary-deg">
                    {Math.round(-steerVal * MAX_WHEEL_ROTATION_DEG)}°
                  </span>
                </div>
              </div>

              <div className="mc-dual-pedals-zone">
                <div className="mc-aux-row">
                  <HoldButton
                    className="mc-aux-btn mc-drift-btn"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("handbrake", v)}
                  >
                    <span className="mc-btn-icon">
                      <Icons.Drift />
                    </span>
                    <span className="mc-aux-label">DRIFT</span>
                  </HoldButton>

                  <HoldButton
                    className="mc-aux-btn mc-boost-btn"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("boost", v)}
                  >
                    <span className="mc-btn-icon">
                      <Icons.Boost />
                    </span>
                    <span className="mc-aux-label">M-BOOST</span>
                  </HoldButton>
                </div>

                <div className="mc-pedals-pair">
                  <HoldButton
                    className="mc-pedal mc-brake-pedal"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("brake", v)}
                  >
                    <div className="mc-pedal-treads">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mc-pedal-icon">
                      <Icons.BrakeDisc />
                    </div>
                    <div className="mc-pedal-title">BRAKE</div>
                    <div className="mc-pedal-sub">REVERSE</div>
                  </HoldButton>

                  <HoldButton
                    className="mc-pedal mc-gas-pedal"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("accelerate", v)}
                  >
                    <div className="mc-pedal-treads">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mc-pedal-icon">
                      <Icons.GasPedal />
                    </div>
                    <div className="mc-pedal-title">ACCEL</div>
                    <div className="mc-pedal-sub">THROTTLE</div>
                  </HoldButton>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {settingsOpen && (
        <div
          className="mc-modal-backdrop"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="mc-settings-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mc-settings-header">
              <div className="mc-settings-title">
                <Icons.Settings />
                <span>CONTROLLER & HUD SETTINGS</span>
              </div>
              <button
                type="button"
                className="mc-icon-btn"
                onClick={() => setSettingsOpen(false)}
              >
                <Icons.Close />
              </button>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">STEERING MODE</div>
              <div className="mc-segmented">
                <button
                  type="button"
                  className={
                    steerMode === "wheel" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={() => {
                    setSteerMode("wheel");
                    inputRef.current.steer = 0;
                    setSteerVal(0);
                    emitInput();
                  }}
                >
                  <Icons.Wheel />
                  <span>STEERING WHEEL</span>
                </button>
                <button
                  type="button"
                  className={
                    steerMode === "tilt" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={openGyroPrompt}
                >
                  <Icons.Gyro />
                  <span>GYRO TILT (PEDALS)</span>
                </button>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">STEERING SIDE (WHEEL MODE)</div>
              <div className="mc-segmented">
                <button
                  type="button"
                  className={
                    steerSide === "left" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={() => handleSteerSideChange("left")}
                >
                  <span>STEER LEFT · PEDALS RIGHT</span>
                </button>
                <button
                  type="button"
                  className={
                    steerSide === "right" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={() => handleSteerSideChange("right")}
                >
                  <span>STEER RIGHT · PEDALS LEFT</span>
                </button>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">WORLD ENVIRONMENT</div>
              <div className="mc-segmented">
                {Object.entries(SCENE_PRESETS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    className={
                      scenePreset === key ? "mc-seg-btn active" : "mc-seg-btn"
                    }
                    onClick={() => handleSceneChange(key)}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {gyroPromptOpen && (
        <div
          className="mc-modal-backdrop mc-gyro-modal-backdrop"
          onClick={() => setGyroPromptOpen(false)}
        >
          <div
            className="mc-gyro-permission-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mc-gyro-modal-icon">
              <Icons.Gyro />
            </div>
            <h2>ENABLE GYRO SENSORS</h2>
            <p>
              Use your phone's motion sensors to control the steering of your
              BMW M4.
            </p>
            <div className="mc-gyro-instructions">
              <div>01. Hold your phone horizontally.</div>
              <div>02. Allow motion sensor permission.</div>
              <div>03. Tilt your phone to steer.</div>
            </div>
            <div className="mc-gyro-status">
              <span
                className={
                  gyroActive ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"
                }
              />
              {gyroActive
                ? gyroSensorDetected
                  ? "GYROSCOPE ACTIVE"
                  : "WAITING FOR SENSOR DATA"
                : "SENSOR NOT ACTIVATED"}
            </div>
            {gyroError && (
              <div className="mc-gyro-modal-error">{gyroError}</div>
            )}
            <button
              type="button"
              className="mc-enable-gyro-action-btn"
              onClick={requestAndEnableGyro}
            >
              {gyroError ? "RETRY GYRO ACTIVATION" : "ENABLE SENSORS"}
            </button>
            <button
              type="button"
              className="mc-recenter-pill"
              onClick={() => setGyroPromptOpen(false)}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

===============================================================================
FILE: components/Game/LaptopGameApp.jsx
===============================================================================

```jsx
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Loader } from "@react-three/drei";
import * as THREE from "three";
import { io } from "socket.io-client";

import {
  CAMERA_MODES,
  INITIAL_TELEMETRY,
  MAX_WHEEL_ROTATION_DEG,
} from "../../config/gameConstants";
import { getNetworkControllerUrl, getSocketUrl } from "../../utils/network";
import OpenWorldMap from "../World/OpenWorldMap";
import DrivingWorld from "../World/DrivingWorld";
import FollowCamera from "../World/FollowCamera";
import BMWM4 from "../Car/BMWM4";
import CarController from "../Car/CarController";
import CharacterModel, { CHARACTER_SCALE } from "../Character/CharacterModel";
import CharacterController from "../Character/CharacterController";
import Icons from "../UI/Icons";
import SteeringWheelGraphic from "../UI/SteeringWheelGraphic";
import SportSpeedometer from "../UI/SportSpeedometer";
import { GameSettingsModal, QrConnectModal } from "../UI/GameModals";

// Car faces +X when yaw = 0, so Left (driver side) is -Z
const DRIVER_DOOR_OFFSET = new THREE.Vector3(0.05, 0, -1.35);
const DRIVER_SEAT_OFFSET = new THREE.Vector3(-0.08, 0.18, -0.34);
const INTERACTION_DISTANCE = 3.6;
const MAX_ENTER_SPEED_KMH = 5.0;
const TRANSITION_DURATION_MS = 2000;

const EMOTES = [
  { key: "1", id: "wave", label: "Wave" },
  { key: "2", id: "dance", label: "Dance" },
  { key: "3", id: "salute", label: "Salute" },
  { key: "4", id: "celebrate", label: "Celebrate" },
  { key: "5", id: "point", label: "Point" },
  { key: "6", id: "sit", label: "Sit" },
];

const UP_AXIS = new THREE.Vector3(0, 1, 0);

function getCarWorldPoint(car, localOffset, target = new THREE.Vector3()) {
  if (!car) return target.set(0, 0, 0);
  target.copy(localOffset).applyAxisAngle(UP_AXIS, car.rotation.y);
  target.add(car.position);
  return target;
}

/**
 * Keeps the character model seated inside the car while driving,
 * and smoothly interpolates the character through the open door during enter/exit.
 */
function VehicleOccupantSync({
  carRef,
  characterRef,
  playerMode,
  transitionStartRef,
}) {
  const doorPos = useRef(new THREE.Vector3());
  const seatPos = useRef(new THREE.Vector3());

  useFrame(() => {
    const car = carRef.current;
    const character = characterRef.current;
    if (!car || !character) return;

    const forwardSeatYaw = car.rotation.y + Math.PI / 2;

    if (playerMode === "driving") {
      getCarWorldPoint(car, DRIVER_SEAT_OFFSET, seatPos.current);
      character.position.copy(seatPos.current);
      character.rotation.set(car.rotation.x, forwardSeatYaw, car.rotation.z);
      character.scale.setScalar(CHARACTER_SCALE * 0.86);
      return;
    }

    if (playerMode === "entering" || playerMode === "exiting") {
      const elapsed = performance.now() - transitionStartRef.current;
      const t = THREE.MathUtils.clamp(elapsed / TRANSITION_DURATION_MS, 0, 1);
      const smoothT = t * t * (3 - 2 * t);

      getCarWorldPoint(car, DRIVER_DOOR_OFFSET, doorPos.current);
      getCarWorldPoint(car, DRIVER_SEAT_OFFSET, seatPos.current);

      if (playerMode === "entering") {
        character.position.lerpVectors(
          doorPos.current,
          seatPos.current,
          smoothT,
        );
        character.rotation.set(0, forwardSeatYaw, 0);
        character.scale.setScalar(
          THREE.MathUtils.lerp(
            CHARACTER_SCALE,
            CHARACTER_SCALE * 0.86,
            smoothT,
          ),
        );
      } else {
        character.position.lerpVectors(
          seatPos.current,
          doorPos.current,
          smoothT,
        );
        character.rotation.set(0, forwardSeatYaw - smoothT * 0.4, 0);
        character.scale.setScalar(
          THREE.MathUtils.lerp(
            CHARACTER_SCALE * 0.86,
            CHARACTER_SCALE,
            smoothT,
          ),
        );
      }
      return;
    }

    character.scale.setScalar(CHARACTER_SCALE);
  });

  return null;
}

export default function LaptopGameApp() {
  const [scenePreset, setScenePreset] = useState("track");
  const [cameraMode, setCameraMode] = useState("chase");
  const [steerHudSide, setSteerHudSide] = useState("left");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [phoneLinked, setPhoneLinked] = useState(false);
  const [playerMode, setPlayerMode] = useState("driving"); // driving | onFoot | entering | exiting
  const [charAnimation, setCharAnimation] = useState("drivingSeat");
  const [nearCar, setNearCar] = useState(false);
  const [interactionMessage, setInteractionMessage] = useState("");
  const [emoteActive, setEmoteActive] = useState(false);
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [modelError, setModelError] = useState("");

  const collidersRef = useRef([]);
  const carRef = useRef(null);
  const characterRef = useRef(null);
  const wheelAssembliesRef = useRef([]);
  const socketRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const transitionStartRef = useRef(0);
  const interactionPointRef = useRef(new THREE.Vector3());
  const cameraYawRef = useRef(0);

  const physicsStateRef = useRef({
    vx: 0,
    vy: 0,
    steering: 0,
    isDrifting: false,
    boost: false,
  });

  const remoteInputRef = useRef({
    accelerate: false,
    brake: false,
    handbrake: false,
    boost: false,
    jump: false,
    crouch: false,
    sprint: false,
    autoRun: false,
    steer: 0,
    moveX: 0,
    moveY: 0,
    lookX: 0,
    lookY: 0,
    lookDeltaX: 0,
    lookDeltaY: 0,
    reset: false,
  });

  const isCharacterMode = playerMode === "onFoot" || playerMode === "exiting";
  const isTransitioning = playerMode === "entering" || playerMode === "exiting";
  const doorOpen = playerMode === "entering" || playerMode === "exiting";
  const speedKmh = Math.abs(Number(telemetry.speed) || 0);

  const clearRemoteInput = useCallback(() => {
    Object.assign(remoteInputRef.current, {
      accelerate: false,
      brake: false,
      handbrake: false,
      boost: false,
      jump: false,
      crouch: false,
      sprint: false,
      autoRun: false,
      steer: 0,
      moveX: 0,
      moveY: 0,
      lookX: 0,
      lookY: 0,
      lookDeltaX: 0,
      lookDeltaY: 0,
    });
  }, []);

  const cycleCamera = useCallback(() => {
    setCameraMode((previous) => {
      const index = CAMERA_MODES.findIndex((item) => item.id === previous);
      return CAMERA_MODES[(index + 1) % CAMERA_MODES.length].id;
    });
  }, []);

  const finishTransition = useCallback((expectedMode) => {
    if (expectedMode === "entering") {
      setPlayerMode("driving");
      setCharAnimation("drivingSeat");
      setInteractionMessage("");
    } else if (expectedMode === "exiting") {
      if (carRef.current && characterRef.current) {
        const door = getCarWorldPoint(
          carRef.current,
          DRIVER_DOOR_OFFSET,
          interactionPointRef.current,
        );
        characterRef.current.position.copy(door);
        characterRef.current.rotation.set(
          0,
          carRef.current.rotation.y + Math.PI / 2,
          0,
        );
      }
      setPlayerMode("onFoot");
      setCharAnimation("idle");
      setInteractionMessage("");
    }
    setEmoteActive(false);
    transitionTimerRef.current = null;
  }, []);

  const enterVehicle = useCallback(() => {
    if (
      playerMode !== "onFoot" ||
      !nearCar ||
      !carRef.current ||
      !characterRef.current
    )
      return;
    if (speedKmh > MAX_ENTER_SPEED_KMH) {
      setInteractionMessage("Stop the BMW before entering");
      return;
    }

    clearRemoteInput();
    const door = getCarWorldPoint(
      carRef.current,
      DRIVER_DOOR_OFFSET,
      interactionPointRef.current,
    );
    characterRef.current.position.copy(door);
    characterRef.current.rotation.y = carRef.current.rotation.y + Math.PI / 2;

    transitionStartRef.current = performance.now();
    setEmoteActive(false);
    setCharAnimation("enterCar");
    setPlayerMode("entering");
    setInteractionMessage("Opening door & entering BMW M4...");

    if (transitionTimerRef.current)
      window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(
      () => finishTransition("entering"),
      TRANSITION_DURATION_MS,
    );
  }, [playerMode, nearCar, speedKmh, clearRemoteInput, finishTransition]);

  const exitVehicle = useCallback(() => {
    if (playerMode !== "driving" || !carRef.current || !characterRef.current)
      return;
    if (speedKmh > MAX_ENTER_SPEED_KMH) {
      setInteractionMessage("Brake and stop before exiting");
      return;
    }

    clearRemoteInput();
    transitionStartRef.current = performance.now();
    setCharAnimation("exitCar");
    setPlayerMode("exiting");
    setInteractionMessage("Opening door & exiting BMW M4...");

    if (transitionTimerRef.current)
      window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(
      () => finishTransition("exiting"),
      TRANSITION_DURATION_MS,
    );
  }, [playerMode, speedKmh, clearRemoteInput, finishTransition]);

  const toggleVehicle = useCallback(() => {
    if (playerMode === "onFoot") enterVehicle();
    else if (playerMode === "driving") exitVehicle();
  }, [playerMode, enterVehicle, exitVehicle]);

  const playEmote = useCallback(
    (emoteId) => {
      if (
        playerMode !== "onFoot" ||
        emoteActive ||
        !EMOTES.some((item) => item.id === emoteId)
      )
        return;
      setCharAnimation(emoteId);
      setEmoteActive(true);
    },
    [playerMode, emoteActive],
  );

 const handleCharacterAnimationFinished = useCallback(
   (finishedAnimation) => {
     if (finishedAnimation === "enterCar") {
       finishTransition("entering");
       return;
     }

     if (finishedAnimation === "exitCar") {
       finishTransition("exiting");
       return;
     }

     setEmoteActive(false);
     setCharAnimation("idle");
   },
   [finishTransition],
 );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.repeat ||
        event.target?.tagName === "INPUT" ||
        event.target?.tagName === "TEXTAREA"
      )
        return;
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleVehicle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleVehicle]);

  // Immediately push mode changes to the phone so the Phone HUD switches with zero delay
  useEffect(() => {
    socketRef.current?.emit("game:telemetry", {
      speed: telemetry.speed,
      gear: telemetry.gear,
      rpm: telemetry.rpm,
      drifting: telemetry.drifting,
      boost: telemetry.boost,
      playerMode,
      nearCar,
    });
  }, [playerMode, nearCar, telemetry]);

  // Keep the interaction prompt and phone telemetry synced with driver-side door proximity
  // Keep the interaction prompt and phone telemetry synced every 100ms in ALL modes
  useEffect(() => {
    const interval = window.setInterval(() => {
      let canReach = false;

      if (playerMode === "onFoot" && carRef.current && characterRef.current) {
        const door = getCarWorldPoint(
          carRef.current,
          DRIVER_DOOR_OFFSET,
          interactionPointRef.current,
        );
        const distance = characterRef.current.position.distanceTo(door);
        canReach = distance <= INTERACTION_DISTANCE;
        setNearCar(canReach);
        setInteractionMessage(
          canReach
            ? speedKmh <= MAX_ENTER_SPEED_KMH
              ? "Press F or Tap ENTER to get in BMW M4"
              : "Stop the BMW to enter"
            : "",
        );
      } else {
        setNearCar(false);
        if (playerMode === "driving") {
          setInteractionMessage(
            speedKmh > MAX_ENTER_SPEED_KMH ? "Brake and stop to exit" : "",
          );
        }
      }

      socketRef.current?.emit("game:telemetry", {
        speed: telemetry.speed,
        gear: telemetry.gear,
        rpm: telemetry.rpm,
        drifting: telemetry.drifting,
        boost: telemetry.boost,
        playerMode,
        nearCar: canReach,
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [playerMode, speedKmh, telemetry]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current)
        window.clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const socket = io(getSocketUrl(), { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.on("controller:input", (data) => {
      setPhoneLinked(true);
      remoteInputRef.current.accelerate = Boolean(data.accelerate);
      remoteInputRef.current.brake = Boolean(data.brake);
      remoteInputRef.current.handbrake = Boolean(data.handbrake);
      remoteInputRef.current.boost = Boolean(data.boost);
      remoteInputRef.current.jump = Boolean(data.jump);
      remoteInputRef.current.crouch = Boolean(data.crouch);
      remoteInputRef.current.sprint = Boolean(data.sprint);
      remoteInputRef.current.autoRun = Boolean(data.autoRun);
      remoteInputRef.current.steer = Number(data.steer) || 0;
      remoteInputRef.current.moveX = Number(data.moveX) || 0;
      remoteInputRef.current.moveY = Number(data.moveY) || 0;
      remoteInputRef.current.lookX = Number(data.lookX) || 0;
      remoteInputRef.current.lookY = Number(data.lookY) || 0;
      if (data.lookDeltaX) {
        remoteInputRef.current.lookDeltaX += Number(data.lookDeltaX) || 0;
      }
      if (data.lookDeltaY) {
        remoteInputRef.current.lookDeltaY += Number(data.lookDeltaY) || 0;
      }
    });
    socket.on("controller:action", (action) => {
      if (action === "camera") cycleCamera();
      if (action === "reset") remoteInputRef.current.reset = true;
      if (action === "toggleVehicle") toggleVehicle();
      if (typeof action === "string" && action.startsWith("emote:")) {
        playEmote(action.split(":")[1]);
      }
    });
    socket.on("controller:settings", (settings) => {
      if (settings.steerHudSide) setSteerHudSide(settings.steerHudSide);
      if (settings.scenePreset) setScenePreset(settings.scenePreset);
    });
    socket.on("controller:disconnected", () => setPhoneLinked(false));
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [cycleCamera, toggleVehicle, playEmote]);

  const handleCollision = useCallback((impactSpeed) => {
    const intensity = Math.max(0, Math.min(1, impactSpeed / 28));
    if (intensity < 0.08) return;
    const pulse = Math.round(18 + intensity * 105);
    const pause = Math.round(18 + (1 - intensity) * 28);
    socketRef.current?.emit("game:haptic", [
      pulse,
      pause,
      Math.round(pulse * 0.55),
    ]);
  }, []);

  const handleTelemetryChange = useCallback(
    (nextTelemetry) => {
      setTelemetry(nextTelemetry);
      socketRef.current?.emit("game:telemetry", {
        speed: nextTelemetry.speed,
        gear: nextTelemetry.gear,
        rpm: nextTelemetry.rpm,
        drifting: nextTelemetry.drifting,
        boost: nextTelemetry.boost,
        playerMode,
        nearCar,
      });
    },
    [playerMode, nearCar],
  );

  const handleWheelsReady = useCallback((rigData) => {
    wheelAssembliesRef.current = rigData;
  }, []);
  const handleModelError = useCallback((error) => {
    console.error("Model loading failed:", error);
    setModelError(
      "Could not load one or more 3D model assets. Check the model files and console.",
    );
  }, []);

  const currentSteer = telemetry.steerInput || 0;
  const networkUrl = getNetworkControllerUrl();
  const copyNetworkUrl = useCallback(() => {
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard
      .writeText(networkUrl)
      .catch((error) => console.error("Unable to copy controller URL:", error));
  }, [networkUrl]);

  return (
    <main className="game-shell">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[-7.4, 2.5, 0]}
          fov={44}
          near={0.1}
          far={320}
        />
        <Suspense fallback={null}>
          <OpenWorldMap collidersRef={collidersRef} />
        </Suspense>
        <DrivingWorld presetKey={scenePreset} />
        <Suspense fallback={null}>
          <BMWM4
            ref={carRef}
            doorOpen={doorOpen}
            onWheelsReady={handleWheelsReady}
            onError={handleModelError}
          />
          <CharacterModel
            ref={characterRef}
            animation={playerMode === "driving" ? "drivingSeat" : charAnimation}
            visible={true}
            steerValue={currentSteer}
            onAnimationFinished={handleCharacterAnimationFinished}
          />
        </Suspense>
        <VehicleOccupantSync
          carRef={carRef}
          characterRef={characterRef}
          playerMode={playerMode}
          transitionStartRef={transitionStartRef}
        />
        <CarController
          carRef={carRef}
          wheelAssembliesRef={wheelAssembliesRef}
          collidersRef={collidersRef}
          enabled={playerMode === "driving"}
          onTelemetryChange={handleTelemetryChange}
          onCollision={handleCollision}
          physicsStateRef={physicsStateRef}
          remoteInputRef={remoteInputRef}
        />
        <CharacterController
          characterRef={characterRef}
          carRef={carRef}
          collidersRef={collidersRef}
          enabled={playerMode === "onFoot"}
          emoteActive={emoteActive}
          cameraYawRef={cameraYawRef}
          remoteInputRef={remoteInputRef}
          onAnimationChange={setCharAnimation}
          onEmote={(key) => {
            const emote = EMOTES.find((item) => item.key === key);
            if (emote) playEmote(emote.id);
          }}
        />

        <FollowCamera
          targetRef={isCharacterMode ? characterRef : carRef}
          physicsStateRef={physicsStateRef}
          remoteInputRef={remoteInputRef}
          cameraMode={cameraMode}
          isCharacterMode={isCharacterMode}
          orbitYawRef={cameraYawRef}
        />
      </Canvas>

      <div className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">M</span>
          <div>
            <div className="eyebrow">BMW M PERFORMANCE</div>
            <div className="brand-title">
              {isCharacterMode ? "OPEN WORLD CHARACTER" : "M4 COMPETITION"}
            </div>
          </div>
        </div>
        <div className="mc-icon-toolbar">
          {playerMode === "onFoot" ? (
            <button
              type="button"
              className="mc-icon-btn mc-action-pill"
              onClick={enterVehicle}
              disabled={!nearCar || speedKmh > MAX_ENTER_SPEED_KMH}
              title="Enter BMW M4 (F)"
            >
              ENTER CAR
            </button>
          ) : playerMode === "driving" ? (
            <button
              type="button"
              className="mc-icon-btn mc-action-pill"
              onClick={exitVehicle}
              disabled={speedKmh > MAX_ENTER_SPEED_KMH}
              title="Exit BMW M4 (F)"
            >
              EXIT CAR
            </button>
          ) : (
            <button
              type="button"
              className="mc-icon-btn mc-action-pill"
              disabled
            >
              {playerMode === "entering" ? "ENTERING..." : "EXITING..."}
            </button>
          )}
          <button
            type="button"
            className="mc-icon-btn"
            onClick={() => setQrModalOpen(true)}
            title="Show Phone QR Code"
          >
            <Icons.QRCode />
          </button>
          <button
            type="button"
            className="mc-icon-btn"
            onClick={cycleCamera}
            title="Switch Camera"
          >
            <Icons.Camera />
          </button>
          <button
            type="button"
            className="mc-icon-btn"
            onClick={() => {
              remoteInputRef.current.reset = true;
            }}
            title="Reset Vehicle"
          >
            <Icons.Reset />
          </button>
          <button
            type="button"
            className="mc-icon-btn mc-settings-trigger"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
          >
            <Icons.Settings />
          </button>
        </div>
      </div>

      {playerMode === "driving" && (
        <>
          <section className={`steering-hud-pod side-${steerHudSide}`}>
            <div className="steering-hud-header">
              <span className="steering-angle-readout">
                {Math.round(-currentSteer * MAX_WHEEL_ROTATION_DEG)}°
              </span>
            </div>
            <div className="steering-wheel-ring-wrap">
              <SteeringWheelGraphic
                steerValue={currentSteer}
                activeGrab={false}
              />
            </div>
          </section>
          <div
            className={`drive-hud sport-hud side-${steerHudSide === "left" ? "right" : "left"}`}
          >
            <SportSpeedometer telemetry={telemetry} />
            <div className="telemetry-badges">
              {telemetry.drifting && (
                <div className="badge drift-badge">
                  DRIFT {telemetry.driftAngle}°
                </div>
              )}
              {telemetry.boost && (
                <div className="badge boost-badge">M-BOOST</div>
              )}
            </div>
          </div>
        </>
      )}

      {playerMode === "onFoot" && (
        <section className="character-action-panel">
          <div className="character-panel-heading">CHARACTER ACTIONS</div>
          <div className="character-emote-grid">
            {EMOTES.map((emote) => (
              <button
                key={emote.id}
                type="button"
                className="character-emote-btn"
                disabled={emoteActive}
                onClick={() => playEmote(emote.id)}
              >
                <span className="emote-key">{emote.key}</span>
                {emote.label}
              </button>
            ))}
          </div>
          <div className="character-control-hint">
            WASD / PHONE JOYSTICK MOVE · SWIPE PHONE / DRAG MOUSE TO TURN ·
            SHIFT SPRINT · SPACE JUMP · F ENTER CAR
          </div>
        </section>
      )}

      {(interactionMessage || isTransitioning) && (
        <div
          className="vehicle-interaction-prompt"
          style={{
            pointerEvents: nearCar ? "auto" : "none",
            cursor: nearCar ? "pointer" : "default",
          }}
          onClick={nearCar ? toggleVehicle : undefined}
        >
          {interactionMessage || "Please wait..."}
        </div>
      )}

      <QrConnectModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        networkUrl={networkUrl}
        onCopyUrl={copyNetworkUrl}
      />
      <GameSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        steerHudSide={steerHudSide}
        onSteerHudSideChange={setSteerHudSide}
        scenePreset={scenePreset}
        onScenePresetChange={setScenePreset}
      />
      {modelError && <div className="error-banner">{modelError}</div>}
      <div className="corner-status">
        <span
          className={phoneLinked ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"}
        />
        {playerMode === "driving"
          ? `DRIVING M4 · ${Math.round(speedKmh)} KM/H`
          : playerMode === "onFoot"
            ? "ON FOOT · EXPLORE THE WORLD"
            : playerMode.toUpperCase()}
      </div>
      <Loader containerStyles={{ background: "rgba(9,13,20,.92)" }} />
    </main>
  );
}
```

===============================================================================
FILE: components/UI/GameModals.jsx
===============================================================================

```jsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { SCENE_PRESETS } from "../../config/gameConstants";
import Icons from "./Icons";

export function QrConnectModal({ open, onClose, networkUrl, onCopyUrl }) {
  if (!open) return null;

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-qr-card" onClick={(e) => e.stopPropagation()}>
        <div className="mc-settings-header">
          <div className="mc-settings-title">
            <Icons.QRCode />
            <span>SCAN TO CONNECT PHONE</span>
          </div>
          <button type="button" className="mc-icon-btn" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
        <p className="mc-qr-instruction">
          Scan this QR code with your phone camera on the same Wi-Fi network:
        </p>
        <div className="mc-qr-frame">
          <QRCodeSVG
            value={networkUrl}
            size={220}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#080d16"
          />
        </div>
        <div className="mc-qr-url">{networkUrl}</div>
        <button
          type="button"
          className="mc-enable-gyro-action-btn mc-copy-url-btn"
          onClick={onCopyUrl}
        >
          COPY CONTROLLER LINK
        </button>
        <div className="mc-qr-network-info">
          <span className="mc-dot mc-dot-live" />
          MAKE SURE BOTH DEVICES USE THE SAME WI-FI
        </div>
      </div>
    </div>
  );
}

export function GameSettingsModal({
  open,
  onClose,
  steerHudSide,
  onSteerHudSideChange,
  scenePreset,
  onScenePresetChange,
}) {
  if (!open) return null;

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-settings-card" onClick={(e) => e.stopPropagation()}>
        <div className="mc-settings-header">
          <div className="mc-settings-title">
            <Icons.Settings />
            <span>GAME & HUD SETTINGS</span>
          </div>
          <button type="button" className="mc-icon-btn" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>

        <div className="mc-setting-group">
          <div className="mc-setting-label">STEERING HUD POSITION</div>
          <div className="mc-segmented">
            <button
              type="button"
              className={
                steerHudSide === "left" ? "mc-seg-btn active" : "mc-seg-btn"
              }
              onClick={() => onSteerHudSideChange("left")}
            >
              <span>LEFT SIDE</span>
            </button>
            <button
              type="button"
              className={
                steerHudSide === "right" ? "mc-seg-btn active" : "mc-seg-btn"
              }
              onClick={() => onSteerHudSideChange("right")}
            >
              <span>RIGHT SIDE</span>
            </button>
          </div>
        </div>

        <div className="mc-setting-group">
          <div className="mc-setting-label">ENVIRONMENT LIGHTING</div>
          <div className="mc-segmented">
            {Object.entries(SCENE_PRESETS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                className={
                  scenePreset === key ? "mc-seg-btn active" : "mc-seg-btn"
                }
                onClick={() => onScenePresetChange(key)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

===============================================================================
FILE: components/UI/HoldButton.jsx
===============================================================================

```jsx
import React, { useCallback, useState } from "react";

export default function HoldButton({
  className,
  activeClassName,
  onChange,
  children,
}) {
  const [pressed, setPressed] = useState(false);

  const activate = useCallback(
    (e) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      setPressed((prev) => {
        if (!prev) {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(12);
          }
          onChange(true);
        }
        return true;
      });
    },
    [onChange],
  );

  const deactivate = useCallback(
    (e) => {
      if (e && e.cancelable) e.preventDefault();
      setPressed((prev) => {
        if (prev) onChange(false);
        return false;
      });
    },
    [onChange],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${className} ${pressed ? activeClassName : ""}`}
      onTouchStart={activate}
      onTouchEnd={deactivate}
      onTouchCancel={deactivate}
      onMouseDown={activate}
      onMouseUp={deactivate}
      onMouseLeave={deactivate}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
```

===============================================================================
FILE: components/UI/Icons.jsx
===============================================================================

```jsx
import React from "react";

export const Icons = {
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Reset: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  Fullscreen: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  ),
  Boost: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Drift: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M9.5 15V9h3.5a2 2 0 0 1 0 4H9.5" />
      <path d="M4 6a11 11 0 0 0 0 12M20 6a11 11 0 0 1 0 12" />
    </svg>
  ),
  Gyro: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <path d="M6 12h.01M18 12h.01" />
      <path d="M9 3l3-2 3 2M9 21l3 2 3-2" />
    </svg>
  ),
  Wheel: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M3.5 11h6M14.5 11h6M12 14.5v6" />
    </svg>
  ),
  Close: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  BrakeDisc: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M16 5a9 9 0 0 1 4 7" strokeWidth="3" />
    </svg>
  ),
  GasPedal: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  QRCode: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 21h3" />
    </svg>
  ),
};

export default Icons;
```

===============================================================================
FILE: components/UI/SportSpeedometer.jsx
===============================================================================

```jsx
import React from "react";

export default function SportSpeedometer({ telemetry }) {
  const speed = Math.max(
    0,
    Math.min(320, Math.round(Math.abs(telemetry.speed || 0))),
  );
  const gear = telemetry.gear || "N";
  const rpmRatio = Math.max(0, Math.min(1, (telemetry.rpm || 850) / 7500));
  const needleAngle = -135 + (speed / 320) * 270;

  return (
    <section className="sport-speedometer" aria-label="Vehicle speedometer">
      <svg className="sport-speedometer-dial" viewBox="0 0 240 190" role="img">
        <defs>
          <linearGradient id="speedArc" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8edf2" stopOpacity=".42" />
            <stop offset="72%" stopColor="#e8edf2" stopOpacity=".82" />
            <stop offset="100%" stopColor="#ff315b" />
          </linearGradient>
          <filter id="needleGlow">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 33 }, (_, i) => {
          const angle = ((-135 + (i / 32) * 270) * Math.PI) / 180;
          const major = i % 4 === 0;
          const inner = major ? 75 : 81;
          const outer = 88;
          return (
            <line
              key={i}
              x1={120 + Math.cos(angle) * inner}
              y1={111 + Math.sin(angle) * inner}
              x2={120 + Math.cos(angle) * outer}
              y2={111 + Math.sin(angle) * outer}
              stroke={i > 27 ? "#ff315b" : "rgba(235,242,250,.65)"}
              strokeWidth={major ? 1.5 : 0.8}
            />
          );
        })}

        {Array.from({ length: 9 }, (_, i) => {
          const angle = ((-135 + (i / 8) * 270) * Math.PI) / 180;
          return (
            <text
              key={i}
              x={120 + Math.cos(angle) * 65}
              y={114 + Math.sin(angle) * 65}
              textAnchor="middle"
              className="speedometer-tick-label"
            >
              {i * 40}
            </text>
          );
        })}

        <g
          transform={`rotate(${needleAngle} 120 111)`}
          filter="url(#needleGlow)"
        >
          <path
            d="M120 111 L120 31"
            stroke="#f6f8fb"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <circle cx="120" cy="111" r="3.6" fill="#f6f8fb" />
        </g>

        <circle
          cx="120"
          cy="111"
          r="12.5"
          fill="#0b1d17"
          stroke="#38d889"
          strokeWidth="1.5"
        />
        <text x="120" y="116" textAnchor="middle" className="speedometer-gear">
          {gear}
        </text>
        <text
          x="120"
          y="165"
          textAnchor="middle"
          className="speedometer-number"
        >
          {speed}
        </text>
        <text x="120" y="179" textAnchor="middle" className="speedometer-unit">
          KM/H
        </text>
        <path
          d="M 166 35 A 90 90 0 0 1 208 105"
          fill="none"
          stroke="#ff315b"
          strokeWidth={2 + rpmRatio * 1.8}
          opacity={rpmRatio > 0.82 ? 1 : 0.45}
        />
      </svg>
      <div className="speedometer-rpm">
        <span>RPM</span>
        <span>{Math.round(telemetry.rpm || 850).toLocaleString("en-IN")}</span>
      </div>
    </section>
  );
}
```

===============================================================================
FILE: components/UI/SteeringWheelGraphic.jsx
===============================================================================

```jsx
import React from "react";
import { MAX_WHEEL_ROTATION_DEG } from "../../config/gameConstants";

export default function SteeringWheelGraphic({ steerValue, activeGrab }) {
  const deg = Math.round(-steerValue * MAX_WHEEL_ROTATION_DEG);
  return (
    <svg
      className={activeGrab ? "mc-wheel-svg grabbing" : "mc-wheel-svg"}
      viewBox="0 0 160 160"
      style={{ transform: `rotate(${deg}deg)` }}
    >
      <defs>
        <linearGradient id="mRimGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#35455d" />
          <stop offset="50%" stopColor="#18202c" />
          <stop offset="100%" stopColor="#0d1219" />
        </linearGradient>
        <linearGradient id="mSpokeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fb4d0" />
          <stop offset="100%" stopColor="#405066" />
        </linearGradient>
      </defs>

      <circle
        cx="80"
        cy="80"
        r="66"
        fill="none"
        stroke="url(#mRimGrad)"
        strokeWidth="16"
      />
      <circle
        cx="80"
        cy="80"
        r="66"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />
      <path
        d="M 20 55 A 66 66 0 0 1 28 38"
        fill="none"
        stroke="#2d79ff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 140 55 A 66 66 0 0 0 132 38"
        fill="none"
        stroke="#2d79ff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 22 78 L 58 78 M 102 78 L 138 78 M 80 98 L 80 138"
        stroke="url(#mSpokeGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M 74 14 L 86 14"
        stroke="#ff2a5f"
        strokeWidth="16"
        strokeLinecap="butt"
      />
      <circle
        cx="80"
        cy="14"
        r="5"
        fill="#ffffff"
        opacity={activeGrab ? "0.95" : "0.4"}
      />
      <circle
        cx="80"
        cy="80"
        r="24"
        fill="#0b1018"
        stroke="#2d79ff"
        strokeWidth="3"
      />
      <text
        x="80"
        y="86"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="16"
        fontWeight="800"
        fontStyle="italic"
        fontFamily="Barlow Condensed, sans-serif"
      >
        M
      </text>
    </svg>
  );
}
```

===============================================================================
FILE: components/World/DrivingWorld.jsx
===============================================================================

```jsx
import React from "react";
import { SCENE_PRESETS } from "../../config/gameConstants";

export default function DrivingWorld({ presetKey }) {
  const preset = SCENE_PRESETS[presetKey] || SCENE_PRESETS.track;
  return (
    <>
      <color attach="background" args={[preset.bg]} />
      <fog attach="fog" args={preset.fog} />
      <ambientLight intensity={preset.ambient} />
      <hemisphereLight args={[preset.hemiSky, preset.hemiGround, 1.15]} />
      <directionalLight
        position={[14, 22, 16]}
        intensity={preset.dirIntensity}
        color={preset.dirColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
}
```

===============================================================================
FILE: components/World/FollowCamera.jsx
===============================================================================

```jsx
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { CAMERA_MODES } from "../../config/gameConstants";

const MOUSE_SENSITIVITY = 0.0028;
const REMOTE_LOOK_SPEED = 2.4;

const MIN_PITCH = -0.35;
const MAX_PITCH = 0.9;

const ORBIT_DAMP = 14;

const CHARACTER_CAMERA_DISTANCE = 4.6;
const CHARACTER_CAMERA_HEIGHT = 1.45;

export default function FollowCamera({
  targetRef,
  carRef,
  physicsStateRef,
  remoteInputRef,
  cameraMode,
  isCharacterMode,
  orbitYawRef,
  orbitPitchRef,
}) {
  const { camera, gl } = useThree();

  const desiredPosition = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const previousMode = useRef(null);

  const activeTargetRef = targetRef || carRef;

  const camPreset =
    CAMERA_MODES.find((item) => item.id === cameraMode) || CAMERA_MODES[0];

  const yaw = useRef(0);
  const pitch = useRef(0.16);

  const yawTarget = useRef(0);
  const pitchTarget = useRef(0.16);

  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const pointerLocked = useRef(false);

  useEffect(() => {
    if (!isCharacterMode) {
      dragging.current = false;
      return undefined;
    }

    const element = gl.domElement;

    const onPointerDown = (event) => {
      if (pointerLocked.current) return;
      if (event.button !== 0) return;

      dragging.current = true;
      lastX.current = event.clientX;
      lastY.current = event.clientY;
      element.setPointerCapture?.(event.pointerId);
    };

    const onPointerUp = (event) => {
      dragging.current = false;
      if (element.hasPointerCapture?.(event.pointerId)) {
        element.releasePointerCapture?.(event.pointerId);
      }
    };

    const onPointerMove = (event) => {
      let deltaX = 0;
      let deltaY = 0;

      if (pointerLocked.current) {
        deltaX = event.movementX;
        deltaY = event.movementY;
      } else {
        if (!dragging.current) return;
        deltaX = event.clientX - lastX.current;
        deltaY = event.clientY - lastY.current;
        lastX.current = event.clientX;
        lastY.current = event.clientY;
      }

      yawTarget.current -= deltaX * MOUSE_SENSITIVITY;
      pitchTarget.current = THREE.MathUtils.clamp(
        pitchTarget.current + deltaY * MOUSE_SENSITIVITY,
        MIN_PITCH,
        MAX_PITCH,
      );
    };

    const onDoubleClick = () => {
      if (!pointerLocked.current && element.requestPointerLock) {
        element.requestPointerLock();
      }
    };

    const onPointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === element;
      if (pointerLocked.current) {
        dragging.current = false;
      }
    };

    const onWheel = (event) => {
      event.preventDefault();
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("dblclick", onDoubleClick);
    element.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("pointerlockchange", onPointerLockChange);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("dblclick", onDoubleClick);
      element.removeEventListener("wheel", onWheel);
      document.removeEventListener("pointerlockchange", onPointerLockChange);

      if (pointerLocked.current && document.exitPointerLock) {
        document.exitPointerLock();
      }

      pointerLocked.current = false;
      dragging.current = false;
    };
  }, [gl, isCharacterMode]);

  useEffect(() => {
    previousMode.current = null;
  }, [isCharacterMode]);

  useFrame((_, rawDelta) => {
    const target = activeTargetRef?.current;
    if (!target) return;

    const dt = Math.min(rawDelta, 0.05);
    const modeKey = isCharacterMode ? "character" : `car-${cameraMode}`;

    if (previousMode.current !== modeKey) {
      previousMode.current = modeKey;

      currentLook.current
        .copy(target.position)
        .add(new THREE.Vector3(0, isCharacterMode ? 1.3 : 0.9, 0));

      if (isCharacterMode) {
        const behindYaw = target.rotation.y + Math.PI;
        yaw.current = behindYaw;
        yawTarget.current = behindYaw;

        pitch.current = 0.18;
        pitchTarget.current = 0.18;
      }
    }

    if (isCharacterMode) {
      // Consume immediate horizontal swipe delta from phone trackpad
      if (remoteInputRef?.current) {
        const swipeDX = remoteInputRef.current.lookDeltaX || 0;
        const swipeDY = remoteInputRef.current.lookDeltaY || 0;
        if (swipeDX !== 0 || swipeDY !== 0) {
          yawTarget.current -= swipeDX;
          pitchTarget.current = THREE.MathUtils.clamp(
            pitchTarget.current + swipeDY,
            MIN_PITCH,
            MAX_PITCH,
          );
          remoteInputRef.current.lookDeltaX = 0;
          remoteInputRef.current.lookDeltaY = 0;
        }
      }

      const remoteLookX = remoteInputRef?.current?.lookX || 0;
      const remoteLookY = remoteInputRef?.current?.lookY || 0;
      if (Math.abs(remoteLookX) > 0.04 || Math.abs(remoteLookY) > 0.04) {
        yawTarget.current -= remoteLookX * REMOTE_LOOK_SPEED * dt;
        pitchTarget.current = THREE.MathUtils.clamp(
          pitchTarget.current - remoteLookY * REMOTE_LOOK_SPEED * 0.7 * dt,
          MIN_PITCH,
          MAX_PITCH,
        );
      }

      const yawAlpha = 1 - Math.exp(-ORBIT_DAMP * dt);
      yaw.current += (yawTarget.current - yaw.current) * yawAlpha;
      pitch.current += (pitchTarget.current - pitch.current) * yawAlpha;

      if (orbitYawRef) orbitYawRef.current = yaw.current;
      if (orbitPitchRef) orbitPitchRef.current = pitch.current;

      const distance = CHARACTER_CAMERA_DISTANCE;
      const horizontal = Math.cos(pitch.current) * distance;
      const vertical = Math.sin(pitch.current) * distance;

      const cameraX = target.position.x + Math.sin(yaw.current) * horizontal;
      const cameraZ = target.position.z + Math.cos(yaw.current) * horizontal;
      const cameraY = target.position.y + CHARACTER_CAMERA_HEIGHT + vertical;

      desiredPosition.current.set(cameraX, cameraY, cameraZ);
      camera.position.lerp(desiredPosition.current, 1 - Math.exp(-12 * dt));

      lookTarget.current
        .copy(target.position)
        .add(new THREE.Vector3(0, 1.35, 0));

      currentLook.current.lerp(lookTarget.current, 1 - Math.exp(-16 * dt));
      camera.lookAt(currentLook.current);
      return;
    }

    const phys = physicsStateRef?.current || {
      vx: 0,
      vy: 0,
      steering: 0,
      boost: false,
    };

    const carYaw = target.rotation.y;

    if (cameraMode === "hood") {
      const offset = new THREE.Vector3(...camPreset.offset).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        carYaw,
      );

      camera.position.copy(target.position).add(offset);

      const look = new THREE.Vector3(
        12,
        camPreset.lookY,
        -phys.steering * 3,
      ).applyAxisAngle(new THREE.Vector3(0, 1, 0), carYaw);

      lookTarget.current.copy(target.position).add(look);
      camera.lookAt(lookTarget.current);
      return;
    }

    const driftSwing = THREE.MathUtils.clamp(phys.vy * 0.14, -1.6, 1.6);
    const speedPullback = THREE.MathUtils.clamp(
      Math.abs(phys.vx) * 0.035,
      0,
      1.4,
    );

    const offset = new THREE.Vector3(
      camPreset.offset[0] - speedPullback,
      camPreset.offset[1],
      camPreset.offset[2] + driftSwing,
    ).applyAxisAngle(new THREE.Vector3(0, 1, 0), carYaw);

    desiredPosition.current.copy(target.position).add(offset);
    camera.position.lerp(desiredPosition.current, 1 - Math.exp(-6.5 * dt));

    const lookAhead = new THREE.Vector3(
      2.2,
      camPreset.lookY,
      -phys.steering * 1.1,
    ).applyAxisAngle(new THREE.Vector3(0, 1, 0), carYaw);

    lookTarget.current.copy(target.position).add(lookAhead);
    currentLook.current.lerp(lookTarget.current, 1 - Math.exp(-10 * dt));
    camera.lookAt(currentLook.current);
  });

  return null;
}
```

===============================================================================
FILE: components/World/OpenWorldMap.js
===============================================================================

```js
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshBVH, CENTER, acceleratedRaycast } from "three-mesh-bvh";
import mapUrl from "../../assets/models/gt_racing_2_-_mount_rainier.glb";

const SKY_NAME = /sky|cloud|dome|horizon|atmos/i;

// Sky domes are usually huge BackSide spheres. They must never be collidable.
function isSkyLike(mesh) {
  for (let node = mesh; node; node = node.parent) {
    if (SKY_NAME.test(node.name)) return true;
  }
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.some((m) => m && m.side === THREE.BackSide);
}

/**
 * GT Racing 2 - Cote d'Azur map from Sketchfab.
 * The map uses Y as its vertical axis, so it is not rotated.
 * Its X/Z center is shifted to the world origin while authored elevations
 * are preserved.
 *
 * Every mesh also gets a BVH so the car can raycast against the map cheaply.
 * Meshes are registered in `collidersRef` in small time slices so entering
 * Drive mode doesn't freeze the page.
 */
export default function OpenWorldMap({ collidersRef }) {
  const { scene } = useGLTF(mapUrl);
  const groupRef = useRef(null);

  const mapData = useMemo(() => {
    const mapScene = scene.clone(true);
    mapScene.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(mapScene);
    const center = bounds.getCenter(new THREE.Vector3());

    mapScene.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;
    });

    console.info("[OpenWorldMap] Loaded map", {
      meshCount: (() => {
        let count = 0;
        mapScene.traverse((object) => {
          if (object.isMesh) count += 1;
        });
        return count;
      })(),
      size: bounds.getSize(new THREE.Vector3()).toArray(),
      center: center.toArray(),
    });

    return {
      scene: mapScene,
      position: [-center.x, 0, -center.z],
    };
  }, [scene]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group || !collidersRef) return undefined;

    // Include the group's offset in every world matrix / box below.
    group.updateWorldMatrix(true, true);

    const meshes = [];
    group.traverse((object) => {
      if (object.isMesh && !object.isInstancedMesh && !object.isSkinnedMesh) {
        meshes.push(object);
      }
    });

    const colliders = [];
    collidersRef.current = colliders;

    let index = 0;
    let timer = 0;
    let cancelled = false;

    const buildSlice = () => {
      if (cancelled) return;
      const start = performance.now();

      while (index < meshes.length && performance.now() - start < 12) {
        const mesh = meshes[index++];

        if (isSkyLike(mesh)) {
          console.info("[OpenWorldMap] Skipping sky-like mesh:", mesh.name);
          continue;
        }

        try {
          const geometry = mesh.geometry;
          if (!geometry.boundsTree) {
            geometry.boundsTree = new MeshBVH(geometry, { strategy: CENTER });
          }
          mesh.raycast = acceleratedRaycast;
          colliders.push({ mesh, box: new THREE.Box3().setFromObject(mesh) });
        } catch (error) {
          console.warn(
            "[OpenWorldMap] Collision skipped for",
            mesh.name,
            error,
          );
        }
      }

      if (index < meshes.length) {
        timer = window.setTimeout(buildSlice, 0);
      } else {
        colliders.ready = true;
        console.info(
          `[OpenWorldMap] Collision ready: ${colliders.length} meshes`,
        );
        // Diagnostic: the highest collidable meshes. If the car still spawns
        // too high, one of these is the culprit.
        console.table(
          [...colliders]
            .sort((a, b) => b.box.max.y - a.box.max.y)
            .slice(0, 8)
            .map(({ mesh, box }) => ({
              name: mesh.name,
              minY: +box.min.y.toFixed(1),
              maxY: +box.max.y.toFixed(1),
            })),
        );
      }
    };

    buildSlice();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      collidersRef.current = [];
    };
  }, [mapData, collidersRef]);

  return (
    <group ref={groupRef} position={mapData.position}>
      <primitive object={mapData.scene} />
    </group>
  );
}

useGLTF.preload(mapUrl);
```

===============================================================================
FILE: config/gameConstants.js
===============================================================================

```js
export const SCENE_PRESETS = {
  track: {
    label: "Proving Ground",
    bg: "#0b111b",
    fog: ["#0b111b", 28, 165],
    ambient: 0.85,
    hemiSky: "#dceaff",
    hemiGround: "#182232",
    dirIntensity: 3.4,
    dirColor: "#fff6e8",
    accentColor: "#2d79ff",
    groundColor: "#10161f",
    gridCell: "#1d2a3d",
    gridSection: "#2c4870",
  },
  night: {
    label: "Night Circuit",
    bg: "#04060b",
    fog: ["#04060b", 20, 135],
    ambient: 0.42,
    hemiSky: "#5a9cff",
    hemiGround: "#080b12",
    dirIntensity: 1.9,
    dirColor: "#8ab8ff",
    accentColor: "#ff2a5f",
    groundColor: "#090d14",
    gridCell: "#141d2e",
    gridSection: "#00d2ff",
  },
  studio: {
    label: "M Studio",
    bg: "#090d14",
    fog: ["#090d14", 24, 120],
    ambient: 0.7,
    hemiSky: "#dceaff",
    hemiGround: "#18202b",
    dirIntensity: 3.1,
    dirColor: "#ffffff",
    accentColor: "#2d79ff",
    groundColor: "#111821",
    gridCell: "#192330",
    gridSection: "#2b3e57",
  },
};

export const CAMERA_MODES = [
  {
    id: "chase",
    label: "Chase Cam",
    offset: [-7.4, 2.5, 0],
    lookY: 0.95,
    fov: 44,
  },
  {
    id: "dynamic",
    label: "Action Cam",
    offset: [-5.8, 1.95, 0],
    lookY: 0.85,
    fov: 50,
  },
  {
    id: "hood",
    label: "Hood Cam",
    offset: [0.35, 1.36, 0],
    lookY: 1.15,
    fov: 58,
  },
];

export const MAX_TILT_DEG = 26;
export const TILT_DEADZONE_DEG = 1.0;
export const MAX_WHEEL_ROTATION_DEG = 135;

export const INITIAL_TELEMETRY = {
  speed: 0,
  rpm: 850,
  gear: "N",
  drifting: false,
  driftAngle: 0,
  boost: false,
  steerInput: 0,
};
```

===============================================================================
FILE: index.css
===============================================================================

```css
@import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,500;0,600;0,700;0,800;1,800&family=Inter:wght@400;500;600;700;800&display=swap");

:root {
  color-scheme: dark;
  font-family: "Inter", sans-serif;
  background: #06090f;
  color: #f4f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #06090f;
  touch-action: none;
  overscroll-behavior: none;
}

button {
  font: inherit;
  color: inherit;
}

/* ================================================================== */
/*  ICONS, MODALS & QR CARD                                           */
/* ================================================================== */

.mc-icon-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
}

.mc-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(14, 21, 33, 0.82);
  backdrop-filter: blur(14px);
  color: #dce6f2;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.14s ease, background 0.14s ease, border-color 0.14s ease;
}

.mc-icon-btn svg {
  width: 19px;
  height: 19px;
}

.mc-icon-btn:active,
.mc-icon-btn:hover {
  transform: scale(0.92);
  border-color: #2d79ff;
  background: rgba(45, 121, 255, 0.3);
  color: #ffffff;
}

.mc-settings-trigger {
  border-color: rgba(45, 121, 255, 0.5);
  background: linear-gradient(135deg, rgba(23, 105, 210, 0.4), rgba(14, 21, 33, 0.9));
}

.mc-modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 60;
  background: rgba(4, 7, 13, 0.82);
  backdrop-filter: blur(14px);
  display: grid;
  place-items: center;
  padding: 16px;
}

.mc-settings-card,
.mc-qr-card {
  width: min(480px, 94%);
  padding: 18px 20px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(180deg, #121b2b 0%, #090e17 100%);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mc-qr-card {
  width: min(340px, 90%);
  align-items: center;
  text-align: center;
}

.mc-settings-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mc-settings-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.mc-settings-title svg {
  width: 21px;
  height: 21px;
  color: #2d79ff;
}

.mc-qr-instruction {
  font-size: 11px;
  color: #8fa2b8;
  line-height: 1.5;
  margin: 0;
}

.mc-qr-frame {
  padding: 12px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
}

.mc-qr-url {
  font-family: monospace;
  font-size: 11px;
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  width: 100%;
  word-break: break-all;
}

.mc-setting-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.mc-setting-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
  color: #8294aa;
}

.mc-segmented {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.mc-seg-btn {
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #9fb0c4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.7px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mc-seg-btn svg {
  width: 16px;
  height: 16px;
}

.mc-seg-btn.active {
  border-color: #00d2ff;
  background: linear-gradient(135deg, #1769d2 0%, #0c4391 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(23, 105, 210, 0.45);
}

/* ================================================================== */
/*  PHONE CONTROLLER COCKPIT                                          */
/* ================================================================== */

.mc-viewport {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 14px 12px;
  background:
    radial-gradient(circle at 50% 40%, rgba(23, 105, 210, 0.15) 0%, transparent 65%),
    linear-gradient(180deg, #0b111c 0%, #05080d 100%);
  overflow: hidden;
  touch-action: none;
}

.mc-viewport.mc-force-landscape {
  width: 100vh;
  height: 100vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
}

.mc-rpm-strip {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 5px;
  width: min(460px, 70%);
  margin: 0 auto 4px;
}

.mc-shift-led {
  height: 4px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
}

.mc-shift-led.on.green {
  background: #32d74b;
  box-shadow: 0 0 8px #32d74b;
}

.mc-shift-led.on.blue {
  background: #00d2ff;
  box-shadow: 0 0 8px #00d2ff;
}

.mc-shift-led.on.red {
  background: #ff2a5f;
  box-shadow: 0 0 10px #ff2a5f;
}

.mc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.mc-brand-status {
  display: flex;
  align-items: center;
  gap: 9px;
}

.mc-m-badge {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: linear-gradient(135deg, #1769d2 0%, #0d1522 65%, #ff2a5f 100%);
  display: grid;
  place-items: center;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 21px;
  font-weight: 800;
  font-style: italic;
}

.mc-conn-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mc-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.mc-dot-live {
  background: #32d74b;
  box-shadow: 0 0 8px #32d74b;
}

.mc-dot-wait {
  background: #ff9f0a;
  box-shadow: 0 0 8px #ff9f0a;
}

.mc-conn-text {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #dce6f2;
}

.mc-sub-mode {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #6c809a;
  margin-top: 1px;
}

.mc-digital-cluster {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(11, 17, 27, 0.85);
}

.mc-speed-block,
.mc-gear-block {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.mc-speed-digits {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
  color: #ffffff;
}

.mc-speed-unit,
.mc-gear-label {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: #7c8fa8;
}

.mc-cluster-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.14);
}

.mc-gear-digit {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
  color: #00d2ff;
}

/* ================================================================== */
/*  GYRO MODE                                                         */
/* ================================================================== */

.mc-gyro-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1.15fr 1fr 1.15fr;
  gap: 14px;
  align-items: stretch;
  margin-top: 8px;
  min-height: 0;
}

.mc-gyro-side {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.mc-gyro-center-card {
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: radial-gradient(circle at 50% 45%, rgba(20, 32, 52, 0.72) 0%, rgba(8, 13, 21, 0.92) 100%);
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.mc-gyro-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #70e5ff;
}

.mc-gyro-badge svg {
  width: 18px;
  height: 18px;
}

.mc-enable-gyro-action-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #00d2ff;
  background: linear-gradient(135deg, #1769d2 0%, #0095d9 100%);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 0 16px rgba(0, 210, 255, 0.4);
}

.mc-gyro-perm-warning {
  font-size: 8px;
  color: #ff3b30;
  font-weight: 800;
  text-align: center;
}

.mc-gyro-horizon {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.mc-gyro-horizon-bar {
  width: 82%;
  height: 6px;
  border-radius: 99px;
  background: linear-gradient(90deg, #2d79ff, #00d2ff, #2d79ff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 18px rgba(0, 210, 255, 0.5);
  transition: transform 0.05s linear;
}

.mc-horizon-tip {
  width: 10px;
  height: 16px;
  border-radius: 4px;
  background: #ffffff;
}

.mc-horizon-center {
  width: 4px;
  height: 18px;
  background: #ff2a5f;
}

.mc-gyro-angle-val {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #dce6f2;
}

.mc-recenter-pill {
  width: 100%;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(0, 210, 255, 0.45);
  background: rgba(0, 210, 255, 0.15);
  color: #8beeff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  cursor: pointer;
}

/* ================================================================== */
/*  WHEEL MODE                                                        */
/* ================================================================== */

.mc-wheel-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 16px;
  align-items: stretch;
  margin-top: 8px;
  min-height: 0;
}

.mc-wheel-layout.wheel-on-right {
  grid-template-columns: 1.15fr 1fr;
}

.mc-wheel-layout.wheel-on-right .mc-rotary-wheel-zone {
  order: 2;
}

.mc-wheel-layout.wheel-on-right .mc-dual-pedals-zone {
  order: 1;
}

.mc-rotary-wheel-zone {
  border-radius: 22px;
  border: 1px solid rgba(45, 121, 255, 0.32);
  background: radial-gradient(circle at 50% 46%, rgba(23, 44, 78, 0.55) 0%, rgba(8, 13, 21, 0.92) 100%);
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  touch-action: none;
}

.mc-rotary-ring-guide {
  flex: 1;
  width: 100%;
  min-height: 0;
  display: grid;
  place-items: center;
  position: relative;
}

.mc-rotary-glow {
  position: absolute;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 1px dashed rgba(0, 210, 255, 0.28);
  background: radial-gradient(circle, rgba(45, 121, 255, 0.22) 0%, transparent 70%);
  pointer-events: none;
}

.mc-wheel-svg {
  width: min(200px, 52vh);
  height: min(200px, 52vh);
  max-width: 100%;
  max-height: 100%;
  filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.7));
  transition: transform 0.05s linear;
}

.mc-wheel-svg.grabbing {
  transition: none;
  filter: drop-shadow(0 0 18px rgba(0, 210, 255, 0.55));
}

.mc-rotary-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.mc-rotary-hint {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #7c90ab;
}

.mc-rotary-deg {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #00d2ff;
}

.mc-dual-pedals-zone {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.mc-aux-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mc-pedals-pair {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 12px;
  min-height: 0;
}

/* ================================================================== */
/*  AUX & PEDALS                                                      */
/* ================================================================== */

.mc-aux-btn {
  height: 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.12s ease, background 0.12s ease;
}

.mc-btn-icon {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
}

.mc-btn-icon svg {
  width: 100%;
  height: 100%;
}

.mc-aux-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.mc-drift-btn {
  border: 1.5px solid rgba(255, 159, 10, 0.55);
  background: linear-gradient(180deg, rgba(58, 34, 10, 0.88) 0%, rgba(28, 16, 6, 0.94) 100%);
  color: #ffbc57;
}

.mc-drift-btn.is-pressed {
  transform: scale(0.94);
  border-color: #ff9f0a;
  background: linear-gradient(180deg, #ff9f0a 0%, #d96b00 100%);
  color: #090d14;
  box-shadow: 0 0 24px rgba(255, 159, 10, 0.65);
}

.mc-boost-btn {
  border: 1.5px solid rgba(0, 210, 255, 0.55);
  background: linear-gradient(180deg, rgba(10, 42, 62, 0.88) 0%, rgba(6, 20, 32, 0.94) 100%);
  color: #70e5ff;
}

.mc-boost-btn.is-pressed {
  transform: scale(0.94);
  border-color: #00d2ff;
  background: linear-gradient(180deg, #00d2ff 0%, #0088cc 100%);
  color: #040911;
  box-shadow: 0 0 26px rgba(0, 210, 255, 0.7);
}

.mc-pedal {
  flex: 1;
  border-radius: 20px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.14s ease, border-color 0.14s ease;
}

.mc-pedal-treads {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 46%;
  margin-bottom: 4px;
  opacity: 0.35;
}

.mc-pedal-treads span {
  height: 3px;
  border-radius: 99px;
  background: currentColor;
}

.mc-pedal-icon {
  width: 26px;
  height: 26px;
}

.mc-pedal-icon svg {
  width: 100%;
  height: 100%;
}

.mc-pedal-title {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1;
}

.mc-pedal-sub {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.8px;
  opacity: 0.75;
}

.mc-brake-pedal {
  border: 2px solid rgba(255, 42, 95, 0.52);
  background: linear-gradient(180deg, rgba(64, 14, 28, 0.88) 0%, rgba(24, 7, 13, 0.96) 100%);
  color: #ff8da6;
}

.mc-brake-pedal.is-pressed {
  transform: perspective(300px) rotateX(9deg) scale(0.95);
  border-color: #ff2a5f;
  background: linear-gradient(180deg, #e01e4f 0%, #800c29 100%);
  color: #ffffff;
  box-shadow: 0 0 32px rgba(255, 42, 95, 0.65);
}

.mc-gas-pedal {
  border: 2px solid rgba(45, 121, 255, 0.58);
  background: linear-gradient(180deg, rgba(16, 42, 84, 0.88) 0%, rgba(8, 19, 38, 0.96) 100%);
  color: #99c2ff;
}

.mc-gas-pedal.is-pressed {
  transform: perspective(300px) rotateX(9deg) scale(0.95);
  border-color: #00d2ff;
  background: linear-gradient(180deg, #1769d2 0%, #0095d9 100%);
  color: #ffffff;
  box-shadow: 0 0 32px rgba(0, 210, 255, 0.65);
}

/* ================================================================== */
/*  LAPTOP VIEW STYLES                                                */
/* ================================================================== */

.game-shell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #090d14;
}

.game-shell canvas {
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
}

.topbar {
  position: absolute;
  z-index: 6;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 32px;
  pointer-events: none;
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
}

.brand-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  color: #fff;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 24px;
  font-weight: 800;
  font-style: italic;
}

.eyebrow,
.hud-label,
.corner-status {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
}

.eyebrow {
  color: #8b9aab;
  margin-bottom: 3px;
}

.brand-title {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1.2px;
}

.steering-hud-pod {
  position: absolute;
  z-index: 5;
  bottom: 52px;
  width: 185px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.steering-hud-pod.side-left {
  left: 34px;
}

.steering-hud-pod.side-right {
  right: 34px;
}

.steering-hud-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #8292a5;
}

.steering-angle-readout {
  color: #00d2ff;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 15px;
  font-weight: 800;
}

.steering-wheel-ring-wrap {
  width: 118px;
  height: 118px;
  display: grid;
  place-items: center;
}

.drive-hud {
  position: absolute;
  z-index: 5;
  bottom: 52px;
  width: 230px;
  padding: 18px;
  border-radius: 14px;
}

.drive-hud.side-right {
  right: 34px;
}

.drive-hud.side-left {
  left: 34px;
}

.hud-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.hud-label {
  color: #8292a5;
}

.speed-reading {
  margin-top: 4px;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 52px;
  font-weight: 700;
  line-height: 0.95;
}

.speed-reading span {
  margin-left: 5px;
  color: #93a2b4;
  font-family: "Inter", sans-serif;
  font-size: 9px;
  letter-spacing: 1px;
}

.gear-box {
  text-align: right;
}

.gear-reading {
  margin-top: 2px;
  color: #5ca7ff;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
}

.rpm-section {
  margin-top: 14px;
}

.rpm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.rpm-value {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #dce5ef;
}

.rpm-bar-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.rpm-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1769d2, #00d2ff);
  transition: width 0.06s linear;
}

.rpm-bar-fill.redline {
  background: linear-gradient(90deg, #ff7b00, #ff2a5f);
}

.telemetry-badges {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  min-height: 20px;
}

.badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.drift-badge {
  background: rgba(255, 42, 95, 0.22);
  border: 1px solid #ff2a5f;
  color: #ff8ca8;
}

.boost-badge {
  background: rgba(0, 210, 255, 0.2);
  border: 1px solid #00d2ff;
  color: #8beeff;
}

.corner-status {
  position: absolute;
  z-index: 5;
  left: 34px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8492a3;
  font-size: 9px;
}

.error-banner {
  position: absolute;
  z-index: 10;
  top: 85px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  border: 1px solid #a33c48;
  border-radius: 6px;
  color: #ffdce0;
  background: rgba(80, 17, 27, 0.9);
  font-size: 12px;
}


/* ==========================================
   GYRO PERMISSION MODAL
========================================== */
.mc-gyro-modal-backdrop {
  z-index: 100;
}

.mc-gyro-permission-card {
  width: min(390px, 94%);
  max-height: 90%;
  overflow-y: auto;
  padding: 28px 22px;
  border-radius: 22px;
  border: 1px solid rgba(0, 210, 255, 0.35);
  background: linear-gradient(160deg, #15243a, #080e18);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.mc-gyro-modal-icon {
  width: 64px;
  height: 64px;
  flex: 0 0 auto;
  border-radius: 18px;
  background: rgba(0, 210, 255, 0.12);
  border: 1px solid rgba(0, 210, 255, 0.4);
  display: grid;
  place-items: center;
  color: #00d2ff;
}

.mc-gyro-modal-icon svg { width: 34px; height: 34px; }
.mc-gyro-permission-card h2 {
  margin: 0;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 1.5px;
}
.mc-gyro-permission-card p {
  margin: 0;
  color: #9aacc2;
  font-size: 12px;
  line-height: 1.7;
}
.mc-gyro-instructions {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 11px;
  color: #dce6f2;
}
.mc-gyro-status {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #00d2ff;
}
.mc-gyro-modal-error {
  width: 100%;
  padding: 11px;
  border-radius: 9px;
  background: rgba(255, 59, 48, 0.12);
  border: 1px solid rgba(255, 59, 48, 0.3);
  color: #ff7770;
  font-size: 10px;
  line-height: 1.5;
}

/* ==========================================
   LOCAL QR QUICK CONNECT
========================================== */
.mc-qr-card { width: min(380px, 94%); }
.mc-qr-frame svg { display: block; max-width: 100%; height: auto; }
.mc-copy-url-btn { margin-top: 4px; }
.mc-qr-network-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #8fa2b8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-align: center;
}



/* Sport-style circular speedometer */
.drive-hud.sport-hud {
  width: 252px;
  min-height: 220px;
  padding: 8px 12px 10px;
  color:#fff;
  backdrop-filter: blur(1px);
}
.sport-speedometer {
  position: relative;
  width: 100%;
  max-width: 230px;
  margin: 0 auto;
}
.sport-speedometer-dial {
  display: block;
  width: 100%;
  overflow: visible;
}
.speedometer-tick-label {
  fill: rgba(221, 231, 241, .55);
  font: 6px "Inter", sans-serif;
}
.speedometer-gear {
  fill: #55e6a0;
  font: 800 11px "Barlow Condensed", sans-serif;
}
.speedometer-number {
  fill: #f5f7fa;
  font: italic 52px "Barlow Condensed", sans-serif;
  letter-spacing: -2px;
}
.speedometer-unit {
  fill: #9ba9b8;
  font: 700 7px "Inter", sans-serif;
  letter-spacing: 2px;
}
.speedometer-rpm {
  display: flex;
  justify-content: space-between;
  margin: -3px 22px 0;
  color: #93a2b4;
  font: 700 8px "Inter", sans-serif;
  letter-spacing: 1.2px;
}
.speedometer-rpm span:last-child {
  color: #e7edf4;
  font-size: 9px;
}
.sport-hud .telemetry-badges {
  justify-content: center;
  margin-top: 7px;
}

/* Phone controller jump button */
.mc-jump-floating {
  position: absolute;
  z-index: 20;
  right: 18px;
  top: 82px;
}
.mc-jump-btn {
  min-width: 76px;
  min-height: 58px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  border: 1px solid rgba(74, 211, 255, .65);
  border-radius: 12px;
  color: #eafaff;
  background: linear-gradient(145deg, rgba(20, 105, 145, .95), rgba(8, 45, 75, .96));
  box-shadow: 0 5px 18px rgba(0, 170, 255, .18), inset 0 1px rgba(255,255,255,.12);
  font: 900 10px "Inter", sans-serif;
  letter-spacing: 1.4px;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}
.mc-jump-btn:active {
  transform: translateY(2px) scale(.97);
  background: linear-gradient(145deg, #25b9ed, #0c668e);
  box-shadow: 0 0 20px rgba(38, 194, 255, .42);
}
.mc-jump-icon {
  font-size: 24px;
  line-height: 22px;
  font-weight: 900;
}
@media (max-width: 760px) {
  .drive-hud.sport-hud {
    width: 184px;
    min-height: 166px;
    padding: 5px 7px 7px;
    bottom: 12px;
  }
  .sport-speedometer { max-width: 170px; }
  .speedometer-number { font-size: 49px; }
  .speedometer-rpm { margin-left: 14px; margin-right: 14px; }
  .mc-jump-floating { right: 10px; top: 72px; }
  .mc-jump-btn { min-width: 62px; min-height: 50px; }
}

/* ================================================================== */
/*  GTA-STYLE ON-FOOT / VEHICLE INTERACTION                            */
/* ================================================================== */
.character-action-panel {
  position: absolute;
  z-index: 7;
  left: 50%;
  bottom: 26px;
  width: min(520px, calc(100vw - 32px));
  transform: translateX(-50%);
  padding: 14px 16px 12px;
  border: 1px solid rgba(180, 205, 235, 0.2);
  border-radius: 14px;
  background: rgba(7, 12, 20, 0.84);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(14px);
}

.character-panel-heading {
  margin-bottom: 10px;
  color: #9eb1c8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
}

.character-emote-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 7px;
}

.character-emote-btn {
  min-height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid rgba(150, 180, 215, 0.2);
  border-radius: 9px;
  background: rgba(28, 42, 60, 0.72);
  color: #edf4ff;
  font: inherit;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}

.character-emote-btn:hover:not(:disabled) {
  border-color: #4d9bff;
  background: rgba(37, 91, 155, 0.72);
  transform: translateY(-2px);
}

.character-emote-btn:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.emote-key {
  color: #70b5ff;
  font-size: 9px;
}

.character-control-hint {
  margin-top: 10px;
  color: #8191a5;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-align: center;
}

.vehicle-interaction-prompt {
  position: absolute;
  z-index: 8;
  left: 50%;
  bottom: 105px;
  transform: translateX(-50%);
  padding: 11px 18px;
  border: 1px solid rgba(120, 180, 255, 0.38);
  border-radius: 9px;
  background: rgba(5, 12, 22, 0.88);
  color: #f3f7ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.1px;
  text-align: center;
  pointer-events: none;
  backdrop-filter: blur(10px);
}

.mc-icon-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .character-action-panel {
    bottom: 12px;
    padding: 10px;
  }
  .character-emote-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .character-control-hint {
    line-height: 1.5;
  }
  .vehicle-interaction-prompt {
    bottom: 190px;
    width: max-content;
    max-width: calc(100vw - 32px);
  }
}
/* ================================================================== */
/*  VIRTUAL JOYSTICK & PHONE CHARACTER MODE                           */
/* ================================================================== */

.mc-action-pill {
  width: auto;
  padding: 0 12px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.onscreen-joystick-zone {
  position: absolute;
  z-index: 8;
  left: 34px;
  bottom: 34px;
  width: 146px;
  height: 158px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  touch-action: none;
  user-select: none;
}

.onscreen-joystick-ring {
  width: 126px;
  height: 126px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 210, 255, 0.42);
  background: radial-gradient(
    circle,
    rgba(23, 105, 210, 0.28) 0%,
    rgba(8, 14, 24, 0.78) 100%
  );
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.onscreen-joystick-SavedKnob {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #70e5ff;
  background: linear-gradient(135deg, #2d79ff 0%, #00d2ff 100%);
  box-shadow: 0 0 18px rgba(0, 210, 255, 0.65);
  pointer-events: none;
}

.onscreen-joystick-label {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #8fa5be;
}

.mc-character-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 12px;
  align-items: stretch;
  margin-top: 8px;
  min-height: 0;
}

.mc-joy-zone {
  border-radius: 20px;
  border: 1px solid rgba(45, 121, 255, 0.32);
  background: radial-gradient(
    circle at 50% 45%,
    rgba(23, 44, 78, 0.55) 0%,
    rgba(8, 13, 21, 0.92) 100%
  );
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  touch-action: none;
}

.mc-joy-ring {
  width: min(155px, 44vh);
  height: min(155px, 44vh);
  border-radius: 50%;
  border: 1.5px dashed rgba(0, 210, 255, 0.4);
  background: radial-gradient(
    circle,
    rgba(45, 121, 255, 0.22) 0%,
    rgba(6, 10, 18, 0.65) 75%
  );
  display: grid;
  place-items: center;
  margin: auto 0;
}

.mc-joy-ring.look-ring {
  border-color: rgba(255, 159, 10, 0.42);
}

.mc-joy-knob {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.65);
  background: linear-gradient(145deg, #1769d2, #0b2e59);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.mc-joy-knob.active {
  border-color: #00d2ff;
  background: linear-gradient(145deg, #00d2ff, #1769d2);
  box-shadow: 0 0 22px rgba(0, 210, 255, 0.75);
}

.mc-char-center-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.mc-char-primary-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mc-char-primary-grid .mc-aux-btn {
  height: 100%;
  min-height: 54px;
}

.mc-crouch-btn {
  border: 1.5px solid rgba(165, 185, 215, 0.45);
  background: rgba(25, 36, 52, 0.9);
  color: #dce6f2;
}

.mc-crouch-btn.is-pressed {
  transform: scale(0.95);
  border-color: #ffffff;
  background: #3a506b;
}

.mc-enter-car-btn {
  border: 1.5px solid rgba(50, 215, 75, 0.45);
  background: rgba(14, 48, 24, 0.85);
  color: #72f288;
}

.mc-enter-car-btn.ready {
  border-color: #32d74b;
  background: linear-gradient(180deg, #28b83e 0%, #136b21 100%);
  color: #ffffff;
  box-shadow: 0 0 20px rgba(50, 215, 75, 0.55);
}

.mc-char-emote-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.mc-mini-emote-btn {
  height: 36px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(18, 28, 44, 0.9);
  color: #b8cae0;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.mc-mini-emote-btn:active {
  background: #1769d2;
  color: #ffffff;
}

/* ================================================================== */
/*  AUTO-RUN BUTTON & HORIZONTAL SWIPE DIRECTION TRACKPAD             */
/* ================================================================== */

.mc-autorun-btn {
  width: 100%;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1.5px solid rgba(0, 210, 255, 0.45);
  background: linear-gradient(
    180deg,
    rgba(16, 38, 68, 0.9) 0%,
    rgba(8, 20, 38, 0.96) 100%
  );
  color: #dce6f2;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mc-autorun-btn.is-running {
  border-color: #32d74b;
  background: linear-gradient(135deg, #1b8a34 0%, #0e4f1e 100%);
  color: #ffffff;
  box-shadow: 0 0 24px rgba(50, 215, 75, 0.55);
}

.mc-autorun-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #6c809a;
  flex-shrink: 0;
}

.mc-autorun-btn.is-running .mc-autorun-dot {
  background: #32d74b;
  box-shadow: 0 0 10px #ffffff;
}

.mc-autorun-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 2px;
}

.mc-autorun-title {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1.2px;
  line-height: 1;
}

.mc-autorun-sub {
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.9px;
  opacity: 0.78;
}

.mc-swipe-turn-zone {
  border-radius: 20px;
  border: 1.5px solid rgba(255, 159, 10, 0.45);
  background: radial-gradient(
    circle at 50% 50%,
    rgba(62, 38, 12, 0.5) 0%,
    rgba(8, 13, 21, 0.94) 100%
  );
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  touch-action: none;
  user-select: none;
}

.mc-swipe-header {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #ffbc57;
}

.mc-swipe-track {
  width: 100%;
  height: 74px;
  border-radius: 999px;
  border: 1.5px dashed rgba(255, 188, 87, 0.45);
  background: rgba(12, 18, 28, 0.75);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: relative;
  overflow: hidden;
}

.mc-swipe-arrow {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: rgba(255, 188, 87, 0.55);
  pointer-events: none;
}

.mc-swipe-puck {
  position: absolute;
  left: calc(50% - 27px);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2px solid #ffbc57;
  background: linear-gradient(145deg, #ff9f0a, #b85d00);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  transition: transform 0.06s linear;
}

.mc-swipe-puck.active {
  transition: none;
  border-color: #ffffff;
  box-shadow: 0 0 22px rgba(255, 159, 10, 0.85);
}
```

===============================================================================
FILE: index.js
===============================================================================

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

===============================================================================
FILE: main.jsx
===============================================================================

```jsx
```

===============================================================================
FILE: reportWebVitals.js
===============================================================================

```js
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
```

===============================================================================
FILE: setupTests.js
===============================================================================

```js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
```

===============================================================================
FILE: utils/network.js
===============================================================================

```js
export function getSocketUrl() {
  if (typeof window === "undefined") return "http://localhost:4000";
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${window.location.hostname}:4000`;
}

export function getNetworkControllerUrl() {
  if (typeof window === "undefined") return "";
  const { hostname, port, protocol } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ""}/?controller=1`;
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
```

-------------------------------------------------------------------------------

Generated by ctx

Total Files: 25
