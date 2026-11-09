import React, { forwardRef, useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { useAnimations, useFBX } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

import characterUrl from "../../assets/models/Characters/X Bot.fbx";

export const CHARACTER_SCALE = 0.01;

// CRA's context loader discovers any Mixamo FBX files added to this folder.
// Keep X Bot.fbx as the character mesh; all other FBX files are animation clips.
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
  walk: ["walk", "walking"],
  run: ["run", "running"],
  jump: ["jump", "jumping"],
  wave: ["wave", "waving"],
  dance: ["dance", "hiphopdancing", "breakdance"],
  salute: ["salute"],
  celebrate: ["celebrate", "celebration", "victory"],
  point: ["point", "pointing"],
  sit: ["sit", "sittingidle", "sitting"],
  enterCar: ["entercar", "gettingintoacar", "enteringcar", "walk", "walking"],
  exitCar: ["exitcar", "gettingoutofacar", "exitingcar", "walk", "walking"],
};

const ONE_SHOT = new Set([
  "jump",
  "wave",
  "dance",
  "salute",
  "celebrate",
  "point",
  "sit",
  "enterCar",
  "exitCar",
]);

const CharacterModel = forwardRef(function CharacterModel(
  { animation = "idle", visible = true, onAnimationFinished },
  forwardedRef,
) {
  const sourceCharacter = useFBX(characterUrl);
  const character = useMemo(
    () => cloneSkeleton(sourceCharacter),
    [sourceCharacter],
  );
  const animationModels = useLoader(FBXLoader, animationUrls);

  const clips = useMemo(() => {
    const output = [];
    animationModels.forEach((fbx, index) => {
      const key = animationKeys[index];
      const fileName = key
        .split("/")
        .pop()
        .replace(/\.fbx$/i, "");
      const clip = fbx.animations?.[0];
      if (!clip) return;
      const cloned = clip.clone();
      cloned.name = normalize(fileName);
      output.push(cloned);
    });
    return output;
  }, [animationModels]);

  const { actions, mixer } = useAnimations(clips, forwardedRef);

  useEffect(() => {
    character.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;
    });
  }, [character]);

  useEffect(() => {
    const aliases = ANIMATION_ALIASES[animation] || [normalize(animation)];
    let action = null;
    for (const alias of aliases) {
      action = actions[alias];
      if (action) break;
    }

    // No matching clip: stop the previous action and leave the rig in its
    // authored rest pose rather than playing an unrelated animation.
    Object.values(actions).forEach((candidate) => {
      if (candidate && candidate !== action) candidate.fadeOut(0.18);
    });

    if (!action) return undefined;

    const oneShot = ONE_SHOT.has(animation);
    action.reset();
    action.enabled = true;
    action.clampWhenFinished = oneShot;
    action.setLoop(
      oneShot ? THREE.LoopOnce : THREE.LoopRepeat,
      oneShot ? 1 : Infinity,
    );
    action.fadeIn(0.18).play();

    let finishTimer;
    if (oneShot) {
      const duration = action.getClip().duration || 1.2;
      finishTimer = window.setTimeout(
        () => {
          onAnimationFinished?.(animation);
        },
        Math.max(350, duration * 1000),
      );
    }

    return () => {
      if (finishTimer) window.clearTimeout(finishTimer);
    };
  }, [animation, actions, onAnimationFinished]);

  useEffect(() => {
    return () => mixer.stopAllAction();
  }, [mixer]);

  return (
    <group ref={forwardedRef} scale={CHARACTER_SCALE} visible={visible}>
      <primitive object={character} />
    </group>
  );
});

export default CharacterModel;
