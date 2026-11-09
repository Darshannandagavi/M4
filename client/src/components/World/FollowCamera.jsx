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
