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
        position={[24, 48, 22]}
        intensity={preset.dirIntensity}
        color={preset.dirColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0004}
      />
    </>
  );
}
