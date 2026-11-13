import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useAnimations, useFBX } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

import characterUrl from "../../assets/models/Characters/X Bot.fbx";

export const CHARACTER_SCALE = 0.01;

const animationContext = require.context(
  "../../assets/models/Characters",
  false,
  /\.fbx$/i,
);

const animationKeys = animationContext
  .keys()
  .filter((key) => !/x\s*bot\.fbx$/i.test(key));

const animationUrls = animationKeys.map((key) => animationContext(key));

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const ANIMATION_ALIASES = {
  idle: ["idle", "standingidle"],
  walk: ["walking", "walk"],
  run: ["running", "run"],
  sprint: ["sprint", "running", "run"],
  backward: ["walkingbackwards", "walkbackwards", "backwardwalking"],
  strafeLeft: ["leftstrafe", "strafingleft"],
  strafeRight: ["rightstrafe", "strafingright", "leftstrafe"],
  crouchIdle: ["crouchingidle", "crouchidle"],
  crouchWalk: ["crouchwalk", "crouchingwalk"],
  jump: ["jumping", "jump"],
  knockedOut: ["knockedout", "dying", "death"],
  wave: ["wave", "waving", "idle"],
  dance: ["macarenadance", "hiphopdancing", "breakdance", "crouchwalk"],
  salute: ["salute", "jumping"],
  celebrate: ["celebrate", "celebration", "victory", "jumping"],
  point: ["point", "pointing", "crouchingidle"],
  sit: ["sit", "sittingidle", "sitting", "crouchingidle"],
  drivingSeat: ["driving"],
  enterCar: ["enteringcar"],
  exitCar: ["exitingcar"],
};

const ONE_SHOT = new Set([
  "wave",
  "dance",
  "salute",
  "celebrate",
  "point",
  "sit",
  "enterCar",
  "exitCar",
  "knockedOut",
]);

const MISSING_CLIP_FALLBACK_MS = 650;

function stripRootMotion(clip) {
  clip.tracks.forEach((track) => {
    if (/hips\.position$/i.test(track.name)) {
      const values = track.values;
      const baseX = values[0] || 0;
      const baseZ = values[2] || 0;
      for (let i = 0; i < values.length; i += 3) {
        values[i] = baseX;
        values[i + 2] = baseZ;
      }
    }
  });
  return clip;
}

const _gunGeoms = {
  grip: new THREE.BoxGeometry(0.038, 0.13, 0.046),
  triggerGuard: new THREE.BoxGeometry(0.024, 0.045, 0.055),
  trigger: new THREE.BoxGeometry(0.01, 0.025, 0.012),
  body: new THREE.BoxGeometry(0.048, 0.088, 0.32),
  stock: new THREE.BoxGeometry(0.04, 0.11, 0.22),
  mag: new THREE.BoxGeometry(0.036, 0.18, 0.065),
  handguard: new THREE.BoxGeometry(0.052, 0.075, 0.24),
  barrel: new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8),
  brake: new THREE.CylinderGeometry(0.018, 0.018, 0.05, 8),
  topRail: new THREE.BoxGeometry(0.032, 0.015, 0.26),
  scope: new THREE.BoxGeometry(0.042, 0.045, 0.11),
  opticLens: new THREE.CylinderGeometry(0.016, 0.016, 0.008, 12),
  flashCore: new THREE.SphereGeometry(0.05, 6, 6),
  flashSpike: new THREE.ConeGeometry(0.04, 0.18, 5),
};

// Reusable math objects for procedural 2-bone IK (zero runtime GC allocation)
const _tempTarget = new THREE.Vector3();
const _tempElbow = new THREE.Vector3();
const _tempHand = new THREE.Vector3();
const _tempShoulder = new THREE.Vector3();
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _tempParentQuat = new THREE.Quaternion();
const _tempBoneQuat = new THREE.Quaternion();

const _gunSharedMats = {
  darkMetal: new THREE.MeshStandardMaterial({
    color: "#161c26",
    metalness: 0.88,
    roughness: 0.24,
  }),
  darkPolymer: new THREE.MeshStandardMaterial({
    color: "#0a0e16",
    roughness: 0.72,
    metalness: 0.15,
  }),
  opticMat: new THREE.MeshStandardMaterial({
    color: "#00d2ff",
    roughness: 0.12,
    metalness: 0.9,
    emissive: "#00d2ff",
    emissiveIntensity: 0.85,
  }),
};

function buildGunMesh() {
  const group = new THREE.Group();
  group.name = "EQUIPPED_WEAPON_GROUP";
  // Scaled in Mixamo centimeter space (since character root has 0.01 scale)
  group.scale.setScalar(100);

  // Precision alignment on mixamorig:RightHand so grip sits naturally inside the curled palm
  group.position.set(0.5, 9.5, 3.2);
  group.rotation.set(-0.62, 1.32, -0.62);

  const { darkMetal, darkPolymer, opticMat } = _gunSharedMats;
  const accentMat = new THREE.MeshStandardMaterial({
    color: "#2d79ff",
    metalness: 0.75,
    roughness: 0.25,
    emissive: "#09245a",
    emissiveIntensity: 0.45,
  });
  const muzzleFlashMat = new THREE.MeshBasicMaterial({
    color: "#ffc83b",
    transparent: true,
    opacity: 0,
  });

  // 1. Pistol Grip (centered around local origin so right hand curls directly around it)
  const grip = new THREE.Mesh(_gunGeoms.grip, darkPolymer);
  grip.position.set(0, -0.04, -0.02);
  grip.rotation.x = -0.28;
  group.add(grip);

  // 2. Trigger Guard & Trigger
  const triggerGuard = new THREE.Mesh(_gunGeoms.triggerGuard, darkMetal);
  triggerGuard.position.set(0, -0.015, 0.045);
  group.add(triggerGuard);

  const trigger = new THREE.Mesh(_gunGeoms.trigger, accentMat);
  trigger.position.set(0, -0.01, 0.04);
  trigger.rotation.x = 0.2;
  group.add(trigger);

  // 3. Lower & Upper Receiver Body
  const body = new THREE.Mesh(_gunGeoms.body, darkMetal);
  body.position.set(0, 0.048, 0.04);
  group.add(body);

  // 4. Tactical Shoulder Stock
  const stock = new THREE.Mesh(_gunGeoms.stock, darkPolymer);
  stock.position.set(0, 0.03, -0.22);
  group.add(stock);

  // 5. Magazine (Curved Banana Mag inserted in front of trigger)
  const mag = new THREE.Mesh(_gunGeoms.mag, accentMat);
  mag.position.set(0, -0.065, 0.12);
  mag.rotation.x = 0.22;
  group.add(mag);

  // 6. Tactical Handguard (Where Left Hand firmly supports and cradles the rifle)
  const handguard = new THREE.Mesh(_gunGeoms.handguard, darkPolymer);
  handguard.position.set(0, 0.048, 0.28);
  group.add(handguard);

  // 7. Barrel
  const barrel = new THREE.Mesh(_gunGeoms.barrel, darkMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.048, 0.44);
  group.add(barrel);

  // 8. Muzzle Brake
  const brake = new THREE.Mesh(_gunGeoms.brake, accentMat);
  brake.rotation.x = Math.PI / 2;
  brake.position.set(0, 0.048, 0.61);
  group.add(brake);

  // 9. Picatinny Top Rail & Holographic Optic Sight
  const topRail = new THREE.Mesh(_gunGeoms.topRail, darkMetal);
  topRail.position.set(0, 0.098, 0.08);
  group.add(topRail);

  const scope = new THREE.Mesh(_gunGeoms.scope, darkPolymer);
  scope.position.set(0, 0.125, 0.07);
  group.add(scope);

  const opticLens = new THREE.Mesh(_gunGeoms.opticLens, opticMat);
  opticLens.rotation.x = Math.PI / 2;
  opticLens.position.set(0, 0.125, 0.12);
  group.add(opticLens);

  // 10. Dynamic Muzzle Flash (Multi-pointed star)
  const flashGroup = new THREE.Group();
  flashGroup.position.set(0, 0.048, 0.65);
  flashGroup.name = "MUZZLE_FLASH";

  const flashCore = new THREE.Mesh(_gunGeoms.flashCore, muzzleFlashMat);
  flashGroup.add(flashCore);

  const flashSpike = new THREE.Mesh(_gunGeoms.flashSpike, muzzleFlashMat);
  flashSpike.rotation.x = -Math.PI / 2;
  flashGroup.add(flashSpike);

  group.add(flashGroup);

  group.userData = {
    accentMat,
    muzzleFlashMat,
    barrel,
    mag,
    handguard,
    flashGroup,
    disposables: [accentMat, muzzleFlashMat],
  };
  return group;
}

const CharacterModel = forwardRef(function CharacterModel(
  {
    animation = "idle",
    visible = true,
    weaponId = "fist",
    aiming = false,
    firing = false,
    aimPitch = 0,
    bodyColor = null,
    onAnimationFinished,
    onAnimationProgress,
  },
  forwardedRef,
) {
  const sourceCharacter = useFBX(characterUrl);

  const character = useMemo(
    () => cloneSkeleton(sourceCharacter),
    [sourceCharacter],
  );

  const bonesRef = useMemo(() => ({}), []);
  const gunGroupRef = useRef(null);
  const activeAnimationRef = useRef(null);

  const animationModels = useLoader(FBXLoader, animationUrls);

  const clips = useMemo(() => {
    const output = [];

    animationModels.forEach((fbx, index) => {
      const filePath = animationKeys[index];
      const fileName = filePath
        .split("/")
        .pop()
        .replace(/\.fbx$/i, "");

      const sourceClip = fbx.animations?.[0];
      if (!sourceClip) return;

      const clip = stripRootMotion(sourceClip.clone());
      clip.name = normalize(fileName);
      output.push(clip);
    });

    return output;
  }, [animationModels]);

  const { actions, mixer } = useAnimations(clips, forwardedRef);

  useEffect(() => {
    Object.keys(bonesRef).forEach((k) => delete bonesRef[k]);
    gunGroupRef.current = null;
    const clonedMatDisposables = [];
    const allowCastShadow = !bodyColor;

    // Prioritize primary surface skeleton bones so child joint bones do not override them
    const surfaceMesh = character.getObjectByName("Beta_Surface");
    if (surfaceMesh?.skeleton?.bones) {
      surfaceMesh.skeleton.bones.forEach((bone) => {
        const cleanKey = bone.name.replace(/^mixamorig:?/i, "");
        if (!bonesRef[cleanKey]) {
          bonesRef[cleanKey] = bone;
        }
      });
    }

    character.traverse((node) => {
      if (node.isBone) {
        const cleanKey = node.name.replace(/^mixamorig:?/i, "");
        if (!bonesRef[cleanKey]) {
          bonesRef[cleanKey] = node;
        }
      }
      if (!node.isMesh) return;

      node.castShadow = allowCastShadow;
      node.receiveShadow = true;
      node.frustumCulled = false;

      if (node.material) {
        const clonedMaterials = (
          Array.isArray(node.material) ? node.material : [node.material]
        ).map((mat) => {
          if (!mat) return mat;
          const cloned = mat.clone();
          cloned.side = THREE.FrontSide;
          if (bodyColor && cloned.color) {
            cloned.color.set(bodyColor);
          }
          cloned.needsUpdate = true;
          clonedMatDisposables.push(cloned);
          return cloned;
        });

        node.material = Array.isArray(node.material)
          ? clonedMaterials
          : clonedMaterials[0];
      }
    });

    const rightHand = bonesRef.RightHand;
    if (rightHand) {
      const gun = buildGunMesh();
      rightHand.add(gun);
      gunGroupRef.current = gun;
    }

    return () => {
      const gun = gunGroupRef.current;
      if (gun) {
        if (gun.parent) gun.parent.remove(gun);
        const gunDisposables = gun.userData?.disposables;
        if (gunDisposables) {
          gunDisposables.forEach((m) => m?.dispose());
        }
      }
      clonedMatDisposables.forEach((m) => m?.dispose());
      gunGroupRef.current = null;
    };
  }, [character, bonesRef, bodyColor]);

  useEffect(() => {
    character.rotation.set(0, 0, 0);
  }, [character]);

  useEffect(() => {
    const aliases = ANIMATION_ALIASES[animation] || [normalize(animation)];

    let action = null;

    for (const alias of aliases) {
      if (actions[alias]) {
        action = actions[alias];
        break;
      }
    }

    Object.values(actions).forEach((candidate) => {
      if (candidate && candidate !== action) {
        candidate.fadeOut(0.15);
      }
    });

    if (!action) {
      if (ONE_SHOT.has(animation)) {
        const timer = window.setTimeout(() => {
          onAnimationFinished?.(animation);
        }, MISSING_CLIP_FALLBACK_MS);

        return () => window.clearTimeout(timer);
      }
      return undefined;
    }

    const oneShot = ONE_SHOT.has(animation);

    action.reset();
    action.enabled = true;
    action.paused = false;
    action.clampWhenFinished = oneShot;
    action.timeScale = 1;

    action.setLoop(
      oneShot ? THREE.LoopOnce : THREE.LoopRepeat,
      oneShot ? 1 : Infinity,
    );

    const handleFinished = (event) => {
      if (event.action !== action) return;
      onAnimationFinished?.(animation);
    };

    if (oneShot) {
      mixer.addEventListener("finished", handleFinished);
    }

    activeAnimationRef.current = { animation, action };
    onAnimationProgress?.(animation, 0);
    action.fadeIn(0.2).play();

    return () => {
      if (activeAnimationRef.current?.action === action) {
        activeAnimationRef.current = null;
      }
      if (oneShot) {
        mixer.removeEventListener("finished", handleFinished);
      }
      action.fadeOut(0.15);
    };
  }, [animation, actions, mixer, onAnimationFinished, onAnimationProgress]);

  useFrame((state) => {
    const active = activeAnimationRef.current;
    if (active && ONE_SHOT.has(active.animation) && onAnimationProgress) {
      const duration = active.action.getClip().duration;
      if (duration && duration > 0) {
        const progress = THREE.MathUtils.clamp(
          active.action.time / duration,
          0,
          1,
        );
        onAnimationProgress(active.animation, progress);
      }
    }

    // Update equipped weapon appearance and procedural upper-body aiming pose
    const gun = gunGroupRef.current;
    const isArmed =
      weaponId &&
      weaponId !== "fist" &&
      animation !== "drivingSeat" &&
      animation !== "enterCar" &&
      animation !== "exitCar" &&
      animation !== "knockedOut";

    if (gun) {
      gun.visible = Boolean(isArmed);
      if (gun.userData?.accentMat) {
        gun.userData.accentMat.color.set(
          weaponId === "mp40" ? "#ff9f0a" : "#2d79ff",
        );
      }
      if (gun.userData?.barrel) {
        gun.userData.barrel.scale.set(1, 1, weaponId === "mp40" ? 0.62 : 1);
      }
      if (gun.userData?.mag) {
        gun.userData.mag.scale.set(
          weaponId === "mp40" ? 0.8 : 1,
          weaponId === "mp40" ? 1.25 : 1,
          weaponId === "mp40" ? 0.65 : 1,
        );
      }
      if (gun.userData?.flashGroup && gun.userData?.muzzleFlashMat) {
        if (firing) {
          gun.userData.flashGroup.scale.setScalar(
            1.0 + Math.sin(state.clock.elapsedTime * 75) * 0.35,
          );
          gun.userData.muzzleFlashMat.opacity = 0.95;
        } else {
          gun.userData.flashGroup.scale.setScalar(0.001);
          gun.userData.muzzleFlashMat.opacity = 0;
        }
      }
    }

    if (isArmed) {
      const spine = bonesRef.Spine1 || bonesRef.Spine;
      const spine2 = bonesRef.Spine2;
      const rightArm = bonesRef.RightArm;
      const rightForeArm = bonesRef.RightForeArm;
      const rightHand = bonesRef.RightHand;
      const leftArm = bonesRef.LeftArm;
      const leftForeArm = bonesRef.LeftForeArm;
      const leftHand = bonesRef.LeftHand;

      const isTwoHanded =
        weaponId === "m4a1" ||
        weaponId === "ak47" ||
        weaponId === "awm" ||
        weaponId === "mp40";

      const recoilKick = firing
        ? Math.sin(state.clock.elapsedTime * 65) * 0.045 + 0.02
        : 0;

      if (isTwoHanded) {
        if (aiming || firing) {
          // --- ADS / SCOPE AIMING & COMBAT FIRING STANCE (TWO-HANDED) ---
          if (spine) {
            spine.rotation.x += THREE.MathUtils.clamp(-aimPitch * 0.45, -0.4, 0.4);
            spine.rotation.y = 0.12;
          }
          if (spine2) {
            spine2.rotation.x += THREE.MathUtils.clamp(-aimPitch * 0.25, -0.25, 0.25);
          }

          if (rightArm) {
            rightArm.rotation.set(
              0.8 - aimPitch * 0.65 - recoilKick,
              -0.3,
              -0.4,
            );
          }
          if (rightForeArm) {
            rightForeArm.rotation.set(0, 0, -0.8);
          }
          if (rightHand) {
            rightHand.rotation.set(0, 0.2, 0);
          }

          // Left Arm Two-Handed IK Solver (Snap Left Hand firmly to Handguard)
          const handguard = gun?.userData?.handguard;
          if (handguard && leftArm && leftForeArm && leftHand) {
            character.updateMatrixWorld(true);
            _tempTarget.set(0, 0, 0);
            handguard.getWorldPosition(_tempTarget);

            leftArm.rotation.set(1.1 - aimPitch * 0.5, 0.35, 0.5);
            leftForeArm.rotation.set(0, 0, 1.1);

            for (let iter = 0; iter < 3; iter++) {
              character.updateMatrixWorld(true);
              leftForeArm.getWorldPosition(_tempElbow);
              leftHand.getWorldPosition(_tempHand);

              _v1.subVectors(_tempHand, _tempElbow).normalize();
              _v2.subVectors(_tempTarget, _tempElbow).normalize();
              _q1.setFromUnitVectors(_v1, _v2);

              leftForeArm.parent.getWorldQuaternion(_tempParentQuat);
              leftForeArm.getWorldQuaternion(_tempBoneQuat);
              leftForeArm.quaternion.copy(
                _tempParentQuat.invert().multiply(_q1.multiply(_tempBoneQuat)),
              );

              character.updateMatrixWorld(true);
              leftArm.getWorldPosition(_tempShoulder);
              leftHand.getWorldPosition(_tempHand);

              _v1.subVectors(_tempHand, _tempShoulder).normalize();
              _v2.subVectors(_tempTarget, _tempShoulder).normalize();
              _q2.setFromUnitVectors(_v1, _v2);

              leftArm.parent.getWorldQuaternion(_tempParentQuat);
              leftArm.getWorldQuaternion(_tempBoneQuat);
              leftArm.quaternion.copy(
                _tempParentQuat.invert().multiply(_q2.multiply(_tempBoneQuat)),
              );
            }

            leftHand.rotation.set(0.15, -0.25, 0.2);
          }
        } else {
          // --- TACTICAL READY / TWO-HANDED COMBAT CARRY (Locomotion & Idle) ---
          if (spine) {
            spine.rotation.y = 0.08;
          }
          if (spine2) {
            spine2.rotation.y = 0.05;
          }

          if (rightArm) {
            rightArm.rotation.set(0.9, -0.35, -0.3);
          }
          if (rightForeArm) {
            rightForeArm.rotation.set(0, 0, -1.1);
          }
          if (rightHand) {
            rightHand.rotation.set(0, 0.1, 0.1);
          }

          // Left Arm Two-Handed IK Solver (Snap Left Hand firmly to Handguard)
          const handguard = gun?.userData?.handguard;
          if (handguard && leftArm && leftForeArm && leftHand) {
            character.updateMatrixWorld(true);
            _tempTarget.set(0, 0, 0);
            handguard.getWorldPosition(_tempTarget);

            leftArm.rotation.set(1.2, 0.4, 0.6);
            leftForeArm.rotation.set(0, 0, 1.3);

            for (let iter = 0; iter < 3; iter++) {
              character.updateMatrixWorld(true);
              leftForeArm.getWorldPosition(_tempElbow);
              leftHand.getWorldPosition(_tempHand);

              _v1.subVectors(_tempHand, _tempElbow).normalize();
              _v2.subVectors(_tempTarget, _tempElbow).normalize();
              _q1.setFromUnitVectors(_v1, _v2);

              leftForeArm.parent.getWorldQuaternion(_tempParentQuat);
              leftForeArm.getWorldQuaternion(_tempBoneQuat);
              leftForeArm.quaternion.copy(
                _tempParentQuat.invert().multiply(_q1.multiply(_tempBoneQuat)),
              );

              character.updateMatrixWorld(true);
              leftArm.getWorldPosition(_tempShoulder);
              leftHand.getWorldPosition(_tempHand);

              _v1.subVectors(_tempHand, _tempShoulder).normalize();
              _v2.subVectors(_tempTarget, _tempShoulder).normalize();
              _q2.setFromUnitVectors(_v1, _v2);

              leftArm.parent.getWorldQuaternion(_tempParentQuat);
              leftArm.getWorldQuaternion(_tempBoneQuat);
              leftArm.quaternion.copy(
                _tempParentQuat.invert().multiply(_q2.multiply(_tempBoneQuat)),
              );
            }

            leftHand.rotation.set(0.1, -0.3, 0.2);
          }
        }
      } else {
        // --- HANDGUN / PISTOL (DESERT EAGLE) ---
        if (aiming || firing) {
          if (spine) {
            spine.rotation.x += THREE.MathUtils.clamp(-aimPitch * 0.4, -0.35, 0.35);
          }
          if (rightArm) {
            rightArm.rotation.set(0.85 - aimPitch * 0.6 - recoilKick, -0.2, -0.3);
          }
          if (rightForeArm) {
            rightForeArm.rotation.set(0, 0, -0.7);
          }
          if (rightHand) {
            rightHand.rotation.set(0, 0.2, 0);
          }
          // Weaver supporting left hand for pistol
          if (leftArm) {
            leftArm.rotation.set(0.95 - aimPitch * 0.5, 0.25, 0.4);
          }
          if (leftForeArm) {
            leftForeArm.rotation.set(0, 0, 0.9);
          }
          if (leftHand) {
            leftHand.rotation.set(0.2, -0.2, 0.1);
          }
        } else {
          // Low ready handgun
          if (rightArm) {
            rightArm.rotation.set(1.0, -0.2, -0.15);
          }
          if (rightForeArm) {
            rightForeArm.rotation.set(0, 0, -0.6);
          }
        }
      }
    } else if (
      weaponId === "fist" &&
      (aiming || firing) &&
      animation !== "drivingSeat" &&
      animation !== "enterCar" &&
      animation !== "exitCar" &&
      animation !== "knockedOut"
    ) {
      // --- FIST MELEE PUNCH STRIKE ANIMATION ---
      const spine = bonesRef.Spine1 || bonesRef.Spine;
      const rightArm = bonesRef.RightArm;
      const rightForeArm = bonesRef.RightForeArm;
      const rightHand = bonesRef.RightHand;
      const leftArm = bonesRef.LeftArm;
      const leftForeArm = bonesRef.LeftForeArm;
      const leftHand = bonesRef.LeftHand;

      // Fast, alternating dynamic boxer jab
      const punchCycle = Math.sin(state.clock.elapsedTime * 22);
      if (spine) {
        spine.rotation.y = punchCycle * 0.22;
        spine.rotation.x = THREE.MathUtils.clamp(-aimPitch * 0.35, -0.3, 0.3);
      }

      const rightJab = Math.max(0, punchCycle);
      const leftJab = Math.max(0, -punchCycle);

      if (rightArm) {
        rightArm.rotation.set(
          THREE.MathUtils.lerp(0.8, 1.45 - aimPitch * 0.6, rightJab),
          THREE.MathUtils.lerp(-0.25, -0.05, rightJab),
          THREE.MathUtils.lerp(-0.35, -0.05, rightJab),
        );
      }
      if (rightForeArm) {
        rightForeArm.rotation.set(0, 0, THREE.MathUtils.lerp(-1.2, -0.15, rightJab));
      }
      if (rightHand) {
        rightHand.rotation.set(0, 0.35, 0);
      }

      if (leftArm) {
        leftArm.rotation.set(
          THREE.MathUtils.lerp(0.8, 1.45 - aimPitch * 0.6, leftJab),
          THREE.MathUtils.lerp(0.25, 0.05, leftJab),
          THREE.MathUtils.lerp(0.35, 0.05, leftJab),
        );
      }
      if (leftForeArm) {
        leftForeArm.rotation.set(0, 0, THREE.MathUtils.lerp(1.2, 0.15, leftJab));
      }
      if (leftHand) {
        leftHand.rotation.set(0, -0.35, 0);
      }
    }
  });

  useEffect(() => {
    return () => {
      mixer.stopAllAction();
    };
  }, [mixer]);

  return (
    <group ref={forwardedRef} scale={CHARACTER_SCALE} visible={visible}>
      <primitive object={character} />
    </group>
  );
});

export default CharacterModel;
