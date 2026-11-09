import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_MODES } from "../../config/gameConstants";

const MOUSE_SENSITIVITY = 0.0028;
const MIN_PITCH = -0.35;
const MAX_PITCH = 0.9;
const ORBIT_DAMP = 14;

export default function FollowCamera({
  targetRef,
  carRef,
  physicsStateRef,
  cameraMode,
  isCharacterMode,
  orbitYawRef, // optional: { current: number } so controller can read camera yaw
  orbitPitchRef, // optional: { current: number }
}) {
  const { camera, gl } = useThree();
  const desiredPosition = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const previousMode = useRef(null);
  const activeTargetRef = targetRef || carRef;
  const camPreset =
    CAMERA_MODES.find((item) => item.id === cameraMode) || CAMERA_MODES[0];

  // Orbit state: yaw/pitch driven by mouse drag (pointer-lock or drag).
  const yaw = useRef(0);
  const pitch = useRef(0);
  const yawTarget = useRef(0);
  const pitchTarget = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const pointerLocked = useRef(false);

  // Expose to parent
  if (orbitYawRef) orbitYawRef.current = yaw.current;
  if (orbitPitchRef) orbitPitchRef.current = pitch.current;

  useEffect(() => {
    previousMode.current = null;
  }, [isCharacterMode]);

  // Mouse-look: click to lock pointer, move to orbit, Esc to release.
  useEffect(() => {
    if (!isCharacterMode) return undefined;
    const el = gl.domElement;

    const onPointerDown = (e) => {
      if (pointerLocked.current) return;
      if (e.button !== 0) return;
      dragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      el.setPointerCapture?.(e.pointerId);
    };

    const onPointerUp = (e) => {
      dragging.current = false;
      el.releasePointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (pointerLocked.current) {
        yawTarget.current -= e.movementX * MOUSE_SENSITIVITY;
        pitchTarget.current = THREE.MathUtils.clamp(
          pitchTarget.current - e.movementY * MOUSE_SENSITIVITY,
          MIN_PITCH,
          MAX_PITCH,
        );
        return;
      }
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      yawTarget.current -= dx * MOUSE_SENSITIVITY;
      pitchTarget.current = THREE.MathUtils.clamp(
        pitchTarget.current - dy * MOUSE_SENSITIVITY,
        MIN_PITCH,
        MAX_PITCH,
      );
    };

    const onDblClick = () => {
      if (!pointerLocked.current && el.requestPointerLock) {
        el.requestPointerLock();
      }
    };

    const onPointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === el;
      if (pointerLocked.current) dragging.current = false;
    };

    const onWheel = (e) => {
      // Optional: right-drag zoom could go here; ignored for now.
      e.preventDefault();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("dblclick", onDblClick);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("dblclick", onDblClick);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      el.removeEventListener("wheel", onWheel);
      if (pointerLocked.current && document.exitPointerLock) {
        document.exitPointerLock();
      }
    };
  }, [gl, isCharacterMode]);

  useFrame((_, rawDelta) => {
    const target = activeTargetRef?.current;
    if (!target) return;

    const dt = Math.min(rawDelta, 0.05);
    const modeKey = isCharacterMode ? "character" : `car-${cameraMode}`;
    if (previousMode.current !== modeKey) {
      previousMode.current = modeKey;
      currentLook.current
        .copy(target.position)
        .add(new THREE.Vector3(0, isCharacterMode ? 1.2 : 0.9, 0));
    }

    if (isCharacterMode) {
      // Smooth orbit yaw/pitch toward targets
      const yawAlpha = 1 - Math.exp(-ORBIT_DAMP * dt);
      yaw.current += (yawTarget.current - yaw.current) * yawAlpha;
      pitch.current += (pitchTarget.current - pitch.current) * yawAlpha;
      if (orbitYawRef) orbitYawRef.current = yaw.current;
      if (orbitPitchRef) orbitPitchRef.current = pitch.current;

      const distance = 5.2;
      const heightOffset = 1.35;
      const horizontal = Math.cos(pitch.current) * distance;
      const vertical = Math.sin(pitch.current) * distance;

      // Camera sits behind the character based on orbit yaw.
      const cx = target.position.x + Math.sin(yaw.current) * horizontal;
      const cz = target.position.z + Math.cos(yaw.current) * horizontal;
      const cy = target.position.y + heightOffset + vertical;

      desiredPosition.current.set(cx, cy, cz);
      camera.position.lerp(desiredPosition.current, 1 - Math.exp(-10 * dt));

      lookTarget.current
        .copy(target.position)
        .add(new THREE.Vector3(0, 1.35, 0));
      currentLook.current.lerp(lookTarget.current, 1 - Math.exp(-14 * dt));
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
