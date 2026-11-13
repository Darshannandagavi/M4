import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { MAP_PRESETS, SCENE_PRESETS } from "../../config/gameConstants";
import Icons from "./Icons";
import { HudLayoutSvg } from "./FreeFireIcons";

export function QrConnectModal({
  open,
  onClose,
  networkUrl,
  onCopyUrl,
  relayStatus = "connected",
  isLoopbackUrl = false,
  pairToken = null,
}) {
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
        {isLoopbackUrl && (
          <div className="mc-qr-warning" style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, background: "rgba(245, 158, 11, 0.16)", border: "1px solid rgba(245, 158, 11, 0.45)", color: "#fde68a", fontSize: 12, lineHeight: 1.35 }}>
            Using localhost URL — replace <strong>localhost</strong> with your PC&apos;s Wi-Fi IPv4 address if scanning from a phone.
          </div>
        )}
        {relayStatus === "offline" && (
          <div className="mc-qr-warning" style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, background: "rgba(239, 68, 68, 0.16)", border: "1px solid rgba(239, 68, 68, 0.45)", color: "#fecaca", fontSize: 12, lineHeight: 1.35 }}>
            Controller relay server is offline. Start <code>server/server.js</code> or run <code>npm start</code> from the project root.
          </div>
        )}
        <button
          type="button"
          className="mc-enable-gyro-action-btn mc-copy-url-btn"
          onClick={onCopyUrl}
        >
          COPY CONTROLLER LINK
        </button>
        <div className="mc-qr-network-info">
          <span className="mc-dot mc-dot-live" />
          {pairToken
            ? `SCOPED PAIR SESSION: ${pairToken}`
            : "MAKE SURE BOTH DEVICES USE THE SAME WI-FI"}
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
  mapPreset,
  onMapPresetChange,
  onOpenCustomHud,
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

        {onOpenCustomHud && (
          <div className="mc-setting-group">
            <div className="mc-setting-label">FREE FIRE CUSTOM HUD</div>
            <button
              type="button"
              className="mc-seg-btn active"
              style={{
                width: "100%",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "rgba(245, 184, 46, 0.22)",
                borderColor: "#f5b82e",
                color: "#ffd60a",
                fontWeight: 900,
                letterSpacing: "0.8px",
              }}
              onClick={() => {
                onClose?.();
                onOpenCustomHud();
              }}
              data-testid="settings-open-custom-hud-btn"
            >
              <HudLayoutSvg />
              <span>CUSTOMIZE HUD (SIZE, TRANSPARENCY & LAYOUT)</span>
            </button>
          </div>
        )}

        {onMapPresetChange && (
          <div className="mc-setting-group">
            <div className="mc-setting-label">BATTLE / DRIVING MAP</div>
            <div className="mc-segmented">
              {Object.entries(MAP_PRESETS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={
                    mapPreset === key ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={() => onMapPresetChange(key)}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
