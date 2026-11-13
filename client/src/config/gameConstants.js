export const SCENE_PRESETS = {
  track: {
    label: "Bermuda Daylight",
    bg: "#69a2d8",
    fog: ["#82b4e2", 180, 780],
    ambient: 0.95,
    hemiSky: "#e6f2ff",
    hemiGround: "#28364a",
    dirIntensity: 3.1,
    dirColor: "#fff8eb",
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

export const MAP_PRESETS = {
  bermuda: {
    id: "bermuda",
    label: "Bermuda FF",
  },
  rainier: {
    id: "rainier",
    label: "Mt. Rainier",
  },
  cotedazur: {
    id: "cotedazur",
    label: "Côte d'Azur",
  },
};

export const WEAPONS = {
  m4a1: {
    id: "m4a1",
    name: "M4A1 RIFLE",
    category: "rifle",
    magSize: 30,
    reserveAmmo: 120,
    fireRate: 0.11,
    damage: 28,
    headshotDamage: 112,
    range: 140,
    recoilPitch: 0.014,
    spread: 0.008,
    reloadTime: 1.6,
    color: "#2d79ff",
  },
  ak47: {
    id: "ak47",
    name: "AK-47",
    category: "rifle",
    magSize: 30,
    reserveAmmo: 90,
    fireRate: 0.1,
    damage: 32,
    headshotDamage: 128,
    range: 120,
    recoilPitch: 0.022,
    spread: 0.012,
    reloadTime: 2.0,
    color: "#ff9f0a",
  },
  awm: {
    id: "awm",
    name: "AWM SNIPER",
    category: "sniper",
    magSize: 5,
    reserveAmmo: 20,
    fireRate: 1.5,
    damage: 90,
    headshotDamage: 360,
    range: 300,
    recoilPitch: 0.06,
    spread: 0.002,
    reloadTime: 3.2,
    color: "#55e6a0",
  },
  mp40: {
    id: "mp40",
    name: "MP40 SMG",
    category: "smg",
    magSize: 24,
    reserveAmmo: 96,
    fireRate: 0.075,
    damage: 22,
    headshotDamage: 88,
    range: 75,
    recoilPitch: 0.018,
    spread: 0.018,
    reloadTime: 1.3,
    color: "#ff9f0a",
  },
  deagle: {
    id: "deagle",
    name: "DESERT EAGLE",
    category: "pistol",
    magSize: 7,
    reserveAmmo: 35,
    fireRate: 0.35,
    damage: 48,
    headshotDamage: 192,
    range: 50,
    recoilPitch: 0.035,
    spread: 0.015,
    reloadTime: 1.8,
    color: "#c9a040",
  },
  fist: {
    id: "fist",
    name: "UNARMED",
    category: "melee",
    magSize: 0,
    reserveAmmo: 0,
    fireRate: 0.5,
    damage: 0,
    headshotDamage: 0,
    range: 0,
    recoilPitch: 0,
    spread: 0,
    reloadTime: 0,
    color: "#8fa2b8",
  },
};

export const WEAPON_ORDER = ["m4a1", "ak47", "awm", "mp40", "deagle", "fist"];

/* ------------------------------------------------------------------ */
/*  Shrinking Blue Zone (Free Fire Bermuda Safe Zone Stages)          */
/* ------------------------------------------------------------------ */
export const ZONE_CENTER = { x: 0, z: 0 };
export const ZONE_INITIAL_RADIUS = 88;
export const ZONE_Y = 0.8; // Bermuda ground elevation
export const ZONE_STAGES = [
  // { delay: wait seconds before shrinking, shrink: transition seconds, radius: target, dps: damage per second }
  { delay: 45, shrink: 25, radius: 58, dps: 2 },
  { delay: 35, shrink: 20, radius: 36, dps: 4 },
  { delay: 25, shrink: 18, radius: 18, dps: 8 },
  { delay: 20, shrink: 15, radius: 7, dps: 15 },
];

/* ------------------------------------------------------------------ */
/*  Loot Item Definitions                                             */
/* ------------------------------------------------------------------ */
export const LOOT_ITEMS = {
  weapon_m4a1: { type: "weapon", weaponId: "m4a1", label: "M4A1 Rifle", rarity: "rare", color: "#2d79ff" },
  weapon_ak47: { type: "weapon", weaponId: "ak47", label: "AK-47", rarity: "rare", color: "#ff9f0a" },
  weapon_awm: { type: "weapon", weaponId: "awm", label: "AWM Sniper", rarity: "legendary", color: "#55e6a0" },
  weapon_mp40: { type: "weapon", weaponId: "mp40", label: "MP40 SMG", rarity: "common", color: "#ff9f0a" },
  weapon_deagle: { type: "weapon", weaponId: "deagle", label: "Desert Eagle", rarity: "epic", color: "#c9a040" },
  ammo_rifle: { type: "ammo", ammoFor: ["m4a1", "ak47"], amount: 30, label: "Rifle Ammo ×30", color: "#ffd60a" },
  ammo_smg: { type: "ammo", ammoFor: ["mp40"], amount: 24, label: "SMG Ammo ×24", color: "#ffd60a" },
  ammo_sniper: { type: "ammo", ammoFor: ["awm"], amount: 10, label: "Sniper Ammo ×10", color: "#ffd60a" },
  ammo_pistol: { type: "ammo", ammoFor: ["deagle"], amount: 14, label: "Pistol Ammo ×14", color: "#ffd60a" },
  medkit: { type: "heal", healAmount: 75, label: "Medkit", rarity: "common", color: "#28cd41" },
  vest_1: { type: "armor", level: 1, protection: 25, label: "Lv.1 Vest", color: "#8fa2b8" },
  vest_2: { type: "armor", level: 2, protection: 50, label: "Lv.2 Vest", color: "#2d79ff" },
  vest_3: { type: "armor", level: 3, protection: 75, label: "Lv.3 Vest", color: "#ffd60a" },
  helmet_1: { type: "helmet", level: 1, protection: 20, label: "Lv.1 Helmet", color: "#8fa2b8" },
  helmet_2: { type: "helmet", level: 2, protection: 40, label: "Lv.2 Helmet", color: "#2d79ff" },
  helmet_3: { type: "helmet", level: 3, protection: 75, label: "Lv.3 Helmet", color: "#ffd60a" },
};

/** Weighted table for random loot spawning */
export const LOOT_SPAWN_TABLE = [
  { id: "weapon_m4a1", weight: 6 },
  { id: "weapon_ak47", weight: 5 },
  { id: "weapon_mp40", weight: 8 },
  { id: "weapon_deagle", weight: 6 },
  { id: "weapon_awm", weight: 2 },
  { id: "ammo_rifle", weight: 12 },
  { id: "ammo_smg", weight: 10 },
  { id: "ammo_sniper", weight: 4 },
  { id: "ammo_pistol", weight: 8 },
  { id: "medkit", weight: 10 },
  { id: "vest_1", weight: 5 },
  { id: "vest_2", weight: 3 },
  { id: "vest_3", weight: 1 },
  { id: "helmet_1", weight: 5 },
  { id: "helmet_2", weight: 3 },
  { id: "helmet_3", weight: 1 },
];

export const LOOT_SPAWN_COUNT = 36;
export const LOOT_PICKUP_RANGE = 3.2;

/* ------------------------------------------------------------------ */
/*  Aircraft Drop-in Settings                                         */
/* ------------------------------------------------------------------ */
export const AIRCRAFT_ALTITUDE = 42;
export const AIRCRAFT_SPEED = 16; // m/s
export const PARACHUTE_FALL_SPEED = 14;
export const PARACHUTE_LATERAL_SPEED = 12;

/* ------------------------------------------------------------------ */
/*  Camera & Controls                                                 */
/* ------------------------------------------------------------------ */
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
