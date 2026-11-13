import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import WorldHtml from "../UI/WorldHtml";
import {
  LOOT_ITEMS,
  LOOT_SPAWN_TABLE,
  LOOT_SPAWN_COUNT,
  LOOT_PICKUP_RANGE,
} from "../../config/gameConstants";

/* ------------------------------------------------------------------ */
/*  Helpers & Shared Resources (Allocated Once)                        */
/* ------------------------------------------------------------------ */

function weightedRandom(table) {
  const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < table.length; i++) {
    roll -= table[i].weight;
    if (roll <= 0) return table[i].id;
  }
  return table[table.length - 1].id;
}

const _raycaster = new THREE.Raycaster();
const _rayOrigin = new THREE.Vector3();
const _rayDir = new THREE.Vector3(0, -1, 0);
const _worldNormal = new THREE.Vector3();
const _boxGeo = new THREE.BoxGeometry(0.44, 0.44, 0.44);
const _ringGeo = new THREE.RingGeometry(0.32, 0.46, 16);
_ringGeo.rotateX(-Math.PI / 2);

const _boxMatCache = new Map();
const _ringMatCache = new Map();

function getBoxMaterial(color) {
  let mat = _boxMatCache.get(color);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.42,
      roughness: 0.35,
      metalness: 0.15,
    });
    _boxMatCache.set(color, mat);
  }
  return mat;
}

function getRingMaterial(color) {
  let mat = _ringMatCache.get(color);
  if (!mat) {
    mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });
    _ringMatCache.set(color, mat);
  }
  return mat;
}

function sampleLootGroundY(meshes, x, z, fallbackY = 1) {
  if (!meshes || meshes.length === 0) return null;

  _rayOrigin.set(x, 60, z);
  _raycaster.set(_rayOrigin, _rayDir);
  _raycaster.far = 120;
  const hits = _raycaster.intersectObjects(meshes, false);

  let bestY = null;
  for (let i = 0; i < hits.length; i++) {
    const h = hits[i];
    if (h.face) {
      _worldNormal.copy(h.face.normal).transformDirection(h.object.matrixWorld);
      if (_worldNormal.y < 0.35) continue;
    }
    if (h.point.y < -1.5) continue;
    if (bestY === null || h.point.y > bestY) {
      bestY = h.point.y;
    }
  }

  return bestY !== null ? bestY : fallbackY;
}

/* ------------------------------------------------------------------ */
/*  Single loot item (no PointLight, no per-item useFrame)             */
/* ------------------------------------------------------------------ */

const LootItem = React.memo(function LootItem({
  uid,
  itemId,
  position,
  collected,
  isNearest,
  registerMesh,
}) {
  if (collected) return null;

  const def = LOOT_ITEMS[itemId] || { color: "#ffffff", label: itemId };
  const boxMat = getBoxMaterial(def.color);
  const ringMat = getRingMaterial(def.color);

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={(el) => registerMesh(uid, el)}
        geometry={_boxGeo}
        material={boxMat}
        position={[0, 0.5, 0]}
      />
      <mesh
        geometry={_ringGeo}
        material={ringMat}
        position={[0, 0.06, 0]}
      />
      {isNearest && (
        <WorldHtml center position={[0, 1.55, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(9, 14, 24, 0.85)",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              textAlign: "center",
              border: `1px solid ${def.color}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.45)",
            }}
          >
            Press <b>E</b> to pick up <b>{def.label}</b>
          </div>
        </WorldHtml>
      )}
    </group>
  );
});

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function LootManager({
  collidersRef,
  characterRef,
  interactPressed = false,
  matchStatus = "IN_PROGRESS",
  resetToken = 0,
  collidersReadyVersion = 0,
  onLootPickup,
}) {
  const lootsRef = useRef([]);
  const meshMapRef = useRef(new Map());
  const needsSnapRef = useRef(true);
  const nearestLootIdRef = useRef(null);
  const [nearestLootId, setNearestLootId] = useState(null);
  const [revision, setRevision] = useState(0);

  const registerMesh = useCallback((uid, el) => {
    if (el) {
      meshMapRef.current.set(uid, el);
    } else {
      meshMapRef.current.delete(uid);
    }
  }, []);

  /* ---------- Generate loot spawns on resetToken -------------------- */
  useEffect(() => {
    const spawns = [];
    for (let i = 0; i < LOOT_SPAWN_COUNT; i++) {
      const itemId = weightedRandom(LOOT_SPAWN_TABLE);
      // Spawn within 54m of map center so all loot lands directly on Bermuda island
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.sqrt(Math.random()) * 48;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      spawns.push({
        uid: `loot-${resetToken}-${i}`,
        itemId,
        phase: (i * 0.618) % (Math.PI * 2),
        position: new THREE.Vector3(x, 1, z),
        collected: false,
      });
    }

    lootsRef.current = spawns;
    needsSnapRef.current = true;
    nearestLootIdRef.current = null;
    setNearestLootId(null);
    setRevision((r) => r + 1);
  }, [resetToken]);

  /* ---------- Snap loot Y once colliders BVH finishes --------------- */
  useEffect(() => {
    if (!needsSnapRef.current) return;
    const colliders = collidersRef?.current;
    const raw =
      colliders?.meshes ||
      (Array.isArray(colliders) ? colliders : []);
    const meshes = raw
      .map((c) => (c?.isObject3D ? c : c?.mesh))
      .filter(Boolean);

    if (!meshes.length || (colliders && colliders.ready === false)) return;

    const spawns = lootsRef.current;
    for (let i = 0; i < spawns.length; i++) {
      const l = spawns[i];
      const snappedY = sampleLootGroundY(meshes, l.position.x, l.position.z, 1);
      if (snappedY !== null) {
        l.position.y = snappedY;
      }
    }

    needsSnapRef.current = false;
    setRevision((r) => r + 1);
  }, [collidersRef, collidersReadyVersion, resetToken]);

  /* ---------- Single centralized per-frame loop --------------------- */
  const interactRef = useRef(false);
  const prevInteractRef = useRef(false);
  interactRef.current = interactPressed;

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const loots = lootsRef.current;

    // Animate visible loot boxes in local coordinates (group already sits at groundY)
    for (let i = 0; i < loots.length; i++) {
      const l = loots[i];
      if (l.collected) continue;
      const mesh = meshMapRef.current.get(l.uid);
      if (!mesh) continue;
      mesh.rotation.y += dt * 0.9;
      mesh.position.y = 0.5 + Math.sin(t * 2.4 + l.phase) * 0.14;
    }

    if (matchStatus !== "IN_PROGRESS") {
      prevInteractRef.current = interactRef.current;
      return;
    }

    const charPos = characterRef?.current?.position;
    if (!charPos) {
      prevInteractRef.current = interactRef.current;
      return;
    }

    let closestDist = Infinity;
    let closestIdx = -1;

    for (let i = 0; i < loots.length; i++) {
      const l = loots[i];
      if (l.collected) continue;
      const dx = charPos.x - l.position.x;
      const dz = charPos.z - l.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }

    const nearId =
      closestIdx >= 0 && closestDist <= LOOT_PICKUP_RANGE
        ? loots[closestIdx].uid
        : null;

    if (nearestLootIdRef.current !== nearId) {
      nearestLootIdRef.current = nearId;
      setNearestLootId(nearId);
    }

    // Pickup on press edge
    const justPressed = interactRef.current && !prevInteractRef.current;
    prevInteractRef.current = interactRef.current;

    if (justPressed && nearId !== null) {
      const loot = loots[closestIdx];
      loot.collected = true;
      meshMapRef.current.delete(loot.uid);
      nearestLootIdRef.current = null;
      setNearestLootId(null);
      setRevision((r) => r + 1);
      if (onLootPickup) {
        onLootPickup({ ...LOOT_ITEMS[loot.itemId], uid: loot.uid, itemId: loot.itemId });
      }
    }
  });

  void revision;

  return (
    <group>
      {lootsRef.current.map((l) => (
        <LootItem
          key={l.uid}
          uid={l.uid}
          itemId={l.itemId}
          position={l.position}
          collected={l.collected}
          isNearest={l.uid === nearestLootId}
          registerMesh={registerMesh}
        />
      ))}
    </group>
  );
}
