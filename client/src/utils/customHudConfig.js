/**
 * Free Fire inspired Custom HUD configuration & storage system.
 * Allows users to customize position (x, y %), size (scale %), and transparency (opacity %)
 * for every HUD control, with multi-preset support and persistent localStorage saving.
 */

export const HUD_ELEMENTS = {
  rightFire: {
    id: "rightFire",
    label: "Primary Fire Button",
    defaultX: 80,
    defaultY: 74,
    defaultSize: 110,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  leftFire: {
    id: "leftFire",
    label: "Left Fire Button",
    defaultX: 23,
    defaultY: 66,
    defaultSize: 100,
    defaultOpacity: 95,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  aimScope: {
    id: "aimScope",
    label: "Scope / ADS",
    defaultX: 88,
    defaultY: 62,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  jump: {
    id: "jump",
    label: "Jump Button",
    defaultX: 94,
    defaultY: 72,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "movement",
  },
  crouch: {
    id: "crouch",
    label: "Crouch Button",
    defaultX: 92,
    defaultY: 86,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "movement",
  },
  reload: {
    id: "reload",
    label: "Reload Button",
    defaultX: 81,
    defaultY: 90,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  switchWeapon: {
    id: "switchWeapon",
    label: "Quick Weapon Switch",
    defaultX: 23,
    defaultY: 82,
    defaultSize: 100,
    defaultOpacity: 95,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  joystick: {
    id: "joystick",
    label: "Movement Joystick",
    defaultX: 13,
    defaultY: 76,
    defaultSize: 100,
    defaultOpacity: 90,
    minSize: 50,
    maxSize: 160,
    category: "movement",
  },
  sprint: {
    id: "sprint",
    label: "Sprint Button",
    defaultX: 21,
    defaultY: 48,
    defaultSize: 100,
    defaultOpacity: 95,
    minSize: 40,
    maxSize: 180,
    category: "movement",
  },
  medkit: {
    id: "medkit",
    label: "Medkit Healer",
    defaultX: 46,
    defaultY: 91,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "utility",
  },
  backpack: {
    id: "backpack",
    label: "Backpack / Inventory",
    defaultX: 54,
    defaultY: 91,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "utility",
  },
  emotes: {
    id: "emotes",
    label: "Emotes Button",
    defaultX: 62,
    defaultY: 91,
    defaultSize: 95,
    defaultOpacity: 90,
    minSize: 40,
    maxSize: 180,
    category: "utility",
  },
  drive: {
    id: "drive",
    label: "Drive BMW Button",
    defaultX: 72,
    defaultY: 89,
    defaultSize: 105,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "vehicle",
  },
  minimap: {
    id: "minimap",
    label: "Minimap & Comms",
    defaultX: 9,
    defaultY: 15,
    defaultSize: 100,
    defaultOpacity: 95,
    minSize: 50,
    maxSize: 150,
    category: "info",
  },
  weaponCard: {
    id: "weaponCard",
    label: "Weapons & Ammo HUD",
    defaultX: 89,
    defaultY: 13,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 50,
    maxSize: 150,
    category: "info",
  },
  dropParachute: {
    id: "dropParachute",
    label: "Aircraft Eject / Drop",
    defaultX: 50,
    defaultY: 28,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 50,
    maxSize: 160,
    category: "utility",
  },
};

export function getDefaultHudLayout() {
  const layout = {};
  for (const [key, item] of Object.entries(HUD_ELEMENTS)) {
    layout[key] = {
      x: item.defaultX,
      y: item.defaultY,
      size: item.defaultSize,
      opacity: item.defaultOpacity,
    };
  }
  return layout;
}

const STORAGE_KEY_PREFIX = "ff_custom_hud_preset_";
const ACTIVE_PRESET_KEY = "ff_custom_hud_active_preset";

export function getActiveHudPresetIndex() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return 1;
    const val = Number(window.localStorage.getItem(ACTIVE_PRESET_KEY) || 1);
    return val === 2 ? 2 : 1;
  } catch {
    return 1;
  }
}

export function setActiveHudPresetIndex(index) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(ACTIVE_PRESET_KEY, String(index));
    }
  } catch {}
}

export function loadHudLayoutPreset(presetIndex = 1) {
  const defaults = getDefaultHudLayout();
  try {
    if (typeof window === "undefined" || !window.localStorage) return defaults;
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${presetIndex}`);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    const merged = { ...defaults };
    for (const [key, val] of Object.entries(parsed)) {
      if (merged[key] && typeof val === "object" && val !== null) {
        merged[key] = {
          x: typeof val.x === "number" ? Math.max(2, Math.min(98, val.x)) : merged[key].x,
          y: typeof val.y === "number" ? Math.max(2, Math.min(98, val.y)) : merged[key].y,
          size: typeof val.size === "number" ? Math.max(30, Math.min(220, val.size)) : merged[key].size,
          opacity: typeof val.opacity === "number" ? Math.max(10, Math.min(100, val.opacity)) : merged[key].opacity,
        };
      }
    }
    return merged;
  } catch (err) {
    console.warn("Failed to load HUD layout from localStorage:", err);
    return defaults;
  }
}

export function saveHudLayoutPreset(presetIndex = 1, layout) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${presetIndex}`, JSON.stringify(layout));
      return true;
    }
  } catch (err) {
    console.error("Failed to save HUD layout to localStorage:", err);
  }
  return false;
}

export function resetHudLayoutPreset(presetIndex = 1) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(`${STORAGE_KEY_PREFIX}${presetIndex}`);
    }
  } catch {}
  return getDefaultHudLayout();
}

