export const SCENE_PRESETS = {
  track: {
    label: "Proving Ground",
    bg: "#0b111b",
    fog: ["#0b111b", 28, 165],
    ambient: 0.85,
    hemiSky: "#dceaff",
    hemiGround: "#182232",
    dirIntensity: 3.4,
    dirColor: "#fff6e8",
    accentColor: "#2d79ff",
    groundColor: "#10161f",
    gridCell: "#1d2a3d",
    gridSection: "#2c4870",
  },
  night: {
    label: "Night Circuit",
    bg: "#04060b",
    fog: ["#04060b", 20, 135],
    ambient: 0.42,
    hemiSky: "#5a9cff",
    hemiGround: "#080b12",
    dirIntensity: 1.9,
    dirColor: "#8ab8ff",
    accentColor: "#ff2a5f",
    groundColor: "#090d14",
    gridCell: "#141d2e",
    gridSection: "#00d2ff",
  },
  studio: {
    label: "M Studio",
    bg: "#090d14",
    fog: ["#090d14", 24, 120],
    ambient: 0.7,
    hemiSky: "#dceaff",
    hemiGround: "#18202b",
    dirIntensity: 3.1,
    dirColor: "#ffffff",
    accentColor: "#2d79ff",
    groundColor: "#111821",
    gridCell: "#192330",
    gridSection: "#2b3e57",
  },
};

export const CAMERA_MODES = [
  {
    id: "chase",
    label: "Chase Cam",
    offset: [-7.4, 2.5, 0],
    lookY: 0.95,
    fov: 44,
  },
  {
    id: "dynamic",
    label: "Action Cam",
    offset: [-5.8, 1.95, 0],
    lookY: 0.85,
    fov: 50,
  },
  {
    id: "hood",
    label: "Hood Cam",
    offset: [0.35, 1.36, 0],
    lookY: 1.15,
    fov: 58,
  },
];

export const MAX_TILT_DEG = 26;
export const TILT_DEADZONE_DEG = 1.0;
export const MAX_WHEEL_ROTATION_DEG = 135;

export const INITIAL_TELEMETRY = {
  speed: 0,
  rpm: 850,
  gear: "N",
  drifting: false,
  driftAngle: 0,
  boost: false,
  steerInput: 0,
};
