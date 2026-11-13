import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ZONE_STAGES,
  ZONE_INITIAL_RADIUS,
  ZONE_CENTER,
  ZONE_Y,
} from '../../config/gameConstants';

/* ------------------------------------------------------------------ */
/*  Pure helper — also exported so the HUD can query zone state       */
/* ------------------------------------------------------------------ */
export function getZoneInfo(matchElapsed) {
  let elapsed = matchElapsed;
  let prevRadius = ZONE_INITIAL_RADIUS;
  let currentDps = 0;

  for (let i = 0; i < ZONE_STAGES.length; i++) {
    const stage = ZONE_STAGES[i];

    // Delay phase — waiting before this stage shrinks
    if (elapsed < stage.delay) {
      return {
        stage: i,
        radius: prevRadius,
        dps: currentDps,
        nextShrinkIn: stage.delay - elapsed,
        isShrinking: false,
      };
    }
    elapsed -= stage.delay;

    // Shrink phase — linearly interpolate from prevRadius → stage.radius
    if (elapsed < stage.shrink) {
      const t = elapsed / stage.shrink;
      return {
        stage: i,
        radius: THREE.MathUtils.lerp(prevRadius, stage.radius, t),
        dps: stage.dps,
        nextShrinkIn: 0,
        isShrinking: true,
      };
    }
    elapsed -= stage.shrink;

    // Stage complete — advance
    prevRadius = stage.radius;
    currentDps = stage.dps;
  }

  // All stages exhausted — zone stays at final size
  const last = ZONE_STAGES[ZONE_STAGES.length - 1];
  return {
    stage: ZONE_STAGES.length - 1,
    radius: last.radius,
    dps: last.dps,
    nextShrinkIn: 0,
    isShrinking: false,
  };
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const CYLINDER_HEIGHT = 200;
const CYLINDER_Y = ZONE_Y - 50;
const ZONE_COLOR = new THREE.Color('#0088ff');
const RING_COLOR = new THREE.Color('#00aaff');

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ZoneManager({
  matchStatus = 'IN_PROGRESS',
  matchElapsed = 0,
  playerPos = null,
  onZoneDamage,
  enabled = true,
}) {
  const cylinderRef = useRef();
  const ringRef = useRef();
  const damageTimerRef = useRef(0);

  // Cylinder geometry: radius 1, will be scaled to currentRadius
  const cylinderGeom = useMemo(
    () => new THREE.CylinderGeometry(1, 1, CYLINDER_HEIGHT, 64, 1, true),
    [],
  );

  // Torus ring at the base for the glowing edge
  const ringGeom = useMemo(
    () => new THREE.TorusGeometry(1, 0.35, 8, 128),
    [],
  );

  // Materials (created once)
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ZONE_COLOR,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: RING_COLOR,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      }),
    [],
  );

  // Dispose geometries and materials cleanly on unmount
  useEffect(() => {
    return () => {
      cylinderGeom.dispose();
      ringGeom.dispose();
      wallMaterial.dispose();
      ringMaterial.dispose();
    };
  }, [cylinderGeom, ringGeom, wallMaterial, ringMaterial]);

  // Per-frame logic
  useFrame((_, delta) => {
    if (matchStatus !== 'IN_PROGRESS' || !enabled) return;

    const info = getZoneInfo(matchElapsed);
    const currentRadius = info.radius;
    const currentDps = info.dps;

    // Scale cylinder mesh to currentRadius
    if (cylinderRef.current) {
      cylinderRef.current.scale.set(currentRadius, 1, currentRadius);
    }

    // Scale ring mesh to currentRadius
    if (ringRef.current) {
      ringRef.current.scale.set(currentRadius, currentRadius, 1);
    }

    // Check if player is outside the zone (throttled once per second)
    if (playerPos && onZoneDamage && currentDps > 0) {
      const dx = playerPos.x - ZONE_CENTER.x;
      const dz = playerPos.z - ZONE_CENTER.z;
      const distSq = dx * dx + dz * dz;
      if (distSq > currentRadius * currentRadius) {
        damageTimerRef.current += delta;
        if (damageTimerRef.current >= 1.0) {
          damageTimerRef.current = 0;
          onZoneDamage(currentDps);
        }
      } else {
        damageTimerRef.current = 0;
      }
    }
  });

  // Don't render anything when disabled or match not in progress
  if (!enabled || matchStatus !== 'IN_PROGRESS') return null;

  return (
    <group>
      {/* Translucent blue cylinder wall */}
      <mesh
        ref={cylinderRef}
        geometry={cylinderGeom}
        material={wallMaterial}
        position={[ZONE_CENTER.x, CYLINDER_Y, ZONE_CENTER.z]}
      />

      {/* Bright ring at the base */}
      <mesh
        ref={ringRef}
        geometry={ringGeom}
        material={ringMaterial}
        position={[ZONE_CENTER.x, ZONE_Y, ZONE_CENTER.z]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
