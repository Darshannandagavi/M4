import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { SCENE_PRESETS } from "../../config/gameConstants";
import Icons from "./Icons";

export function QrConnectModal({ open, onClose, networkUrl, onCopyUrl }) {
  if (!open) return null;

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-qr-card" onClick={(e) => e.stopPropagation()}>
        <div className="mc-settings-header">
          <div className="mc-settings-title">
            <Icons.QRCode />
            <span>SCAN TO CONNECT PHONE</span>
          </div>
          <button type="button" className="mc-icon-btn" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
        <p className="mc-qr-instruction">
          Scan this QR code with your phone camera on the same Wi-Fi network:
        </p>
        <div className="mc-qr-frame">
          <QRCodeSVG
            value={networkUrl}
            size={220}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#080d16"
          />
        </div>
        <div className="mc-qr-url">{networkUrl}</div>
        <button
          type="button"
          className="mc-enable-gyro-action-btn mc-copy-url-btn"
          onClick={onCopyUrl}
        >
          COPY CONTROLLER LINK
        </button>
        <div className="mc-qr-network-info">
          <span className="mc-dot mc-dot-live" />
          MAKE SURE BOTH DEVICES USE THE SAME WI-FI
        </div>
      </div>
    </div>
  );
}

export function GameSettingsModal({
  open,
  onClose,
  steerHudSide,
  onSteerHudSideChange,
  scenePreset,
  onScenePresetChange,
}) {
  if (!open) return null;

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-settings-card" onClick={(e) => e.stopPropagation()}>
        <div className="mc-settings-header">
          <div className="mc-settings-title">
            <Icons.Settings />
            <span>GAME & HUD SETTINGS</span>
          </div>
          <button type="button" className="mc-icon-btn" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>

        <div className="mc-setting-group">
          <div className="mc-setting-label">STEERING HUD POSITION</div>
          <div className="mc-segmented">
            <button
              type="button"
              className={
                steerHudSide === "left" ? "mc-seg-btn active" : "mc-seg-btn"
              }
              onClick={() => onSteerHudSideChange("left")}
            >
              <span>LEFT SIDE</span>
            </button>
            <button
              type="button"
              className={
                steerHudSide === "right" ? "mc-seg-btn active" : "mc-seg-btn"
              }
              onClick={() => onSteerHudSideChange("right")}
            >
              <span>RIGHT SIDE</span>
            </button>
          </div>
        </div>

        <div className="mc-setting-group">
          <div className="mc-setting-label">ENVIRONMENT LIGHTING</div>
          <div className="mc-segmented">
            {Object.entries(SCENE_PRESETS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                className={
                  scenePreset === key ? "mc-seg-btn active" : "mc-seg-btn"
                }
                onClick={() => onScenePresetChange(key)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
