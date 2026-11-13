import React, { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const entries = new Map();
const listeners = new Set();
let snapshot = [];
let pendingFlush = false;

function flushNotify() {
  pendingFlush = false;
  snapshot = Array.from(entries.values());
  listeners.forEach((fn) => fn());
}

function scheduleNotify() {
  if (pendingFlush) return;
  pendingFlush = true;
  Promise.resolve().then(flushNotify);
}

function upsertEntry(id, entry) {
  entries.set(id, entry);
  scheduleNotify();
}

function removeEntry(id) {
  if (entries.delete(id)) {
    scheduleNotify();
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

const _objPos = new THREE.Vector3();
const _camPos = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _delta = new THREE.Vector3();
const _proj = new THREE.Vector3();

/**
 * Single-root DOM overlay layer rendered inside the main game shell.
 * Eliminates per-label secondary ReactDOM roots from @react-three/drei Html
 * so React 19 dev mode never unmounts secondary roots during a render/commit.
 */
export function WorldHtmlLayer() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 15,
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          ref={(node) => {
            item.domRef.current = node;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "none",
            transformOrigin: "0 0",
            willChange: "transform",
            pointerEvents: "none",
            ...item.style,
          }}
        >
          {item.children}
        </div>
      ))}
    </div>
  );
}

/**
 * R3F 3D-to-2D projected overlay node without creating nested ReactDOM roots.
 */
export default function WorldHtml({
  position = [0, 0, 0],
  center = false,
  distanceFactor = 0,
  style,
  children,
}) {
  const id = useId();
  const groupRef = useRef(null);
  const domRef = useRef(null);
  const lastTransformRef = useRef("");
  const lastDisplayRef = useRef("none");
  const { camera, size } = useThree();

  useEffect(() => {
    upsertEntry(id, { id, domRef, style, children });
  }, [id, style, children]);

  useEffect(() => {
    return () => {
      removeEntry(id);
    };
  }, [id]);

  useFrame(() => {
    const el = domRef.current;
    const grp = groupRef.current;
    if (!el || !grp) return;

    grp.updateWorldMatrix(true, false);
    _objPos.setFromMatrixPosition(grp.matrixWorld);
    _camPos.setFromMatrixPosition(camera.matrixWorld);
    camera.getWorldDirection(_camDir);
    _delta.subVectors(_objPos, _camPos);

    const dist = _delta.length();
    const inFront = _delta.dot(_camDir) > 0.1;

    if (!inFront || dist > 150) {
      if (lastDisplayRef.current !== "none") {
        lastDisplayRef.current = "none";
        el.style.display = "none";
      }
      return;
    }

    _proj.copy(_objPos).project(camera);
    if (Math.abs(_proj.x) > 1.35 || Math.abs(_proj.y) > 1.35 || _proj.z > 1) {
      if (lastDisplayRef.current !== "none") {
        lastDisplayRef.current = "none";
        el.style.display = "none";
      }
      return;
    }

    const x = (_proj.x * 0.5 + 0.5) * size.width;
    const y = (-_proj.y * 0.5 + 0.5) * size.height;

    let scale = 1;
    if (distanceFactor > 0 && camera.fov) {
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFov / 2) * Math.max(0.5, dist);
      scale = THREE.MathUtils.clamp(distanceFactor / visibleHeight, 0.28, 1.65);
    }

    const nextTransform = center
      ? `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) translate(-50%, -50%)`
      : `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;

    if (lastDisplayRef.current !== "block") {
      lastDisplayRef.current = "block";
      el.style.display = "block";
    }
    if (lastTransformRef.current !== nextTransform) {
      lastTransformRef.current = nextTransform;
      el.style.transform = nextTransform;
    }
  });

  return <group ref={groupRef} position={position} />;
}

