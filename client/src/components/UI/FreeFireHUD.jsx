import React, { useEffect, useRef, useState } from "react";
import Icons from "./Icons";
import {
  BackpackSvg,
  CarDriveSvg,
  CrouchSoldierSvg,
  EyeSvg,
  FireBulletSvg,
  HudLayoutSvg,
  JumpSoldierSvg,
  MedkitSvg,
  MicSvg,
  ReloadSvg,
  ScopeSvg,
  SpeakerSvg,
  SprintSvg,
} from "./FreeFireIcons";
import {
  FreeFireMinimapBox,
  FreeFireTopCenterCluster,
  FreeFireTopRightCluster,
  useCompassHeading,
} from "./FreeFireHudParts";
import DraggableFireButton from "./DraggableFireButton";
import CustomHudElement from "./CustomHudElement";
import CustomHudEditorBar from "./CustomHudEditorBar";
import {
  getActiveHudPresetIndex,
  HUD_ELEMENTS,
  loadHudLayoutPreset,
  resetHudLayoutPreset,
  saveHudLayoutPreset,
  setActiveHudPresetIndex,
} from "../../utils/customHudConfig";
import "./FreeFireHUD.css";

/* -------------------------------------------------------------------------- */
/*  Desktop / Main Canvas Free Fire Battle Royale HUD                         */
/* -------------------------------------------------------------------------- */

export default function FreeFireHUD({
  playerMode = "onFoot",
  matchStatus = "IN_PROGRESS",
  aircraftPhase = "flying",
  kills = 0,
  aliveCount = 7,
  weaponId = "m4a1",
  inventory = {},
  medkitCount: medkitCountProp,
  ammoState = {},
  reloading = false,
  playerHp = 100,
  vestLevel = 3,
  helmetLevel = 3,
  ep = 180,
  hitMarker = null,
  killFeed = [],
  killBanner = null,
  matchElapsed = 0,
  cameraYaw = 0,
  characterPos = null,
  enemies = [],
  carPos = null,
  isAiming = false,
  aimAssistLocked = false,
  isHeadshotLocked = false,
  onReturnToLobby = null,
  roomSummaryText = "",
  isFiring = false,
  nearCar = false,
  onSwitchWeapon,
  onReloadWeapon,
  onToggleVehicle,
  onSelectWeapon,
  onHeal,
  onAimToggle,
  onFireStart,
  onFireEnd,
  onFireDrag,
  onJump,
  onCrouch,
  onSprint,
  onOpenSettings,
  onOpenQr,
  onCycleCamera,
  onResetVehicle,
  onToggleInventory,
  onEjectAircraft,
  editCustomHud = false,
  onToggleCustomHud,
}) {
  const [medkitHealing, setMedkitHealing] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(true);
  const [sprintActive, setSprintActive] = useState(false);
  const [isCustomHudEditing, setIsCustomHudEditing] = useState(false);
  const [selectedHudElem, setSelectedHudElem] = useState("rightFire");
  const [activePreset, setActivePreset] = useState(() => getActiveHudPresetIndex());
  const [hudLayout, setHudLayout] = useState(() => loadHudLayoutPreset(activePreset));
  const medkitTimerRef = useRef(null);

  const isEditingHud = editCustomHud || isCustomHudEditing;

  const medkitCount =
    typeof medkitCountProp === "number" ? medkitCountProp : 3;

  useEffect(() => {
    return () => {
      if (medkitTimerRef.current) window.clearTimeout(medkitTimerRef.current);
    };
  }, []);

  const { headingDeg, cardinal } = useCompassHeading(cameraYaw);

  const handleUseMedkit = () => {
    if (medkitCount <= 0 || playerHp >= 100 || medkitHealing) return;
    setMedkitHealing(true);
    medkitTimerRef.current = window.setTimeout(() => {
      medkitTimerRef.current = null;
      onHeal?.(75);
      setMedkitHealing(false);
    }, 1800);
  };

  const handleUpdateLayout = (id, newCfg) => {
    setHudLayout((prev) => ({
      ...prev,
      [id]: newCfg,
    }));
  };

  const handleMoveLayout = (id, coords) => {
    setHudLayout((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || HUD_ELEMENTS[id] || {}),
        x: coords.x,
        y: coords.y,
      },
    }));
  };

  const handleSwitchPreset = (newPreset) => {
    setActivePreset(newPreset);
    setActiveHudPresetIndex(newPreset);
    setHudLayout(loadHudLayoutPreset(newPreset));
  };

  const handleResetLayout = () => {
    const def = resetHudLayoutPreset(activePreset);
    setHudLayout(def);
  };

  const handleResetSelected = (id) => {
    const def = HUD_ELEMENTS[id];
    if (!def) return;
    setHudLayout((prev) => ({
      ...prev,
      [id]: {
        x: def.defaultX,
        y: def.defaultY,
        size: def.defaultSize,
        opacity: def.defaultOpacity,
      },
    }));
  };

  const handleSaveLayout = () => {
    return saveHudLayoutPreset(activePreset, hudLayout);
  };

  const handleExitEdit = () => {
    setIsCustomHudEditing(false);
    onToggleCustomHud?.(false);
  };

  const isGroundCombat =
    playerMode === "onFoot" && matchStatus === "IN_PROGRESS";

  return (
    <div className="ff-hud-root">
      {/* ================================================================== */}
      {/* 1. TOP-LEFT SQUARE MINIMAP + SQUAD BAR + COMMS ICONS               */}
      {/* ================================================================== */}
      <div className="ffh-tl-cluster">
        <FreeFireMinimapBox
          posX={characterPos ? characterPos.x : 0}
          posZ={characterPos ? characterPos.z : 0}
          headingDeg={headingDeg}
          matchElapsed={matchElapsed}
          enemies={enemies}
          carPos={carPos}
        />

        <div className="ffh-tl-tools ffh-interactive">
          <div className="ffh-tl-tool-row">
            <button
              type="button"
              className={`ffh-mini-circle-btn ${speakerMuted ? "muted" : ""}`}
              onClick={() => setSpeakerMuted((v) => !v)}
              title="Toggle Team Audio"
            >
              <SpeakerSvg muted={speakerMuted} />
            </button>
            <button
              type="button"
              className={`ffh-mini-circle-btn ${micMuted ? "muted" : ""}`}
              onClick={() => setMicMuted((v) => !v)}
              title="Toggle Microphone"
            >
              <MicSvg muted={micMuted} />
            </button>
            <span className="ffh-eye-badge" title="Spectators">
              <EyeSvg />
              <span>1</span>
            </span>
          </div>

          <div className="ffh-tl-tool-row">
            <button
              type="button"
              className={`ffh-mini-circle-btn ${sprintActive ? "active" : ""}`}
              onClick={() => {
                setSprintActive((s) => !s);
                onSprint?.();
              }}
              title="Auto-Sprint Toggle (Shift)"
            >
              <SprintSvg />
            </button>
            <button
              type="button"
              className="ffh-mini-circle-btn"
              onClick={onCycleCamera}
              title="Switch Camera View"
            >
              <Icons.Camera />
            </button>
            <button
              type="button"
              className="ffh-mini-circle-btn"
              onClick={onOpenQr}
              title="Connect Phone QR Controller"
            >
              <Icons.QRCode />
            </button>
            <button
              type="button"
              className="ffh-mini-circle-btn"
              onClick={onResetVehicle}
              title="Reset BMW Position"
            >
              <Icons.Reset />
            </button>
            <button
              type="button"
              className={`ffh-mini-circle-btn ${isEditingHud ? "active" : ""}`}
              onClick={() => {
                const nextVal = !isEditingHud;
                setIsCustomHudEditing(nextVal);
                onToggleCustomHud?.(nextVal);
              }}
              title="Customize HUD (Position, Size & Transparency)"
              data-testid="hud-custom-editor-btn"
            >
              <HudLayoutSvg />
            </button>
            <span className="ffh-signal-badge">24ms</span>
            {roomSummaryText && (
              <span className="ffh-signal-badge" title="Active Match Room">
                {roomSummaryText}
              </span>
            )}
            {onReturnToLobby && (
              <button
                type="button"
                className="ffh-mini-circle-btn"
                onClick={onReturnToLobby}
                title="Return to Custom Lobby"
                data-testid="hud-return-lobby-btn"
                style={{ width: "auto", padding: "0 9px", fontSize: "10px", fontWeight: 800 }}
              >
                LOBBY
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 2. TOP-CENTER: HELMET/VEST + EP/HP + COMPASS/ZONE + KILL FEED      */}
      {/* ================================================================== */}
      <FreeFireTopCenterCluster
        helmetLevel={helmetLevel}
        vestLevel={vestLevel}
        ep={ep}
        playerHp={playerHp}
        cardinal={cardinal}
        headingDeg={headingDeg}
        matchElapsed={matchElapsed}
        killFeed={killFeed}
      />

      {/* ================================================================== */}
      {/* 3. TOP-RIGHT: TEAL ALIVE | CRIMSON KILLS | GEAR + WEAPON CARDS     */}
      {/* ================================================================== */}
      <FreeFireTopRightCluster
        aliveCount={aliveCount}
        kills={kills}
        onOpenSettings={onOpenSettings}
        showWeaponCards={isGroundCombat}
        weaponId={weaponId}
        ammoState={ammoState}
        reloading={reloading}
        primaryWeapon={inventory.primaryWeapon || "m4a1"}
        secondaryWeapon={inventory.secondaryWeapon || "deagle"}
        onSwitchWeapon={onSwitchWeapon}
        onReloadWeapon={onReloadWeapon}
        onSelectWeapon={onSelectWeapon}
      />

      {/* ================================================================== */}
      {/* 4. DYNAMIC CROSSHAIR & CENTER KILL BANNER                          */}
      {/* ================================================================== */}
      {isGroundCombat && (
        <div
          className={`ffh-crosshair ${isAiming ? "aiming" : ""} ${isFiring ? "firing" : ""} ${aimAssistLocked ? "locked-red" : ""} ${isHeadshotLocked ? "headshot-lock" : ""}`}
        >
          {isHeadshotLocked && <div className="ffh-crosshair-head-ring" />}
          <div className="ffh-reticle-tick top" />
          <div className="ffh-reticle-tick right" />
          <div className="ffh-reticle-tick bottom" />
          <div className="ffh-reticle-tick left" />
          <div className="ffh-reticle-dot" />
          {hitMarker && (
            <div className={`ffh-hitmarker ${hitMarker.headshot ? "headshot" : ""}`}>
              {hitMarker.headshot ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a8.5 8.5 0 0 0-8.5 8.5c0 3 1.6 5.6 4 7V21h9v-3.5c2.4-1.4 4-4 4-7A8.5 8.5 0 0 0 12 2z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path
                    d="M5 5l5 5M19 5l-5 5M5 19l5-5M19 19l-5-5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      )}

      {killBanner && (
        <div className="ffh-kill-banner">
          <div className="ffh-kill-banner-text">
            <span className="ffh-kill-banner-sub">
              {killBanner.headshot ? "HEADSHOT ELIMINATION" : "ELIMINATED"}
            </span>
            <span className="ffh-kill-banner-name">{killBanner.text}</span>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 5. AIRCRAFT DROP PROMPT & PARACHUTE STATUS                         */}
      {/* ================================================================== */}
      {(matchStatus === "DROPPING" || isEditingHud) && (
        <CustomHudElement
          id="dropParachute"
          editMode={isEditingHud}
          selected={selectedHudElem === "dropParachute"}
          cfg={hudLayout.dropParachute}
          onSelect={setSelectedHudElem}
          onMove={handleMoveLayout}
        >
          <div className="ffh-drop-banner ffh-interactive">
            {aircraftPhase === "flying" || isEditingHud ? (
              <button
                type="button"
                className="ffh-eject-btn"
                onClick={onEjectAircraft}
              >
                EJECT [SPACE]
              </button>
            ) : (
              <div className="ffh-parachute-chip">
                PARACHUTE DEPLOYED · STEER WITH WASD / ARROWS
              </div>
            )}
          </div>
        </CustomHudElement>
      )}

      {/* ================================================================== */}
      {/* 6. GROUND COMBAT & ACTION CONTROLS (CUSTOMIZABLE SIZE, TRANSPARENCY & POSITION) */}
      {/* ================================================================== */}
      {(isGroundCombat || isEditingHud) && (
        <>
          {/* JOYSTICK */}
          <CustomHudElement
            id="joystick"
            editMode={isEditingHud}
            selected={selectedHudElem === "joystick"}
            cfg={hudLayout.joystick}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <div className="ffh-joystick-pad" aria-hidden="true">
              <div className="ffh-joystick-knob" />
            </div>
          </CustomHudElement>

          {/* LEFT FIRE */}
          <CustomHudElement
            id="leftFire"
            editMode={isEditingHud}
            selected={selectedHudElem === "leftFire"}
            cfg={hudLayout.leftFire}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className={`ffh-action-circle static-pos ${isFiring ? "active" : ""}`}
              onMouseDown={onFireStart}
              onMouseUp={onFireEnd}
              onMouseLeave={onFireEnd}
              onTouchStart={onFireStart}
              onTouchEnd={onFireEnd}
              title="Left Fire Button"
            >
              <FireBulletSvg />
            </button>
          </CustomHudElement>

          {/* QUICK WEAPON SWITCH */}
          <CustomHudElement
            id="switchWeapon"
            editMode={isEditingHud}
            selected={selectedHudElem === "switchWeapon"}
            cfg={hudLayout.switchWeapon}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-action-circle static-pos"
              onClick={onSwitchWeapon}
              title="Cycle Weapon (Q)"
            >
              <ReloadSvg />
              <span className="ffh-key-hint">Q</span>
            </button>
          </CustomHudElement>

          {/* SPRINT / AUTO-RUN */}
          <CustomHudElement
            id="sprint"
            editMode={isEditingHud}
            selected={selectedHudElem === "sprint"}
            cfg={hudLayout.sprint}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className={`ffh-action-circle static-pos ${sprintActive ? "active" : ""}`}
              onClick={() => {
                setSprintActive((s) => !s);
                onSprint?.();
              }}
              title="Sprint / Auto-Run (Shift)"
            >
              <SprintSvg />
            </button>
          </CustomHudElement>

          {/* MEDKIT */}
          <CustomHudElement
            id="medkit"
            editMode={isEditingHud}
            selected={selectedHudElem === "medkit"}
            cfg={hudLayout.medkit}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className={`ffh-utility-circle ${medkitHealing ? "healing" : ""}`}
              onClick={handleUseMedkit}
              disabled={medkitCount <= 0 || playerHp >= 100 || medkitHealing}
              title="Use Medkit"
            >
              <MedkitSvg />
              <span className="ffh-count-badge">{medkitCount}</span>
            </button>
          </CustomHudElement>

          {/* BACKPACK */}
          <CustomHudElement
            id="backpack"
            editMode={isEditingHud}
            selected={selectedHudElem === "backpack"}
            cfg={hudLayout.backpack}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-utility-circle"
              onClick={onToggleInventory}
              title="Open Backpack (TAB)"
            >
              <BackpackSvg />
            </button>
          </CustomHudElement>

          {/* SCOPE / ADS */}
          <CustomHudElement
            id="aimScope"
            editMode={isEditingHud}
            selected={selectedHudElem === "aimScope"}
            cfg={hudLayout.aimScope}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className={`ffh-action-circle ffh-btn-scope ${isAiming ? "active" : ""}`}
              onClick={onAimToggle}
              title="Scope / ADS (Right Click)"
            >
              <ScopeSvg />
            </button>
          </CustomHudElement>

          {/* JUMP */}
          <CustomHudElement
            id="jump"
            editMode={isEditingHud}
            selected={selectedHudElem === "jump"}
            cfg={hudLayout.jump}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-action-circle ffh-btn-jump"
              onClick={onJump}
              title="Jump (Space)"
            >
              <JumpSoldierSvg />
            </button>
          </CustomHudElement>

          {/* PRIMARY FIRE (DRAGGABLE FIRE BUTTON) */}
          <CustomHudElement
            id="rightFire"
            editMode={isEditingHud}
            selected={selectedHudElem === "rightFire"}
            cfg={hudLayout.rightFire}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <DraggableFireButton
              className="ffh-action-circle ffh-btn-fire"
              isFiring={isFiring}
              editMode={isEditingHud}
              onFireStart={onFireStart}
              onFireEnd={onFireEnd}
              onFireDrag={onFireDrag}
            >
              <FireBulletSvg />
            </DraggableFireButton>
          </CustomHudElement>

          {/* CROUCH */}
          <CustomHudElement
            id="crouch"
            editMode={isEditingHud}
            selected={selectedHudElem === "crouch"}
            cfg={hudLayout.crouch}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-action-circle ffh-btn-crouch"
              onClick={onCrouch}
              title="Crouch (C)"
            >
              <CrouchSoldierSvg />
            </button>
          </CustomHudElement>

          {/* RELOAD */}
          <CustomHudElement
            id="reload"
            editMode={isEditingHud}
            selected={selectedHudElem === "reload"}
            cfg={hudLayout.reload}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-action-circle ffh-btn-reload"
              onClick={onReloadWeapon}
              title="Reload (R)"
            >
              <ReloadSvg />
              <span className="ffh-key-hint">R</span>
            </button>
          </CustomHudElement>

          {/* DRIVE BMW */}
          {(nearCar || isEditingHud) && (
            <CustomHudElement
              id="drive"
              editMode={isEditingHud}
              selected={selectedHudElem === "drive"}
              cfg={hudLayout.drive}
              onSelect={setSelectedHudElem}
              onMove={handleMoveLayout}
            >
              <button
                type="button"
                className="ffh-action-circle ffh-btn-drive"
                onClick={onToggleVehicle}
                title="Drive BMW M4 (F)"
              >
                <CarDriveSvg />
                <span className="ffh-key-hint">F</span>
              </button>
            </CustomHudElement>
          )}
        </>
      )}

      {/* ================================================================== */}
      {/* 7. CUSTOM HUD FLOATING EDITOR & SLIDERS OVERLAY                    */}
      {/* ================================================================== */}
      {isEditingHud && (
        <CustomHudEditorBar
          activePreset={activePreset}
          selectedId={selectedHudElem}
          layout={hudLayout}
          onChangeLayout={handleUpdateLayout}
          onSwitchPreset={handleSwitchPreset}
          onResetLayout={handleResetLayout}
          onResetSelectedElement={handleResetSelected}
          onSaveLayout={handleSaveLayout}
          onExitEdit={handleExitEdit}
        />
      )}
    </div>
  );
}
