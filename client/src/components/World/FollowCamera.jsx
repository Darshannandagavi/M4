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

const _upAxis = new THREE.Vector3(0, 1, 0);
const _offsetVec = new THREE.Vector3();
const _lookVec = new THREE.Vector3();
const _charEyeOffset = new THREE.Vector3(0, 1.35, 0);

export default function FollowCamera({
  enabled = true,
  targetRef,
  carRef,
  physicsStateRef,
  remoteInputRef,
  cameraMode,
  isCharacterMode,
  isArmed = false,
  isAiming = false,
  orbitYawRef,
  orbitPitchRef,
  aimAssistLocked = false,
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
  const aimAssistLockedRef = useRef(aimAssistLocked);

  useEffect(() => {
    aimAssistLockedRef.current = aimAssistLocked;
  }, [aimAssistLocked]);

  useEffect(() => {
    if (!enabled || !isCharacterMode) {
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
        deltaX = THREE.MathUtils.clamp(event.movementX || 0, -120, 120);
        deltaY = THREE.MathUtils.clamp(event.movementY || 0, -120, 120);
      } else {
        if (!dragging.current) return;
        deltaX = THREE.MathUtils.clamp(event.clientX - lastX.current, -120, 120);
        deltaY = THREE.MathUtils.clamp(event.clientY - lastY.current, -120, 120);
        lastX.current = event.clientX;
        lastY.current = event.clientY;
      }

      const sens = aimAssistLockedRef.current
        ? MOUSE_SENSITIVITY * 0.52
        : MOUSE_SENSITIVITY;
      yawTarget.current -= deltaX * sens;
      pitchTarget.current = THREE.MathUtils.clamp(
        pitchTarget.current + deltaY * sens,
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
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("blur", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("dblclick", onDoubleClick);
      element.removeEventListener("wheel", onWheel);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("blur", onPointerUp);

      if (pointerLocked.current && document.exitPointerLock) {
        document.exitPointerLock();
      }

      pointerLocked.current = false;
      dragging.current = false;
    };
  }, [gl, enabled, isCharacterMode]);

  useFrame((_, rawDelta) => {
    if (!enabled) return;
    const target = activeTargetRef?.current;
    if (!target) return;

    const dt = Math.min(rawDelta, 0.05);
    const modeKey = isCharacterMode ? "character" : `car-${cameraMode}`;

    if (previousMode.current !== modeKey) {
      previousMode.current = modeKey;

      _charEyeOffset.set(0, isCharacterMode ? 1.3 : 0.9, 0);
      currentLook.current.copy(target.position).add(_charEyeOffset);

      if (isCharacterMode) {
        const behindYaw = target.rotation.y + Math.PI;
        yaw.current = behindYaw;
        yawTarget.current = behindYaw;

        pitch.current = 0.18;
        pitchTarget.current = 0.18;
      }
    }

    if (isCharacterMode) {
      const sensFactor = aimAssistLockedRef.current ? 0.52 : 1.0;
      if (remoteInputRef?.current) {
        const rawDX = Number(remoteInputRef.current.lookDeltaX) || 0;
        const rawDY = Number(remoteInputRef.current.lookDeltaY) || 0;
        // Always reset deltas immediately so they are strictly single-frame impulses
        remoteInputRef.current.lookDeltaX = 0;
        remoteInputRef.current.lookDeltaY = 0;

        const swipeDX = THREE.MathUtils.clamp(rawDX, -0.25, 0.25);
        const swipeDY = THREE.MathUtils.clamp(rawDY, -0.25, 0.25);
        if (swipeDX !== 0 || swipeDY !== 0) {
          yawTarget.current -= swipeDX * sensFactor;
          pitchTarget.current = THREE.MathUtils.clamp(
            pitchTarget.current + swipeDY * sensFactor,
            MIN_PITCH,
            MAX_PITCH,
          );
        }
      }

      const remoteLookX = remoteInputRef?.current?.lookX || 0;
      const remoteLookY = remoteInputRef?.current?.lookY || 0;
      if (Math.abs(remoteLookX) > 0.04 || Math.abs(remoteLookY) > 0.04) {
        yawTarget.current -= remoteLookX * REMOTE_LOOK_SPEED * dt * sensFactor;
        pitchTarget.current = THREE.MathUtils.clamp(
          pitchTarget.current - remoteLookY * REMOTE_LOOK_SPEED * 0.7 * dt * sensFactor,
          MIN_PITCH,
          MAX_PITCH,
        );
      }

      const yawAlpha = 1 - Math.exp(-ORBIT_DAMP * dt);
      yaw.current += (yawTarget.current - yaw.current) * yawAlpha;
      pitch.current += (pitchTarget.current - pitch.current) * yawAlpha;

      if (orbitYawRef) orbitYawRef.current = yaw.current;
      if (orbitPitchRef) orbitPitchRef.current = pitch.current;

      const targetFov = isAiming ? 30 : 44;
      if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(
          camera.fov,
          targetFov,
          1 - Math.exp(-14 * dt),
        );
        camera.updateProjectionMatrix();
      }

      const distance = isAiming ? 2.35 : CHARACTER_CAMERA_DISTANCE;
      const shoulderOffset = isAiming ? 0.62 : isArmed ? 0.45 : 0;
      const horizontal = Math.cos(pitch.current) * distance;
      const vertical = Math.sin(pitch.current) * distance;

      const rightX = Math.cos(yaw.current) * shoulderOffset;
      const rightZ = -Math.sin(yaw.current) * shoulderOffset;

      const cameraX =
        target.position.x + Math.sin(yaw.current) * horizontal + rightX;
      const cameraZ =
        target.position.z + Math.cos(yaw.current) * horizontal + rightZ;
      const cameraY = target.position.y + CHARACTER_CAMERA_HEIGHT + vertical;

      desiredPosition.current.set(cameraX, cameraY, cameraZ);
      camera.position.lerp(desiredPosition.current, 1 - Math.exp(-14 * dt));

      const lookForwardDist = isAiming ? 24 : 8;
      const forwardX = -Math.sin(yaw.current) * Math.cos(pitch.current);
      const forwardY = -Math.sin(pitch.current);
      const forwardZ = -Math.cos(yaw.current) * Math.cos(pitch.current);

      if (isArmed || isAiming) {
        lookTarget.current.set(
          target.position.x + rightX + forwardX * lookForwardDist,
          target.position.y + 1.42 + forwardY * lookForwardDist,
          target.position.z + rightZ + forwardZ * lookForwardDist,
        );
      } else {
        _charEyeOffset.set(0, 1.35, 0);
        lookTarget.current.copy(target.position).add(_charEyeOffset);
      }

      currentLook.current.lerp(lookTarget.current, 1 - Math.exp(-18 * dt));
      camera.lookAt(currentLook.current);
      return;
    }

    // Restore car camera FOV
    if (Math.abs(camera.fov - camPreset.fov) > 0.1) {
      camera.fov = THREE.MathUtils.lerp(
        camera.fov,
        camPreset.fov,
        1 - Math.exp(-12 * dt),
      );
      camera.updateProjectionMatrix();
    }

    const phys = physicsStateRef?.current || {
      vx: 0,
      vy: 0,
      steering: 0,
      boost: false,
    };

    const carYaw = target.rotation.y;

    if (cameraMode === "hood") {
      _offsetVec
        .set(camPreset.offset[0], camPreset.offset[1], camPreset.offset[2])
        .applyAxisAngle(_upAxis, carYaw);

      camera.position.copy(target.position).add(_offsetVec);

      _lookVec
        .set(12, camPreset.lookY, -phys.steering * 3)
        .applyAxisAngle(_upAxis, carYaw);

      lookTarget.current.copy(target.position).add(_lookVec);
      camera.lookAt(lookTarget.current);
      return;
    }

    const driftSwing = THREE.MathUtils.clamp(phys.vy * 0.14, -1.6, 1.6);
    const speedPullback = THREE.MathUtils.clamp(
      Math.abs(phys.vx) * 0.035,
      0,
      1.4,
    );

    _offsetVec
      .set(
        camPreset.offset[0] - speedPullback,
        camPreset.offset[1],
        camPreset.offset[2] + driftSwing,
      )
      .applyAxisAngle(_upAxis, carYaw);

    desiredPosition.current.copy(target.position).add(_offsetVec);
    camera.position.lerp(desiredPosition.current, 1 - Math.exp(-6.5 * dt));

    _lookVec
      .set(2.2, camPreset.lookY, -phys.steering * 1.1)
      .applyAxisAngle(_upAxis, carYaw);

    lookTarget.current.copy(target.position).add(_lookVec);
    currentLook.current.lerp(lookTarget.current, 1 - Math.exp(-10 * dt));
    camera.lookAt(currentLook.current);
  });

  return null;
}
