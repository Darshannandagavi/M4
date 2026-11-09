import React, { forwardRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import modelUrl from "../../assets/models/2021_bmw_m4_competition.glb";

export const BMW_M4_SCALE = 0.73;

// Reflection strength on the car paint/glass.
// Raise it if the car is still too dark, lower it if it looks washed out.
const CAR_ENV_INTENSITY = 1.2;

// The GLB's front is +Z. Rotating +90° on Y makes the car face +X,
// which is what CarController and FollowCamera expect.
const MODEL_YAW = Math.PI / 2;

// The front wheels are authored with a ~20° showroom steering turn.
// It is removed once so steering = 0 means "straight ahead".
// If the front wheels look turned at rest, flip the sign or set this to 0.
const PRE_POSED_STEER = -0.34906585;

// Names below are taken from the uploaded GLB's actual node hierarchy.
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

// GLTFLoader renames nodes: spaces become "_" ("brake disc" -> "brake_disc").
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
  // Refresh every ancestor (incl. the scaled <group>) and descendant first,
  // so all measurements below use the same up-to-date matrices.
  model.updateWorldMatrix(true, true);

  const assemblies = [];

  for (const definition of WHEEL_DEFINITIONS) {
    const tyres = definition.tyreNames
      .map((name) => getNode(model, name))
      .filter(Boolean);
    const rim = getNode(model, definition.rimName);
    const disc = getNode(model, definition.discName);
    const caliper = getNode(model, definition.caliperName);

    // Only tyres + rim are required. A missing disc or caliper must never
    // disable steering and rolling for the whole wheel.
    if (!tyres.length || !rim) {
      console.warn(`[BMW M4] Incomplete wheel assembly: ${definition.id}`);
      continue;
    }

    const rollingParts = [...tyres, rim];
    if (disc) rollingParts.push(disc);

    // Wheel centre (model space) and radius (world units).
    const box = new THREE.Box3();
    [...tyres, rim].forEach((part) => box.expandByObject(part));
    const centerLocal = model.worldToLocal(box.getCenter(new THREE.Vector3()));
    const radius = (box.max.y - box.min.y) / 2;

    // Pivots sit directly under `model`: steering = rotation.y,
    // rolling = rotation.x (the axle runs along model X).
    const steeringPivot = new THREE.Group();
    steeringPivot.name = `GAME_STEER_${definition.id}`;
    steeringPivot.position.copy(centerLocal);
    model.add(steeringPivot);

    const rollingPivot = new THREE.Group();
    rollingPivot.name = `GAME_ROLL_${definition.id}`;
    steeringPivot.add(rollingPivot);

    // Pose the pivot like the authored wheel, attach (keeps world transform),
    // then reset to straight.
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

  console.info(
    `[BMW M4] Built ${assemblies.length}/${WHEEL_DEFINITIONS.length} wheel pivots.`,
  );

  return assemblies;
}

// React StrictMode runs effects twice in dev. Build the rig only once per
// model, otherwise the front wheels would be un-turned twice.
const wheelRigCache = new WeakMap();

const BMWM4 = forwardRef(function BMWM4(
  { onWheelsReady, onError },
  forwardedRef,
) {
  const { scene } = useGLTF(modelUrl);
  const gl = useThree((state) => state.gl);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.rotation.y = MODEL_YAW;
    return clone;
  }, [scene]);

  // Metallic paint only shows reflections. Without an environment map it
  // renders as a flat black silhouette. RoomEnvironment is generated locally
  // (no network download).
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
          // Car-only reflections, so the map keeps its current look.
          if (material.isMeshStandardMaterial) {
            material.envMap = envMap;
            material.envMapIntensity = CAR_ENV_INTENSITY;
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

      console.table(
        assemblies.map((wheel) => ({
          id: wheel.id,
          front: wheel.isFront,
          radius: wheel.radius,
        })),
      );
      if (mounted) onWheelsReady?.(assemblies);
    } catch (error) {
      console.error("[BMW M4] Wheel setup failed:", error);
      if (mounted) onError?.(error);
    }

    return () => {
      mounted = false;
      onWheelsReady?.([]);
    };
  }, [model, envMap, onError, onWheelsReady]);

  return (
    <group ref={forwardedRef} scale={BMW_M4_SCALE}>
      <primitive object={model} />
    </group>
  );
});

useGLTF.preload(modelUrl);

export default BMWM4;
