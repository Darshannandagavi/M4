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
  { onWheelsReady, onError, doorProgressRef },
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
    const timeline = doorProgressRef?.current;
    let targetAngle = 0;

    if (timeline?.animation === "enterCar") {
      const p = timeline.progress;
      const opening = THREE.MathUtils.smoothstep(p, 0.18, 0.38);
      const closing = 1 - THREE.MathUtils.smoothstep(p, 0.72, 0.85);
      targetAngle = 1.08 * opening * closing;
    } else if (timeline?.animation === "exitCar") {
      const p = timeline.progress;
      const opening = THREE.MathUtils.smoothstep(p, 0.1, 0.3);
      const closing = 1 - THREE.MathUtils.smoothstep(p, 0.76, 0.95);
      targetAngle = 1.08 * opening * closing;
    }

    doorAngleRef.current = THREE.MathUtils.damp(
      doorAngleRef.current,
      targetAngle,
      18,
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
