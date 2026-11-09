import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Tuning — Free-Fire-style movement                                 */
/* ------------------------------------------------------------------ */

const WALK_SPEED = 3.0;
const RUN_SPEED = 6.6;
const CROUCH_SPEED = 1.6;

const GROUND_ACCEL = 42; // units / s^2  (ramps up in ~0.15s)
const GROUND_DECEL = 55; // units / s^2  (stops in ~0.12s)
const AIR_ACCEL_MULT = 0.35; // air control fraction
const TURN_RATE = 18; // yaw damp rate (higher = snappier)

const GRAVITY = 22;
const JUMP_FORCE = 8.2;
const COYOTE_TIME = 0.12; // s — grace period after leaving ground
const JUMP_BUFFER = 0.12; // s — jump input remembered before landing
const DEFAULT_GROUND_Y = 0;

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
  "c",
  "control",
]);

const DOWN = new THREE.Vector3(0, -1, 0);
const UP = new THREE.Vector3(0, 1, 0);

export default function CharacterController({
  characterRef,
  collidersRef,
  enabled,
  emoteActive = false,
  cameraYawRef,
  onAnimationChange,
  onEmote,
  onPositionUpdate,
}) {
  const keys = useRef(Object.create(null));
  const velocity = useRef(new THREE.Vector3());
  const airborne = useRef(false);
  const jumpWasDown = useRef(false);
  const coyoteTimer = useRef(0);
  const jumpBufferTimer = useRef(0);
  const raycaster = useRef(new THREE.Raycaster());
  const enabledRef = useRef(enabled);
  const emoteRef = useRef(emoteActive);

  enabledRef.current = enabled;
  emoteRef.current = emoteActive;

  useEffect(() => {
    const normalize = (key) => {
      if (key === " ") return "space";
      const k = key.toLowerCase();
      if (k === "controlleft" || k === "controlright") return "control";
      return k;
    };

    const onKeyDown = (event) => {
      const key = normalize(event.key);
      if (!enabledRef.current) return;

      if (/^[1-6]$/.test(key)) {
        event.preventDefault();
        if (!emoteRef.current) onEmote?.(key);
        return;
      }

      if (CONTROL_KEYS.has(key)) {
        event.preventDefault();
        keys.current[key] = true;

        // Jump buffer: record input even if airborne
        if (key === "space" && !jumpWasDown.current) {
          jumpBufferTimer.current = JUMP_BUFFER;
        }
      }
    };

    const onKeyUp = (event) => {
      keys.current[normalize(event.key)] = false;
    };

    const clearKeys = () => {
      keys.current = Object.create(null);
      jumpWasDown.current = false;
      jumpBufferTimer.current = 0;
      coyoteTimer.current = 0;
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
      jumpWasDown.current = false;
      jumpBufferTimer.current = 0;
      coyoteTimer.current = 0;
    }
  }, [enabled]);

  useFrame((_, rawDelta) => {
    const character = characterRef?.current;
    if (!enabled || !character) return;

    const dt = Math.min(rawDelta, 0.05);
    const input = keys.current;

    // ---- Camera-relative input vector --------------------------------
    const rawForward =
      (input.w || input.arrowup ? 1 : 0) - (input.s || input.arrowdown ? 1 : 0);
    const rawStrafe =
      (input.d || input.arrowright ? 1 : 0) -
      (input.a || input.arrowleft ? 1 : 0);

    const camYaw = cameraYawRef?.current ?? 0;

    // Camera-relative: forward = camera forward, right = camera right
    const camForward = new THREE.Vector3(
      -Math.sin(camYaw),
      0,
      -Math.cos(camYaw),
    );
    const camRight = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw));

    const wish = new THREE.Vector3();
    wish.addScaledVector(camForward, rawForward);
    wish.addScaledVector(camRight, rawStrafe);

    const hasInput = wish.lengthSq() > 1e-6 && !emoteActive;
    if (hasInput) wish.normalize();

    const sprinting = Boolean(input.shift) && !input.c && !input.control;
    const crouching = Boolean(input.c || input.control);

    // ---- Speed selection --------------------------------------------
    let targetSpeed = WALK_SPEED;
    if (crouching) targetSpeed = CROUCH_SPEED;
    else if (sprinting) targetSpeed = RUN_SPEED;

    // ---- Horizontal velocity: accelerate / decelerate toward wish ---
    const v = velocity.current;
    const horizontal = new THREE.Vector3(v.x, 0, v.z);

    if (hasInput) {
      const wishVel = wish.clone().multiplyScalar(targetSpeed);
      const accel = airborne.current
        ? GROUND_ACCEL * AIR_ACCEL_MULT
        : GROUND_ACCEL;
      const delta = wishVel.clone().sub(horizontal);
      const maxStep = accel * dt;
      if (delta.length() > maxStep) delta.setLength(maxStep);
      horizontal.add(delta);
    } else {
      const speed = horizontal.length();
      if (speed > 0) {
        const decel = airborne.current
          ? GROUND_DECEL * AIR_ACCEL_MULT
          : GROUND_DECEL;
        const drop = Math.min(speed, decel * dt);
        horizontal.multiplyScalar((speed - drop) / speed);
      }
    }

    v.x = horizontal.x;
    v.z = horizontal.z;

    // ---- Face movement direction (unless emote) ---------------------
    if (hasInput) {
      const targetYaw = Math.atan2(wish.x, wish.z);
      const turnAlpha = 1 - Math.exp(-TURN_RATE * dt);
      let angleDelta = targetYaw - character.rotation.y;
      angleDelta = Math.atan2(Math.sin(angleDelta), Math.cos(angleDelta));
      character.rotation.y += angleDelta * turnAlpha;
    }

    // ---- Apply horizontal motion ------------------------------------
    character.position.x += v.x * dt;
    character.position.z += v.z * dt;

    // ---- Ground detection -------------------------------------------
    const colliderEntries = collidersRef?.current;
    let groundY = DEFAULT_GROUND_Y;
    let foundGround = false;

    if (colliderEntries?.ready && colliderEntries.length) {
      const meshes = colliderEntries.map((entry) => entry.mesh).filter(Boolean);
      const origin = new THREE.Vector3(
        character.position.x,
        character.position.y + 50,
        character.position.z,
      );
      raycaster.current.set(origin, DOWN);
      raycaster.current.far = 150;
      const hits = raycaster.current.intersectObjects(meshes, false);
      const groundHit = hits.find(
        (hit) => hit.face && hit.face.normal.y > -0.5,
      );
      if (groundHit) {
        groundY = groundHit.point.y;
        foundGround = true;
      }
    }

    const support = foundGround ? groundY : DEFAULT_GROUND_Y;
    const wasAirborne = airborne.current;
    const grounded = character.position.y <= support + 0.06;

    if (grounded) {
      character.position.y = support;
      v.y = 0;
      airborne.current = false;
      coyoteTimer.current = COYOTE_TIME;
    } else {
      airborne.current = true;
      coyoteTimer.current = Math.max(0, coyoteTimer.current - dt);
    }

    if (!wasAirborne && airborne.current) {
      // Just walked off a ledge — start coyote countdown if not already
      // handled by the else branch above. (No-op here; branch handles it.)
    }

    // ---- Jump: buffer + coyote -------------------------------------
    const jumpDown = Boolean(input.space) && !emoteActive;
    if (jumpDown && !jumpWasDown.current) {
      jumpBufferTimer.current = JUMP_BUFFER;
    }
    jumpWasDown.current = jumpDown;

    if (jumpBufferTimer.current > 0) {
      jumpBufferTimer.current = Math.max(0, jumpBufferTimer.current - dt);
    }
    if (coyoteTimer.current > 0) {
      coyoteTimer.current = Math.max(0, coyoteTimer.current - dt);
    }

    const canJump = !airborne.current || coyoteTimer.current > 0;
    if (jumpBufferTimer.current > 0 && canJump) {
      v.y = JUMP_FORCE;
      airborne.current = true;
      jumpBufferTimer.current = 0;
      coyoteTimer.current = 0;
    }

    if (airborne.current) {
      v.y -= GRAVITY * dt;
      character.position.y += v.y * dt;

      // Land
      if (foundGround && character.position.y <= groundY) {
        character.position.y = groundY;
        v.y = 0;
        airborne.current = false;
        coyoteTimer.current = COYOTE_TIME;
      }
    }

    // ---- Animation selection ----------------------------------------
    if (!emoteActive) {
      if (airborne.current) {
        onAnimationChange?.("jump");
      } else {
        const speed = Math.hypot(v.x, v.z);
        if (speed < 0.3) onAnimationChange?.("idle");
        else if (sprinting) onAnimationChange?.("run");
        else onAnimationChange?.("walk");
      }
    }

    onPositionUpdate?.(character.position);
  });

  return null;
}
