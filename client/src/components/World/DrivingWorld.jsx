import React from "react";
import { SCENE_PRESETS } from "../../config/gameConstants";

export default function DrivingWorld({ presetKey }) {
  const preset = SCENE_PRESETS[presetKey] || SCENE_PRESETS.track;
  return (
    <>
      <color attach="background" args={[preset.bg]} />
      <fog attach="fog" args={preset.fog} />
      <ambientLight intensity={preset.ambient} />
      <hemisphereLight args={[preset.hemiSky, preset.hemiGround, 1.15]} />
      <directionalLight
        position={[14, 22, 16]}
        intensity={preset.dirIntensity}
        color={preset.dirColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
}
