import React, { useMemo } from "react";
import {
  WEAPONS,
  WEAPON_ORDER,
  ZONE_INITIAL_RADIUS,
} from "../../config/gameConstants";
import { getZoneInfo } from "../Zone/ZoneManager";
import Icons from "./Icons";
import TapButton from "./TapButton";
import {
  AliveUserSvg,
  HelmetSvg,
  KillsSkullSvg,
  VestSvg,
  WeaponSilhouetteSvg,
} from "./FreeFireIcons";

/**
 * Maps heading degrees [0..359] to 8-point cardinal label.
 */
export function getCardinalFromDeg(deg = 0) {
  const norm = ((Math.round(deg) % 360) + 360) % 360;
  if (norm >= 338 || norm < 23) return "N";
  if (norm >= 23 && norm < 68) return "NE";
  if (norm >= 68 && norm < 113) return "E";
  if (norm >= 113 && norm < 158) return "SE";
  if (norm >= 158 && norm < 203) return "S";
  if (norm >= 203 && norm < 248) return "SW";
  if (norm >= 248 && norm < 293) return "W";
  return "NW";
}

/**
 * Computes compass heading + cardinal text from a camera yaw angle in radians.
 */
export function useCompassHeading(cameraYaw = 0) {
  return useMemo(() => {
    let deg = Math.round((-cameraYaw * 180) / Math.PI) % 360;
    if (deg < 0) deg += 360;
    return { headingDeg: deg, cardinal: getCardinalFromDeg(deg) };
  }, [cameraYaw]);
}

/**
 * Top-left square Bermuda minimap & squad row (`1 YOU`) shared by desktop and mobile HUD.
 */
export function FreeFireMinimapBox({
  posX = 0,
  posZ = 0,
  headingDeg = 0,
  matchElapsed = 0,
  enemies = [],
  carPos = null,
}) {
  const zoneInfo = useMemo(() => getZoneInfo(matchElapsed), [matchElapsed]);
  const mapPctX = Math.max(8, Math.min(92, 50 + (posX / 72) * 44));
  const mapPctZ = Math.max(8, Math.min(92, 50 + (posZ / 72) * 44));
  const zoneRingPct = Math.max(
    18,
    Math.min(96, (zoneInfo.radius / ZONE_INITIAL_RADIUS) * 92),
  );

  return (
    <div className="ffh-map-column">
      <div className="ffh-map-frame">
        <svg viewBox="0 0 100 100" className="ffh-map-terrain-svg">
          <rect width="100" height="100" fill="#4f6d78" />
          <path
            d="M12 18 L52 10 L76 28 L86 58 L70 84 L32 88 L14 66 Z"
            fill="#73866c"
            opacity="0.72"
          />
          <path
            d="M28 24 L56 32 L64 62 L38 74 L22 52 Z"
            fill="#8c9d82"
            opacity="0.55"
          />
          <path
            d="M10 48 Q45 42 88 55 M48 8 Q54 48 42 92"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.2"
            opacity="0.45"
          />
        </svg>
        <div
          className={`ffh-map-zone-ring ${zoneInfo.isShrinking ? "shrinking" : ""}`}
          style={{ width: `${zoneRingPct}%`, height: `${zoneRingPct}%` }}
        />

        {/* VEHICLE / CAR POSITION ON MAP */}
        {carPos && (
          <div
            className="ffh-map-car-marker"
            style={{
              left: `${Math.max(6, Math.min(94, 50 + ((carPos.x || 0) / 72) * 44))}%`,
              top: `${Math.max(6, Math.min(94, 50 + ((carPos.z || 0) / 72) * 44))}%`,
              transform: `translate(-50%, -50%) rotate(${carPos.headingDeg || 0}deg)`,
            }}
            title="BMW M4 Vehicle"
          >
            <div className="ffh-map-car-icon">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="#ffcc00">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM7.5 16c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
          </div>
        )}

        {/* ENEMY POSITIONS ON MAP (RED BLIPS) */}
        {Array.isArray(enemies) &&
          enemies.map((enemy) => {
            if (!enemy || enemy.state === "knockedOut") return null;
            const eX = Math.max(6, Math.min(94, 50 + ((enemy.x || 0) / 72) * 44));
            const eZ = Math.max(6, Math.min(94, 50 + ((enemy.z || 0) / 72) * 44));
            const isFiring = enemy.state === "combat";
            const isTeammate = Boolean(enemy.isTeammate);
            return (
              <div
                key={enemy.id || `${enemy.x}_${enemy.z}`}
                className={`ffh-map-enemy-blip ${isTeammate ? "teammate" : ""} ${isFiring ? "combat" : ""}`}
                style={{
                  left: `${eX}%`,
                  top: `${eZ}%`,
                  transform: `translate(-50%, -50%) rotate(${enemy.headingDeg || 0}deg)`,
                }}
                title={isTeammate ? `Teammate: ${enemy.name || "Friend"}` : `Enemy: ${enemy.name || "Opponent"}`}
              >
                <div className="ffh-enemy-core-dot" />
                <div className="ffh-enemy-dir-tick" />
                {isFiring && <div className="ffh-enemy-combat-ring" />}
              </div>
            );
          })}

        {/* PLAYER POSITION */}
        <div
          className="ffh-map-player"
          style={{
            left: `${mapPctX}%`,
            top: `${mapPctZ}%`,
            transform: `translate(-50%, -50%) rotate(${headingDeg}deg)`,
          }}
        >
          <div className="ffh-map-player-cone" />
        </div>
        <span className="ffh-map-n">N</span>
        <span className="ffh-map-coords">
          {`${Math.round(posX)},${Math.round(posZ)}`}
        </span>
      </div>

      <div className="ffh-squad-list">
        <div className="ffh-squad-row">
          <span className="ffh-squad-idx">1</span>
          <span className="ffh-squad-name">YOU</span>
          <span className="ffh-squad-diamond" />
        </div>
      </div>
    </div>
  );
}

/**
 * Top-center Helmet/Vest, EP/HP (200/200), FF 500 coin, compass + safe zone bar, and kill feed.
 */
export function FreeFireTopCenterCluster({
  helmetLevel = 3,
  vestLevel = 3,
  ep = 180,
  playerHp = 100,
  cardinal = "N",
  headingDeg = 0,
  matchElapsed = 0,
  killFeed = [],
}) {
  const zoneInfo = useMemo(() => getZoneInfo(matchElapsed), [matchElapsed]);
  const currentHp200 = Math.round(playerHp * 2);

  return (
    <div className="ffh-tc-cluster">
      <div className="ffh-vitals-row">
        <div className="ffh-gear-icons">
          <div className="ffh-gear-chip" title={`Helmet Level ${helmetLevel}`}>
            <HelmetSvg />
            <span className="ffh-gear-lvl">{helmetLevel}</span>
          </div>
          <div className="ffh-gear-chip" title={`Vest Level ${vestLevel}`}>
            <VestSvg />
            <span className="ffh-gear-lvl">{vestLevel}</span>
          </div>
        </div>

        <div className="ffh-bars-stack">
          <div className="ffh-bar-meta">
            <span className="ffh-ep-label">EP {ep}/200</span>
            <span className="ffh-hp-label">HP {currentHp200}/200</span>
          </div>
          <div className="ffh-ep-track">
            <div
              className="ffh-ep-fill"
              style={{ width: `${Math.min(100, (ep / 200) * 100)}%` }}
            />
          </div>
          <div className="ffh-hp-track">
            <div
              className={`ffh-hp-fill ${playerHp < 35 ? "critical" : ""}`}
              style={{
                width: `${Math.max(0, Math.min(100, (currentHp200 / 200) * 100))}%`,
              }}
            />
          </div>
        </div>

        <div className="ffh-token-pill" title="FF Tokens">
          <span className="ffh-token-coin">F</span>
          <span className="ffh-token-val">500</span>
        </div>
      </div>

      <div className="ffh-compass-zone-bar">
        <span className="ffh-heading-chip">
          {cardinal} · {headingDeg}°
        </span>
        <span
          className={`ffh-zone-chip ${zoneInfo.isShrinking ? "shrinking" : ""}`}
        >
          <span className="ffh-zone-dot" />
          {zoneInfo.isShrinking
            ? `ZONE SHRINKING (${Math.round(zoneInfo.radius)}M)`
            : `SAFE ZONE ${String(Math.floor(zoneInfo.nextShrinkIn / 60)).padStart(2, "0")}:${String(Math.floor(zoneInfo.nextShrinkIn % 60)).padStart(2, "0")}`}
        </span>
      </div>

      {killFeed && killFeed.length > 0 && (
        <div className="ffh-killfeed-stack">
          {killFeed.slice(-3).map((item) => (
            <div
              key={item.id}
              className={`ffh-killfeed-line ${item.isPlayer ? "player-kill" : ""}`}
            >
              <span className="killer">{item.killer}</span>
              <span className="verb">Eliminated</span>
              <span>{item.victim}</span>
              {item.headshot && <span className="hs-tag">[HS]</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Top-right Teal Alive / Crimson Kills / Settings + Dark Active Weapon Card & Quick Slots.
 */
export function FreeFireTopRightCluster({
  aliveCount = 7,
  kills = 0,
  onOpenSettings,
  showWeaponCards = true,
  showWeaponChips = true,
  weaponId = "m4a1",
  ammoState = {},
  reloading = false,
  primaryWeapon = "m4a1",
  secondaryWeapon = "deagle",
  onSwitchWeapon,
  onReloadWeapon,
  onSelectWeapon,
}) {
  const activeWeapon = WEAPONS[weaponId] || WEAPONS.m4a1;
  const activeAmmo = ammoState[weaponId] || { mag: 0, reserve: 0 };

  const primaryId =
    weaponId === "ak47" || weaponId === "awm" || weaponId === "m4a1"
      ? weaponId
      : primaryWeapon || "m4a1";
  const secondaryId =
    weaponId === "mp40" || weaponId === "deagle"
      ? weaponId
      : secondaryWeapon || "deagle";
  const quickSlots = [primaryId, secondaryId, "fist"];

  return (
    <div className="ffh-tr-cluster">
      <div className="ffh-status-bar ffh-interactive">
        <div className="ffh-stat-pill alive">
          <AliveUserSvg />
          <span>{aliveCount}</span>
        </div>
        <div className="ffh-stat-pill kills">
          <KillsSkullSvg />
          <span>{kills}</span>
        </div>
        <TapButton
          className="ffh-settings-btn"
          onTrigger={onOpenSettings}
          title="Settings"
        >
          <Icons.Settings />
        </TapButton>
      </div>

      {showWeaponCards && (
        <div className="ffh-weapon-hud ffh-interactive">
          <TapButton
            className="ffh-active-weapon-card"
            onTrigger={weaponId === "fist" ? onSwitchWeapon : onReloadWeapon}
            title={weaponId === "fist" ? "Switch Weapon (Q)" : "Reload (R)"}
          >
            <div className="ffh-ammo-readout">
              {reloading ? (
                <span className="ffh-ammo-reload-label">RELOADING...</span>
              ) : weaponId === "fist" ? (
                <div className="ffh-ammo-numbers">
                  <span className="ffh-ammo-mag">∞</span>
                </div>
              ) : (
                <div className="ffh-ammo-numbers">
                  <span className="ffh-ammo-mag">{activeAmmo.mag}</span>
                  <span className="ffh-ammo-res">/{activeAmmo.reserve}</span>
                </div>
              )}
              <span className="ffh-weapon-name-mini">{activeWeapon.name}</span>
            </div>
            <WeaponSilhouetteSvg
              weaponId={weaponId}
              className="ffh-gun-svg-main"
            />
            <div className={`ffh-reload-strip ${reloading ? "active" : ""}`} />
          </TapButton>

          <div className="ffh-weapon-subslots">
            {quickSlots.map((slotId) => {
              const slot = ammoState[slotId] || { mag: 0, reserve: 0 };
              const active = weaponId === slotId;
              return (
                <TapButton
                  key={slotId}
                  className={`ffh-subslot-card ${active ? "active" : ""}`}
                  onTrigger={() => onSelectWeapon?.(slotId)}
                  title={`Equip ${WEAPONS[slotId]?.name || slotId}`}
                >
                  <WeaponSilhouetteSvg weaponId={slotId} />
                  <span className="ffh-subslot-ammo">
                    {slotId === "fist" ? "∞" : slot.mag + slot.reserve}
                  </span>
                </TapButton>
              );
            })}
          </div>

          {showWeaponChips && (
            <div className="ffh-cycle-row">
              {WEAPON_ORDER.filter((id) => id !== "fist").map((id) => (
                <TapButton
                  key={id}
                  className="ffh-cycle-chip"
                  style={
                    weaponId === id
                      ? { borderColor: "#fbbf24", color: "#fde047" }
                      : undefined
                  }
                  onTrigger={() => onSelectWeapon?.(id)}
                >
                  {WEAPONS[id]?.name}
                </TapButton>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
