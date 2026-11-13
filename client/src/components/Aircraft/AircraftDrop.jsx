import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  AIRCRAFT_ALTITUDE,
  AIRCRAFT_SPEED,
  PARACHUTE_FALL_SPEED,
  PARACHUTE_LATERAL_SPEED,
} from "../../config/gameConstants";

const AIRCRAFT_START_X = -56;
const AIRCRAFT_END_X = 56;

// Shared geometries, materials, and scratch vectors (zero per-frame allocations)
const _aircraftFuselageGeo = new THREE.BoxGeometry(10, 1.5, 1.6);
const _aircraftCockpitGeo = new THREE.BoxGeometry(2.2, 0.9, 1.3);
const _aircraftWingGeo = new THREE.BoxGeometry(2.2, 0.25, 8.5);
const _aircraftTailVGeo = new THREE.BoxGeometry(1.5, 2.1, 0.2);
const _aircraftTailHGeo = new THREE.BoxGeometry(1.2, 0.16, 3.2);
const _canopyGeo = new THREE.ConeGeometry(2.8, 3.4, 8);

const _aircraftMat = new THREE.MeshStandardMaterial({
  color: "#3a4250",
  metalness: 0.55,
  roughness: 0.42,
});
const _cockpitMat = new THREE.MeshStandardMaterial({
  color: "#1b2838",
  metalness: 0.85,
  roughness: 0.18,
});
const _canopyMat = new THREE.MeshStandardMaterial({
  color: "#f8fafc",
  transparent: true,
  opacity: 0.82,
  side: THREE.DoubleSide,
});
const _cordMat = new THREE.LineBasicMaterial({ color: "#ffffff" });

const _raycaster = new THREE.Raycaster();
const _rayOrigin = new THREE.Vector3();
const _downDir = new THREE.Vector3(0, -1, 0);
const _worldNormal = new THREE.Vector3();

function ParachuteCords({ chuteY }) {
  const geometry = useMemo(() => {
    const offsets = [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ];
    const arr = new Float32Array(offsets.length * 6);
    offsets.forEach((o, i) => {
      arr[i * 6 + 0] = o[0];
      arr[i * 6 + 1] = chuteY - 1.7;
      arr[i * 6 + 2] = o[1];
      arr[i * 6 + 3] = 0;
      arr[i * 6 + 4] = 0.8;
      arr[i * 6 + 5] = 0;
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geom;
  }, [chuteY]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return <lineSegments geometry={geometry} material={_cordMat} />;
}

const AircraftMesh = React.memo(function AircraftMesh() {
  return (
    <group>
      <mesh geometry={_aircraftFuselageGeo} material={_aircraftMat} />
      <mesh
        geometry={_aircraftCockpitGeo}
        material={_cockpitMat}
        position={[3.8, 0.45, 0]}
      />
      <mesh
        geometry={_aircraftWingGeo}
        material={_aircraftMat}
        position={[0, 0, 4.2]}
      />
      <mesh
        geometry={_aircraftWingGeo}
        material={_aircraftMat}
        position={[0, 0, -4.2]}
      />
      <mesh
        geometry={_aircraftTailVGeo}
        material={_aircraftMat}
        position={[-4.5, 1.25, 0]}
      />
      <mesh
        geometry={_aircraftTailHGeo}
        material={_aircraftMat}
        position={[-4.5, 0.25, 0]}
      />
    </group>
  );
});

export default function AircraftDrop({
  active = false,
  ejectToken = 0,
  characterRef,
  collidersRef,
  onLanded,
  onPhaseChange,
  cameraRef,
  remoteInputRef,
}) {
  const { camera } = useThree();
  const phaseRef = useRef("flying"); // 'flying' | 'falling' | 'landed'
  const aircraftPosRef = useRef(
    new THREE.Vector3(AIRCRAFT_START_X, AIRCRAFT_ALTITUDE, 0),
  );
  const dropPosRef = useRef(new THREE.Vector3(0, AIRCRAFT_ALTITUDE, 0));
  const aircraftGroupRef = useRef();
  const parachuteGroupRef = useRef();
  const landedRef = useRef(false);
  const keysRef = useRef({});
  const lastEjectTokenRef = useRef(ejectToken);

  const [phase, setPhase] = useState("flying");

  const startFalling = useCallback(() => {
    if (phaseRef.current !== "flying") return;
    phaseRef.current = "falling";
    setPhase("falling");
    onPhaseChange?.("falling");
    dropPosRef.current.copy(aircraftPosRef.current);
    if (characterRef?.current) {
      characterRef.current.position.copy(dropPosRef.current);
      characterRef.current.visible = true;
    }
  }, [characterRef, onPhaseChange]);

  // Trigger eject from HUD button
  useEffect(() => {
    if (ejectToken !== lastEjectTokenRef.current) {
      lastEjectTokenRef.current = ejectToken;
      if (active && phaseRef.current === "flying") {
        startFalling();
      }
    }
  }, [ejectToken, active, startFalling]);

  // Reset when active changes + attach keyboard flight/steer listeners
  useEffect(() => {
    if (!active) return;

    phaseRef.current = "flying";
    setPhase("flying");
    onPhaseChange?.("flying");
    aircraftPosRef.current.set(AIRCRAFT_START_X, AIRCRAFT_ALTITUDE, 0);
    dropPosRef.current.set(0, AIRCRAFT_ALTITUDE, 0);
    landedRef.current = false;
    keysRef.current = {};

    if (characterRef?.current) {
      characterRef.current.visible = false;
    }

    const onKeyDown = (e) => {
      keysRef.current[e.code] = true;
      if (e.code === "Space" && phaseRef.current === "flying") {
        e.preventDefault();
        startFalling();
      }
    };

    const onKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [active, characterRef, startFalling, onPhaseChange]);

  useFrame((_, rawDelta) => {
    if (!active || phaseRef.current === "landed") return;

    const delta = Math.min(rawDelta, 0.12);
    const cam = cameraRef?.current || camera;

    if (phaseRef.current === "flying") {
      aircraftPosRef.current.x += AIRCRAFT_SPEED * delta;

      if (aircraftGroupRef.current) {
        aircraftGroupRef.current.position.copy(aircraftPosRef.current);
      }

      cam.position.set(
        aircraftPosRef.current.x - 11,
        aircraftPosRef.current.y + 7,
        aircraftPosRef.current.z + 9,
      );
      cam.lookAt(
        aircraftPosRef.current.x + 6,
        aircraftPosRef.current.y - 10,
        aircraftPosRef.current.z,
      );

      const remoteJumpTriggered = Boolean(remoteInputRef?.current?.jumpPulse);
      if (remoteInputRef?.current?.jumpPulse) {
        remoteInputRef.current.jumpPulse = false;
      }
      if (
        remoteInputRef?.current?.jump ||
        remoteJumpTriggered ||
        aircraftPosRef.current.x >= AIRCRAFT_END_X
      ) {
        startFalling();
      }
      return;
    }

    if (phaseRef.current === "falling") {
      const input = remoteInputRef?.current || {};
      const keys = keysRef.current;

      const kbX =
        (keys.KeyD || keys.ArrowRight ? 1 : 0) -
        (keys.KeyA || keys.ArrowLeft ? 1 : 0);
      const kbZ =
        (keys.KeyS || keys.ArrowDown ? 1 : 0) -
        (keys.KeyW || keys.ArrowUp ? 1 : 0);

      const moveX = THREE.MathUtils.clamp(kbX + (input.moveX || 0), -1, 1);
      const moveZ = THREE.MathUtils.clamp(kbZ - (input.moveY || 0), -1, 1);

      dropPosRef.current.x += moveX * PARACHUTE_LATERAL_SPEED * delta;
      dropPosRef.current.z += moveZ * PARACHUTE_LATERAL_SPEED * delta;
      dropPosRef.current.y -= PARACHUTE_FALL_SPEED * delta;

      if (parachuteGroupRef.current) {
        parachuteGroupRef.current.position.copy(dropPosRef.current);
      }

      if (characterRef?.current) {
        characterRef.current.position.copy(dropPosRef.current);
        if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
          characterRef.current.rotation.y = Math.atan2(moveX, moveZ);
        }
      }

      cam.position.set(
        dropPosRef.current.x - 6,
        dropPosRef.current.y + 4.5,
        dropPosRef.current.z + 6.5,
      );
      cam.lookAt(dropPosRef.current);

      // Ground detection against ready Bermuda colliders
      let groundY = 0;
      const colliders = collidersRef?.current;
      if (colliders && colliders.ready !== false) {
        const raw =
          colliders.meshes || (Array.isArray(colliders) ? colliders : []);
        const meshes = [];
        for (let i = 0; i < raw.length; i += 1) {
          const item = raw[i];
          if (item?.isObject3D) meshes.push(item);
          else if (item?.mesh) meshes.push(item.mesh);
        }

        if (meshes.length > 0) {
          _rayOrigin.set(
            dropPosRef.current.x,
            dropPosRef.current.y + 8,
            dropPosRef.current.z,
          );
          _raycaster.set(_rayOrigin, _downDir);
          _raycaster.far = 120;
          const hits = _raycaster.intersectObjects(meshes, false);
          for (let i = 0; i < hits.length; i += 1) {
            const h = hits[i];
            if (h.face) {
              _worldNormal
                .copy(h.face.normal)
                .transformDirection(h.object.matrixWorld);
              if (_worldNormal.y < 0.35) continue;
            }
            if (h.point.y < -2) continue;
            groundY = h.point.y;
            break;
          }
        }
      }

      if (dropPosRef.current.y <= groundY + 1.5 && !landedRef.current) {
        landedRef.current = true;
        dropPosRef.current.y = groundY;
        phaseRef.current = "landed";
        setPhase("landed");
        onPhaseChange?.("landed");

        if (characterRef?.current) {
          characterRef.current.position.copy(dropPosRef.current);
          characterRef.current.visible = true;
        }

        onLanded?.();
      }
    }
  });

  if (!active) return null;

  return (
    <group>
      {phase === "flying" && (
        <group
          ref={aircraftGroupRef}
          position={[AIRCRAFT_START_X, AIRCRAFT_ALTITUDE, 0]}
          scale={0.55}
        >
          <AircraftMesh />
        </group>
      )}

      {phase === "falling" && (
        <group ref={parachuteGroupRef} position={dropPosRef.current.toArray()} scale={0.55}>
          <mesh
            geometry={_canopyGeo}
            material={_canopyMat}
            position={[0, 5.6, 0]}
            rotation={[Math.PI, 0, 0]}
          />
          <ParachuteCords chuteY={5.6} />
        </group>
      )}
    </group>
  );
}
