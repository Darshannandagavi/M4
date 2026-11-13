import React, { useState } from "react";
import {
  HudExitSvg,
  HudResetSvg,
  HudSaveSvg,
  PresetCubeSvg,
} from "./FreeFireIcons";
import { HUD_ELEMENTS } from "../../utils/customHudConfig";
import "./FreeFireHUD.css";

export default function CustomHudEditorBar({
  activePreset = 1,
  selectedId = null,
  layout = {},
  onChangeLayout,
  onSwitchPreset,
  onResetLayout,
  onResetSelectedElement,
  onSaveLayout,
  onExitEdit,
}) {
  const [saveToast, setSaveToast] = useState("");

  const selectedDef = selectedId ? HUD_ELEMENTS[selectedId] : null;
  const currentItem = selectedId && layout[selectedId] ? layout[selectedId] : null;

  const handleTransparencyChange = (e) => {
    if (!selectedId || !currentItem) return;
    const val = Number(e.target.value);
    onChangeLayout?.(selectedId, {
      ...currentItem,
      opacity: val,
    });
  };

  const handleSizeChange = (e) => {
    if (!selectedId || !currentItem) return;
    const val = Number(e.target.value);
    onChangeLayout?.(selectedId, {
      ...currentItem,
      size: val,
    });
  };

  const handleSave = () => {
    const ok = onSaveLayout?.();
    if (ok !== false) {
      setSaveToast("CUSTOM HUD SAVED!");
      window.setTimeout(() => setSaveToast(""), 2200);
    }
  };

  return (
    <div className="ffh-hud-editor-overlay">
      {/* 1. TOP HEADER TOOLBAR (EXIT, RESET, SAVE) */}
      <div className="ffh-editor-top-bar ffh-interactive">
        <button
          type="button"
          className="ffh-editor-bar-btn exit"
          onClick={onExitEdit}
          title="Exit Custom HUD"
        >
          <HudExitSvg />
        </button>

        <button
          type="button"
          className="ffh-editor-bar-btn reset"
          onClick={onResetLayout}
          title="Reset All Controls to Default"
        >
          <HudResetSvg />
        </button>

        <button
          type="button"
          className="ffh-editor-bar-btn save"
          onClick={handleSave}
          title="Save Custom HUD"
        >
          <HudSaveSvg />
        </button>
      </div>

      {/* 2. FLOATING ELEMENT INSPECTOR & SLIDERS (WHEN ELEMENT IS SELECTED) */}
      {selectedDef && currentItem && (
        <div className="ffh-editor-slider-card ffh-interactive">
          <div className="ffh-slider-card-header">
            <span className="ffh-slider-target-name">{selectedDef.label}</span>
            <button
              type="button"
              className="ffh-slider-reset-elem-btn"
              onClick={() => onResetSelectedElement?.(selectedId)}
              title="Reset this element to default"
            >
              Reset
            </button>
          </div>

          <div className="ffh-slider-row">
            <div className="ffh-slider-label-group">
              <span className="ffh-slider-title">TRANSPARENCY</span>
              <span className="ffh-slider-val-badge">{currentItem.opacity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={currentItem.opacity}
              onChange={handleTransparencyChange}
              className="ffh-hud-range"
            />
          </div>

          <div className="ffh-slider-row">
            <div className="ffh-slider-label-group">
              <span className="ffh-slider-title">SIZE</span>
              <span className="ffh-slider-val-badge">{currentItem.size}%</span>
            </div>
            <input
              type="range"
              min={selectedDef.minSize || 40}
              max={selectedDef.maxSize || 180}
              step={1}
              value={currentItem.size}
              onChange={handleSizeChange}
              className="ffh-hud-range"
            />
          </div>
        </div>
      )}

      {/* 3. PRESET SWITCHER (PRESET 1 / PRESET 2 - MATCHES FREE FIRE BOX) */}
      <div className="ffh-editor-preset-wrapper ffh-interactive">
        <button
          type="button"
          className="ffh-editor-preset-pill"
          onClick={() => onSwitchPreset?.(activePreset === 1 ? 2 : 1)}
          title="Switch Custom HUD Preset"
        >
          <span className="ffh-preset-tag">PRESET</span>
          <div className="ffh-preset-cube">
            <PresetCubeSvg />
            <span className="ffh-preset-num">{activePreset}</span>
          </div>
          <svg className="ffh-preset-swap-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
          </svg>
        </button>
      </div>

      {/* 4. TOAST CONFIRMATION */}
      {saveToast && (
        <div className="ffh-editor-toast">
          <span>{saveToast}</span>
        </div>
      )}
    </div>
  );
}

