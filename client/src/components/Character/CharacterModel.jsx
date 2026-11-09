import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useAnimations, useFBX } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

import characterUrl from "../../assets/models/Characters/X Bot.fbx";

export const CHARACTER_SCALE = 0.01;

/* ------------------------------------------------------------------ */
/* Discover animation files                                           */
/* ------------------------------------------------------------------ */

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
]);

const MISSING_CLIP_FALLBACK_MS = 650;

/**
 * Mixamo FBX animations bake horizontal root motion into the Hips position track,
 * which makes the character mesh drift away from its collider and snap back.
 * Lock X and Z on the Hips position track to keep animations in-place.
 */
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

const CharacterModel = forwardRef(function CharacterModel(
  {
    animation = "idle",
    visible = true,
    steerValue = 0,
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
    character.traverse((node) => {
      if (node.isBone) {
        bonesRef[node.name] = node;
      }
      if (!node.isMesh) return;

      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;

      if (node.material) {
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];

        materials.forEach((material) => {
          if (!material) return;
          material.side = THREE.FrontSide;
          material.needsUpdate = true;
        });
      }
    });
  }, [character, bonesRef]);

  useEffect(() => {
    // Rotate the inner FBX model by +90 deg so local +X is forward (matching CarController),
    // or keep standard Mixamo +Z and let CharacterController align rotation.
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
      console.error(
        `[CharacterModel] Animation not found: ${animation}`,
        Object.keys(actions),
      );

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

    console.log("[Character Animation]", {
      requested: animation,
      selected: action.getClip().name,
      duration: action.getClip().duration,
      oneShot,
    });

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

  // Publish the live Mixamo clip progress for synchronized vehicle animation.
  useFrame(() => {
    const active = activeAnimationRef.current;
    if (!active) return;

    const duration = active.action.getClip().duration;
    if (!duration || duration <= 0) return;

    const progress = THREE.MathUtils.clamp(active.action.time / duration, 0, 1);

    onAnimationProgress?.(active.animation, progress);
  });

  // Apply seated driving posture when inside the car

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
