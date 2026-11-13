import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  MAX_TILT_DEG,
  MAX_WHEEL_ROTATION_DEG,
  SCENE_PRESETS,
  TILT_DEADZONE_DEG,
  WEAPONS,
  WEAPON_ORDER,
} from "../../config/gameConstants";
import {
  connectRelaySocket,
  extractTiltDegrees,
  getPairTokenFromUrl,
} from "../../utils/network";
import Icons from "../UI/Icons";
import HoldButton from "../UI/HoldButton";
import TapButton, { findTouchById } from "../UI/TapButton";
import SteeringWheelGraphic from "../UI/SteeringWheelGraphic";
import {
  BackpackSvg,
  CarDriveSvg,
  CrouchSoldierSvg,
  EmoteWaveSvg,
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
  WeaponSilhouetteSvg,
} from "../UI/FreeFireIcons";
import {
  FreeFireMinimapBox,
  FreeFireTopCenterCluster,
  FreeFireTopRightCluster,
  getCardinalFromDeg,
} from "../UI/FreeFireHudParts";
import DraggableFireButton from "../UI/DraggableFireButton";
import CustomHudElement from "../UI/CustomHudElement";
import CustomHudEditorBar from "../UI/CustomHudEditorBar";
import {
  getActiveHudPresetIndex,
  HUD_ELEMENTS,
  loadHudLayoutPreset,
  resetHudLayoutPreset,
  saveHudLayoutPreset,
  setActiveHudPresetIndex,
} from "../../utils/customHudConfig";
import "../UI/FreeFireHUD.css";

const CONTROLLER_EMOTES = [
  { id: "wave", label: "WAVE" },
  { id: "dance", label: "DANCE" },
  { id: "salute", label: "SALUTE" },
  { id: "celebrate", label: "WIN" },
];

const DEFAULT_AMMO_STATE = {
  m4a1: { mag: WEAPONS.m4a1.magSize, reserve: WEAPONS.m4a1.reserveAmmo },
  ak47: { mag: WEAPONS.ak47.magSize, reserve: WEAPONS.ak47.reserveAmmo },
  awm: { mag: WEAPONS.awm.magSize, reserve: WEAPONS.awm.reserveAmmo },
  mp40: { mag: WEAPONS.mp40.magSize, reserve: WEAPONS.mp40.reserveAmmo },
  deagle: { mag: WEAPONS.deagle.magSize, reserve: WEAPONS.deagle.reserveAmmo },
  fist: { mag: 0, reserve: 0 },
};

export default function PhoneControllerApp() {
  const [pairToken, setPairToken] = useState(() => getPairTokenFromUrl());
  const [pairDraft, setPairDraft] = useState(() => getPairTokenFromUrl());
  const [pairStatus, setPairStatus] = useState({
    linked: false,
    activeGames: 0,
    availablePairs: [],
  });
  const [connected, setConnected] = useState(false);
  const [relayStatus, setRelayStatus] = useState("connecting");
  const [steerMode, setSteerMode] = useState("wheel");
  const [steerSide, setSteerSide] = useState("left");
  const [scenePreset, setScenePreset] = useState("track");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroPermNeeded, setGyroPermNeeded] = useState(false);
  const [gyroPromptOpen, setGyroPromptOpen] = useState(false);
  const [gyroError, setGyroError] = useState("");
  const [gyroSensorDetected, setGyroSensorDetected] = useState(false);
  const [steerVal, setSteerVal] = useState(0);
  const [wheelGrabbed, setWheelGrabbed] = useState(false);
  const [joyKnob, setJoyKnob] = useState({ x: 0, y: 0, active: false });
  const [autoRun, setAutoRun] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(true);
  const [aimActive, setAimActive] = useState(false);
  const [crouchActive, setCrouchActive] = useState(false);
  const [firingActive, setFiringActive] = useState(false);
  const [emotesOpen, setEmotesOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fsHint, setFsHint] = useState("");
  const [medkitHealing, setMedkitHealing] = useState(false);
  const [customHudEditing, setCustomHudEditing] = useState(false);
  const [selectedHudElem, setSelectedHudElem] = useState("rightFire");
  const [activePreset, setActivePreset] = useState(() => getActiveHudPresetIndex());
  const [hudLayout, setHudLayout] = useState(() => loadHudLayoutPreset(activePreset));
  const [swipeIndicator, setSwipeIndicator] = useState({
    active: false,
    offset: 0,
  });

  const handleUpdateLayout = useCallback((id, newCfg) => {
    setHudLayout((prev) => ({
      ...prev,
      [id]: newCfg,
    }));
  }, []);

  const handleMoveLayout = useCallback((id, coords) => {
    setHudLayout((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || HUD_ELEMENTS[id] || {}),
        x: coords.x,
        y: coords.y,
      },
    }));
  }, []);

  const handleSwitchPreset = useCallback((newPreset) => {
    setActivePreset(newPreset);
    setActiveHudPresetIndex(newPreset);
    setHudLayout(loadHudLayoutPreset(newPreset));
  }, []);

  const handleResetLayout = useCallback(() => {
    const def = resetHudLayoutPreset(activePreset);
    setHudLayout(def);
  }, [activePreset]);

  const handleResetSelected = useCallback((id) => {
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
  }, []);

  const handleSaveLayout = useCallback(() => {
    return saveHudLayoutPreset(activePreset, hudLayout);
  }, [activePreset, hudLayout]);

  const [telemetry, setTelemetry] = useState({
    speed: 0,
    gear: "N",
    rpm: 850,
    drifting: false,
    boost: false,
    playerMode: "onFoot",
    matchStatus: "DROPPING",
    aircraftPhase: "flying",
    nearCar: false,
    weaponId: "m4a1",
    weaponName: "M4A1 RIFLE",
    ammo: 30,
    reserveAmmo: 120,
    reloading: false,
    aliveCount: 7,
    hp: 100,
    ep: 180,
    vestLevel: 3,
    helmetLevel: 3,
    medkits: 3,
    primaryWeapon: "m4a1",
    secondaryWeapon: "deagle",
    ammoState: DEFAULT_AMMO_STATE,
    matchElapsed: 0,
    kills: 0,
    killFeed: [],
    posX: 0,
    posZ: 0,
    headingDeg: 0,
    statusMsg: "",
  });

  const [isPortraitViewport, setIsPortraitViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.innerHeight > window.innerWidth
      : false,
  );

  const socketRef = useRef(null);
  const inputRef = useRef({
    accelerate: false,
    brake: false,
    handbrake: false,
    boost: false,
    jump: false,
    crouch: false,
    sprint: false,
    autoRun: false,
    fire: false,
    aim: false,
    steer: 0,
    moveX: 0,
    moveY: 0,
    lookX: 0,
    lookY: 0,
  });
  const rawTiltRef = useRef(0);
  const tiltZeroRef = useRef(0);
  const wheelBoxRef = useRef(null);
  const joyBoxRef = useRef(null);
  const swipeBoxRef = useRef(null);
  const prevSwipePtRef = useRef(null);
  const prevFingerAngleRef = useRef(null);
  const wheelAngleDegRef = useRef(0);
  const joyTouchIdRef = useRef(null);
  const joyMouseDownRef = useRef(false);
  const swipeTouchIdRef = useRef(null);
  const swipeMouseDownRef = useRef(false);
  const wheelTouchIdRef = useRef(null);
  const wheelMouseDownRef = useRef(false);
  const prevMatchStatusRef = useRef("DROPPING");
  const fsHintTimerRef = useRef(null);

  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("selectstart", prevent);

    const syncViewportMetrics = () => {
      const vw = window.visualViewport?.width || window.innerWidth;
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--mc-vw", `${Math.round(vw)}px`);
      document.documentElement.style.setProperty("--mc-vh", `${Math.round(vh)}px`);
      setIsPortraitViewport(vh > vw);
      const activeFs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(Boolean(activeFs));
    };

    syncViewportMetrics();
    window.addEventListener("resize", syncViewportMetrics);
    window.addEventListener("orientationchange", syncViewportMetrics);
    window.visualViewport?.addEventListener("resize", syncViewportMetrics);
    document.addEventListener("fullscreenchange", syncViewportMetrics);
    document.addEventListener("webkitfullscreenchange", syncViewportMetrics);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("selectstart", prevent);
      window.removeEventListener("resize", syncViewportMetrics);
      window.removeEventListener("orientationchange", syncViewportMetrics);
      window.visualViewport?.removeEventListener("resize", syncViewportMetrics);
      document.removeEventListener("fullscreenchange", syncViewportMetrics);
      document.removeEventListener("webkitfullscreenchange", syncViewportMetrics);
      if (fsHintTimerRef.current) window.clearTimeout(fsHintTimerRef.current);
    };
  }, []);

  const emitInput = useCallback((extra = undefined) => {
    const payload = extra
      ? { ...inputRef.current, ...extra }
      : inputRef.current;
    socketRef.current?.emit("controller:input", payload);
  }, []);

  useEffect(() => {
    const cleanupSocket = connectRelaySocket({
      role: "controller",
      pairToken,
      onStatusChange: (statusInfo) => {
        setRelayStatus(statusInfo?.status || "connecting");
        if (statusInfo?.status !== "connected") {
          setConnected(false);
        }
      },
      onSocket: (socket) => {
        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);
          socket.emit("controller:action", "syncState");
          socket.emit("controller:input", inputRef.current);
        });
        socket.on("disconnect", () => {
          setConnected(false);
          setPairStatus((prev) => ({ ...prev, linked: false }));
        });
        socket.on("controller:pair-status", (status) => {
          if (!status || typeof status !== "object") return;
          if (status.pairToken && status.pairToken !== pairToken) {
            setPairToken(status.pairToken);
            setPairDraft(status.pairToken);
          }
          setPairStatus({
            linked: Boolean(status.linked),
            activeGames: Number(status.activeGames) || 0,
            availablePairs: Array.isArray(status.availablePairs)
              ? status.availablePairs
              : [],
          });
        });
        socket.on("game:telemetry", (data) => {
          if (!data) return;
          setPairStatus((prev) => (prev.linked ? prev : { ...prev, linked: true }));
          setTelemetry((prev) => ({
            ...prev,
            ...data,
            playerMode: data.playerMode || prev.playerMode,
          }));
        });
        socket.on("game:haptic", (pattern) => {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
          }
        });
      },
      onCleanupSocket: (oldSocket) => {
        if (socketRef.current === oldSocket) {
          socketRef.current = null;
        }
      },
    });

    const heartbeat = setInterval(() => {
      if (socketRef.current?.connected) {
        // Strip transient delta impulses from steady-state heartbeat
        const { lookDeltaX, lookDeltaY, ...steadyState } = inputRef.current;
        socketRef.current.emit("controller:input", steadyState);
      }
    }, 30);

    return () => {
      clearInterval(heartbeat);
      cleanupSocket();
      socketRef.current = null;
      setConnected(false);
    };
  }, [pairToken]);

  // Automatically clear stale inputs when switching between Car HUD and Character HUD
  // Automatically clear stale inputs when switching between Car HUD and Character HUD
  useEffect(() => {
    if (telemetry.playerMode === "driving") {
      setAutoRun(false);
      setAimActive(false);
      setCrouchActive(false);
      setFiringActive(false);
      setEmotesOpen(false);
      setBagOpen(false);
      inputRef.current.autoRun = false;
      inputRef.current.moveX = 0;
      inputRef.current.moveY = 0;
      inputRef.current.sprint = false;
      inputRef.current.crouch = false;
      inputRef.current.fire = false;
      inputRef.current.aim = false;
      setJoyKnob({ x: 0, y: 0, active: false });
    } else if (telemetry.playerMode === "onFoot") {
      inputRef.current.accelerate = false;
      inputRef.current.brake = false;
      inputRef.current.handbrake = false;
      inputRef.current.boost = false;
      inputRef.current.steer = 0;
      wheelTouchIdRef.current = null;
      wheelMouseDownRef.current = false;
      setWheelGrabbed(false);
      setSteerVal(0);
    }
  }, [telemetry.playerMode]);

  useEffect(() => {
    if (
      telemetry.matchStatus === "DROPPING" &&
      prevMatchStatusRef.current !== "DROPPING"
    ) {
      setAutoRun(false);
      setAimActive(false);
      setCrouchActive(false);
      setFiringActive(false);
      setEmotesOpen(false);
      setBagOpen(false);
      inputRef.current.autoRun = false;
      inputRef.current.crouch = false;
      inputRef.current.aim = false;
      inputRef.current.fire = false;
      inputRef.current.jump = false;
      emitInput();
    }
    prevMatchStatusRef.current = telemetry.matchStatus;
  }, [telemetry.matchStatus, emitInput]);

  const medkitTimerRef = useRef(null);
  useEffect(() => {
    return () => {
      if (medkitTimerRef.current) window.clearTimeout(medkitTimerRef.current);
    };
  }, []);

  const updateField = useCallback(
    (key, value) => {
      inputRef.current[key] = value;
      emitInput();
    },
    [emitInput],
  );

  const toggleAutoRun = useCallback(() => {
    setAutoRun((prev) => {
      const next = !prev;
      inputRef.current.autoRun = next;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(20);
      }
      emitInput();
      return next;
    });
  }, [emitInput]);

  /* Left Joystick for Small / In-Place Movements */
  const mapTouchDelta = useCallback(
    (el, clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;

      if (isPortraitViewport) {
        const temp = dx;
        dx = dy;
        dy = -temp;
      }

      const maxR = Math.min(rect.width, rect.height) * 0.38;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) {
        dx = (dx / dist) * maxR;
        dy = (dy / dist) * maxR;
      }

      return {
        dx,
        dy,
        normX: THREE.MathUtils.clamp(dx / maxR, -1, 1),
        normY: THREE.MathUtils.clamp(-dy / maxR, -1, 1),
      };
    },
    [isPortraitViewport],
  );

  const applyJoyPoint = useCallback(
    (pt) => {
      const el = joyBoxRef.current;
      if (!el || !pt) return;
      const { dx, dy, normX, normY } = mapTouchDelta(el, pt.clientX, pt.clientY);
      inputRef.current.moveX = normX;
      inputRef.current.moveY = normY;

      // Pulling backward on the joystick stops continuous auto-run
      if (normY < -0.35 && inputRef.current.autoRun) {
        inputRef.current.autoRun = false;
        setAutoRun(false);
      }

      setJoyKnob({ x: dx, y: dy, active: true });
      emitInput();
    },
    [mapTouchDelta, emitInput],
  );

  const handleMoveJoyStart = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.changedTouches) {
        if (joyTouchIdRef.current !== null) return;
        const pt = e.changedTouches[0];
        if (!pt) return;
        joyTouchIdRef.current = pt.identifier;
        applyJoyPoint(pt);
        return;
      }
      if (e.cancelable) e.preventDefault();
      if (joyTouchIdRef.current !== null) return;
      joyMouseDownRef.current = true;
      applyJoyPoint(e);
    },
    [applyJoyPoint],
  );

  const handleMoveJoyMove = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.touches || e.changedTouches) {
        if (joyTouchIdRef.current === null) return;
        const pt =
          findTouchById(e.touches, joyTouchIdRef.current) ||
          findTouchById(e.changedTouches, joyTouchIdRef.current);
        if (!pt) return;
        applyJoyPoint(pt);
        return;
      }
      if (!joyMouseDownRef.current || e.buttons !== 1) return;
      if (e.cancelable) e.preventDefault();
      applyJoyPoint(e);
    },
    [applyJoyPoint],
  );

  const handleMoveJoyEnd = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (e?.changedTouches) {
        if (joyTouchIdRef.current === null) return;
        const ended = findTouchById(e.changedTouches, joyTouchIdRef.current);
        const stillDown = findTouchById(e.touches, joyTouchIdRef.current);
        if (!ended && stillDown) return;
        if (e.cancelable) e.preventDefault();
        joyTouchIdRef.current = null;
      } else {
        if (!joyMouseDownRef.current) return;
        if (e?.cancelable) e.preventDefault();
        joyMouseDownRef.current = false;
      }

      inputRef.current.moveX = 0;
      inputRef.current.moveY = 0;
      setJoyKnob({ x: 0, y: 0, active: false });
      emitInput();
    },
    [emitInput],
  );

  /* Right Horizontal Swipe Pad for Turning Character Direction */
  const extractLandscapeXY = useCallback(
    (pt) => {
      if (isPortraitViewport) {
        return { x: pt.clientY, y: -pt.clientX };
      }
      return { x: pt.clientX, y: pt.clientY };
    },
    [isPortraitViewport],
  );

  const handleSwipeStart = useCallback(
    (e) => {
      if (
        e.target?.closest?.(
          "button, [role='button'], .ffh-interactive, .mc-ff-joy-hit, .mc-modal-backdrop",
        )
      ) {
        return;
      }
      e.stopPropagation();

      let pt = null;
      if (e.changedTouches) {
        if (swipeTouchIdRef.current !== null) return;
        pt = e.changedTouches[0];
        if (!pt) return;
        swipeTouchIdRef.current = pt.identifier;
      } else {
        if (e.cancelable) e.preventDefault();
        if (swipeTouchIdRef.current !== null) return;
        swipeMouseDownRef.current = true;
        pt = e;
      }

      const pos = extractLandscapeXY(pt);
      prevSwipePtRef.current = { x: pos.x, y: pos.y, startX: pos.x };
      setSwipeIndicator({ active: true, offset: 0 });
    },
    [extractLandscapeXY],
  );

  const handleSwipeMove = useCallback(
    (e) => {
      if (!prevSwipePtRef.current) return;
      let pt = null;
      if (e.touches || e.changedTouches) {
        if (swipeTouchIdRef.current === null) return;
        pt =
          findTouchById(e.touches, swipeTouchIdRef.current) ||
          findTouchById(e.changedTouches, swipeTouchIdRef.current);
        if (!pt) return;
      } else {
        if (!swipeMouseDownRef.current || e.buttons !== 1) return;
        if (e.cancelable) e.preventDefault();
        pt = e;
      }

      e.stopPropagation();
      const pos = extractLandscapeXY(pt);

      const deltaX = pos.x - prevSwipePtRef.current.x;
      const deltaY = pos.y - prevSwipePtRef.current.y;
      prevSwipePtRef.current.x = pos.x;
      prevSwipePtRef.current.y = pos.y;

      const visualOffset = THREE.MathUtils.clamp(
        pos.x - prevSwipePtRef.current.startX,
        -58,
        58,
      );
      setSwipeIndicator({ active: true, offset: visualOffset });

      emitInput({
        lookDeltaX: deltaX * 0.014,
        lookDeltaY: deltaY * 0.008,
      });
    },
    [extractLandscapeXY, emitInput],
  );

  const handleSwipeEnd = useCallback((e) => {
    e?.stopPropagation?.();
    if (e?.changedTouches) {
      if (swipeTouchIdRef.current === null) return;
      const ended = findTouchById(e.changedTouches, swipeTouchIdRef.current);
      const stillDown = findTouchById(e.touches, swipeTouchIdRef.current);
      if (!ended && stillDown) return;
      if (e.cancelable) e.preventDefault();
      swipeTouchIdRef.current = null;
    } else {
      if (!swipeMouseDownRef.current) return;
      if (e?.cancelable) e.preventDefault();
      swipeMouseDownRef.current = false;
    }

    prevSwipePtRef.current = null;
    setSwipeIndicator({ active: false, offset: 0 });
    emitInput({ lookDeltaX: 0, lookDeltaY: 0 });
  }, [emitInput]);

  const openGyroPrompt = useCallback(() => {
    setSteerMode("tilt");
    setGyroPromptOpen(true);
    setGyroError("");
  }, []);

  const requestAndEnableGyro = useCallback(async () => {
    if (!window.isSecureContext) {
      setGyroError(
        "GYROSCOPE ACCESS REQUIRES HTTPS OR LOCALHOST. A LOCAL WI-FI HTTP ADDRESS MAY BE BLOCKED.",
      );
      setGyroPermNeeded(true);
      return;
    }

    if (typeof DeviceOrientationEvent === "undefined") {
      setGyroError("DEVICE ORIENTATION IS NOT SUPPORTED BY THIS BROWSER.");
      setGyroPermNeeded(true);
      return;
    }

    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") {
          setGyroActive(false);
          setGyroPermNeeded(true);
          setGyroError(
            "SENSOR PERMISSION WAS DENIED. ALLOW MOTION ACCESS AND RETRY.",
          );
          return;
        }
      }

      setGyroPermNeeded(false);
      setGyroError("");
      setGyroSensorDetected(false);
      rawTiltRef.current = 0;
      tiltZeroRef.current = 0;
      setGyroActive(true);
      setGyroPromptOpen(false);
    } catch (error) {
      console.error("Gyroscope activation failed:", error);
      setGyroActive(false);
      setGyroPermNeeded(true);
      setGyroError(error?.message || "UNABLE TO INITIALIZE GYROSCOPE.");
    }
  }, []);

  const calibrateTilt = useCallback(() => {
    tiltZeroRef.current = rawTiltRef.current;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(25);
    }
  }, []);

  useEffect(() => {
    if (steerMode !== "tilt" || !gyroActive) {
      inputRef.current.steer = 0;
      setSteerVal(0);
      emitInput();
      return undefined;
    }

    const onOrientation = (event) => {
      if (event.beta === null && event.gamma === null) return;

      setGyroSensorDetected(true);
      const deg = extractTiltDegrees(event, isPortraitViewport);
      rawTiltRef.current = deg;

      const calibrated = deg - tiltZeroRef.current;
      const abs = Math.abs(calibrated);

      let nextSteer = 0;
      if (abs >= TILT_DEADZONE_DEG) {
        const effective = Math.sign(calibrated) * (abs - TILT_DEADZONE_DEG);
        const normRight = THREE.MathUtils.clamp(
          effective / (MAX_TILT_DEG - TILT_DEADZONE_DEG),
          -1,
          1,
        );
        nextSteer = -normRight;
      }

      inputRef.current.steer = nextSteer;
      setSteerVal(nextSteer);
      emitInput();
    };

    window.addEventListener("deviceorientation", onOrientation, true);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  }, [steerMode, gyroActive, isPortraitViewport, emitInput]);

  const getFingerPolarAngle = useCallback(
    (point) => {
      const el = wheelBoxRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      let dx = point.clientX - cx;
      let dy = point.clientY - cy;

      if (isPortraitViewport) {
        const temp = dx;
        dx = dy;
        dy = -temp;
      }

      return (Math.atan2(dx, -dy) * 180) / Math.PI;
    },
    [isPortraitViewport],
  );

  const handleWheelStart = useCallback(
    (e) => {
      e.stopPropagation();
      let pt = null;
      if (e.changedTouches) {
        if (wheelTouchIdRef.current !== null) return;
        pt = e.changedTouches[0];
        if (!pt) return;
        wheelTouchIdRef.current = pt.identifier;
      } else {
        if (e.cancelable) e.preventDefault();
        if (wheelTouchIdRef.current !== null) return;
        wheelMouseDownRef.current = true;
        pt = e;
      }
      prevFingerAngleRef.current = getFingerPolarAngle(pt);
      setWheelGrabbed(true);
    },
    [getFingerPolarAngle],
  );

  const handleWheelMove = useCallback(
    (e) => {
      if (prevFingerAngleRef.current === null) return;
      let pt = null;
      if (e.touches || e.changedTouches) {
        if (wheelTouchIdRef.current === null) return;
        pt =
          findTouchById(e.touches, wheelTouchIdRef.current) ||
          findTouchById(e.changedTouches, wheelTouchIdRef.current);
        if (!pt) return;
      } else {
        if (!wheelMouseDownRef.current || e.buttons !== 1) return;
        if (e.cancelable) e.preventDefault();
        pt = e;
      }

      e.stopPropagation();

      const currentFingerAngle = getFingerPolarAngle(pt);

      let deltaDeg = currentFingerAngle - prevFingerAngleRef.current;
      if (deltaDeg > 180) deltaDeg -= 360;
      if (deltaDeg < -180) deltaDeg += 360;

      prevFingerAngleRef.current = currentFingerAngle;

      wheelAngleDegRef.current = THREE.MathUtils.clamp(
        wheelAngleDegRef.current + deltaDeg,
        -MAX_WHEEL_ROTATION_DEG,
        MAX_WHEEL_ROTATION_DEG,
      );

      const nextSteer = THREE.MathUtils.clamp(
        -wheelAngleDegRef.current / MAX_WHEEL_ROTATION_DEG,
        -1,
        1,
      );
      inputRef.current.steer = nextSteer;
      setSteerVal(nextSteer);
      emitInput();
    },
    [getFingerPolarAngle, emitInput],
  );

  const handleWheelEnd = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (e?.changedTouches) {
        if (wheelTouchIdRef.current === null) return;
        const ended = findTouchById(e.changedTouches, wheelTouchIdRef.current);
        const stillDown = findTouchById(e.touches, wheelTouchIdRef.current);
        if (!ended && stillDown) return;
        if (e.cancelable) e.preventDefault();
        wheelTouchIdRef.current = null;
      } else {
        if (!wheelMouseDownRef.current) return;
        if (e?.cancelable) e.preventDefault();
        wheelMouseDownRef.current = false;
      }

      prevFingerAngleRef.current = null;
      wheelAngleDegRef.current = 0;
      setWheelGrabbed(false);
      inputRef.current.steer = 0;
      setSteerVal(0);
      emitInput();
    },
    [emitInput],
  );

  const showFsHint = useCallback((msg) => {
    setFsHint(msg);
    if (fsHintTimerRef.current) window.clearTimeout(fsHintTimerRef.current);
    fsHintTimerRef.current = window.setTimeout(() => {
      fsHintTimerRef.current = null;
      setFsHint("");
    }, 4500);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const docEl = document.documentElement;
    if (typeof window !== "undefined") {
      window.scrollTo(0, 1);
    }
    const activeFs =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    if (!activeFs) {
      const reqFs =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.webkitRequestFullScreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (!reqFs) {
        try {
          await window.screen?.orientation?.lock?.("landscape");
        } catch {
          // Orientation lock unavailable outside fullscreen on some browsers
        }
        showFsHint(
          "On iPhone/Safari: rotate sideways or tap Share -> Add to Home Screen for full screen.",
        );
        return;
      }

      try {
        let res;
        try {
          res = reqFs.call(docEl, { navigationUI: "hide" });
        } catch {
          res = reqFs.call(docEl);
        }
        if (res && typeof res.then === "function") {
          await res;
        }
        try {
          await window.screen?.orientation?.lock?.("landscape");
        } catch {
          // Ignore if device orientation lock is disallowed
        }
      } catch {
        showFsHint(
          "Browser blocked fullscreen — rotate phone sideways or add page to Home Screen.",
        );
      }
      return;
    }

    const exitFs =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (exitFs) {
      try {
        await exitFs.call(document);
      } catch {
        // Ignore fullscreen exit rejection
      }
    }
  }, [showFsHint]);

  const handleSteerSideChange = useCallback((side) => {
    setSteerSide(side);
    socketRef.current?.emit("controller:settings", { steerHudSide: side });
  }, []);

  const handleSceneChange = useCallback((presetKey) => {
    setScenePreset(presetKey);
    socketRef.current?.emit("controller:settings", { scenePreset: presetKey });
  }, []);

  const emitAction = useCallback((action) => {
    socketRef.current?.emit("controller:action", action);
  }, []);

  const handleMobileHeal = useCallback(() => {
    if ((telemetry.medkits ?? 0) <= 0 || telemetry.hp >= 100 || medkitHealing) {
      return;
    }
    setMedkitHealing(true);
    if (medkitTimerRef.current) window.clearTimeout(medkitTimerRef.current);
    medkitTimerRef.current = window.setTimeout(() => {
      medkitTimerRef.current = null;
      emitAction("heal");
      setMedkitHealing(false);
    }, 900);
  }, [telemetry.medkits, telemetry.hp, medkitHealing, emitAction]);

  const handleToggleAim = useCallback(() => {
    setAimActive((prev) => {
      const next = !prev;
      updateField("aim", next);
      return next;
    });
  }, [updateField]);

  const handleToggleCrouch = useCallback(() => {
    setCrouchActive((prev) => {
      const next = !prev;
      updateField("crouch", next);
      return next;
    });
  }, [updateField]);

  const isOnFoot =
    telemetry.playerMode === "onFoot" || telemetry.playerMode === "exiting";
  const rpmRatio = Math.min(1, (telemetry.rpm || 850) / 7500);
  const ledCount = 14;
  const activeLeds = Math.round(rpmRatio * ledCount);
  const headingDeg = telemetry.headingDeg || 0;
  const cardinal = getCardinalFromDeg(headingDeg);
  const activeWeaponId = telemetry.weaponId || "m4a1";

  return (
    <div
      className={
        isPortraitViewport ? "mc-viewport mc-force-landscape" : "mc-viewport"
      }
    >
      {isOnFoot ? (
        <div className="mc-ff-stage ff-hud-root">
          {/* Dedicated 360° Aim Swipe Surface behind HUD clusters */}
          <div
            ref={swipeBoxRef}
            className="mc-ff-aim-backdrop"
            style={{ pointerEvents: customHudEditing ? "none" : "auto" }}
            onTouchStart={customHudEditing ? undefined : handleSwipeStart}
            onTouchMove={customHudEditing ? undefined : handleSwipeMove}
            onTouchEnd={customHudEditing ? undefined : handleSwipeEnd}
            onTouchCancel={customHudEditing ? undefined : handleSwipeEnd}
            onMouseDown={customHudEditing ? undefined : handleSwipeStart}
            onMouseMove={customHudEditing ? undefined : handleSwipeMove}
            onMouseUp={customHudEditing ? undefined : handleSwipeEnd}
            onMouseLeave={customHudEditing ? undefined : handleSwipeEnd}
          >
            <div
              className={`ffh-crosshair ${aimActive ? "aiming" : ""} ${firingActive ? "firing" : ""}`}
            >
              <div className="ffh-reticle-tick top" />
              <div className="ffh-reticle-tick right" />
              <div className="ffh-reticle-tick bottom" />
              <div className="ffh-reticle-tick left" />
              <div className="ffh-reticle-dot" />
            </div>
            {swipeIndicator.active && (
              <div className="mc-ff-swipe-hint active">
                <span>AIMING</span>
                <span
                  className="mc-ff-swipe-indicator"
                  style={{
                    transform: `translateX(${Math.round(swipeIndicator.offset * 0.45)}px)`,
                  }}
                />
              </div>
            )}
          </div>

          {(telemetry.statusMsg ||
            !connected ||
            !pairStatus.linked ||
            telemetry.inLobby) && (
            <div
              className="mc-ff-status-toast ffh-interactive"
              style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}
            >
              <span>
                {!connected
                  ? relayStatus === "offline"
                    ? "RELAY SERVER OFFLINE — START SERVER & KEEP LAPTOP ON SAME WI-FI"
                    : "CONNECTING TO LAPTOP..."
                  : !pairStatus.linked
                    ? pairStatus.activeGames > 0
                      ? "UNPAIRED SESSION — TAP LINK TO CONNECT TO ACTIVE LAPTOP OR SCAN QR"
                      : "WAITING FOR LAPTOP GAME CLIENT TO OPEN"
                    : telemetry.statusMsg
                      ? telemetry.statusMsg
                      : "LAPTOP IS IN LOBBY — TAP QUICK SOLO OR START MATCH ON LAPTOP"}
              </span>
              {connected &&
                !pairStatus.linked &&
                pairStatus.availablePairs.length > 0 && (
                  <TapButton
                    className="ffh-mini-circle-btn"
                    style={{
                      width: "auto",
                      height: "24px",
                      padding: "0 10px",
                      borderRadius: "6px",
                      background: "#f97316",
                      color: "#0b0f19",
                      fontSize: "10px",
                      fontWeight: 900,
                    }}
                    onTrigger={() => {
                      const next = pairStatus.availablePairs[0];
                      setPairDraft(next);
                      setPairToken(next);
                    }}
                  >
                    LINK GAME
                  </TapButton>
                )}
            </div>
          )}

          {/* 1. TOP-LEFT: SQUARE RADAR + 1 YOU + COMMS / TOOL CIRCLES */}
          <div className="ffh-tl-cluster">
            <FreeFireMinimapBox
              posX={telemetry.posX || 0}
              posZ={telemetry.posZ || 0}
              headingDeg={headingDeg}
              matchElapsed={telemetry.matchElapsed || 0}
              enemies={telemetry.enemies || []}
              carPos={telemetry.carPos || null}
            />

            <div className="ffh-tl-tools ffh-interactive">
              <div className="ffh-tl-tool-row">
                <TapButton
                  className={`ffh-mini-circle-btn ${speakerMuted ? "muted" : ""}`}
                  onTrigger={() => setSpeakerMuted((v) => !v)}
                  title="Toggle Team Audio"
                >
                  <SpeakerSvg muted={speakerMuted} />
                </TapButton>
                <TapButton
                  className={`ffh-mini-circle-btn ${micMuted ? "muted" : ""}`}
                  onTrigger={() => setMicMuted((v) => !v)}
                  title="Toggle Microphone"
                >
                  <MicSvg muted={micMuted} />
                </TapButton>
                <span className="ffh-eye-badge" title="Spectators">
                  <EyeSvg />
                  <span>1</span>
                </span>
                <span
                  className={`ffh-signal-badge ${connected && pairStatus.linked ? "online" : "offline"}`}
                  title={`Paired Session: ${pairToken}`}
                >
                  <span
                    className={
                      connected && pairStatus.linked
                        ? "mc-dot mc-dot-live"
                        : "mc-dot mc-dot-wait"
                    }
                  />
                  {!connected
                    ? relayStatus === "offline"
                      ? "OFFLINE"
                      : "WAIT"
                    : pairStatus.linked
                      ? "SYNC"
                      : "UNPAIRED"}
                </span>
              </div>

              <div className="ffh-tl-tool-row">
                <TapButton
                  className={`ffh-mini-circle-btn ${autoRun ? "active" : ""}`}
                  onTrigger={toggleAutoRun}
                  title="Auto-Run / Sprint"
                >
                  <SprintSvg />
                </TapButton>
                <TapButton
                  className="ffh-mini-circle-btn"
                  onTrigger={() => emitAction("camera")}
                  title="Switch Camera"
                >
                  <Icons.Camera />
                </TapButton>
                <TapButton
                  className="ffh-mini-circle-btn"
                  onTrigger={() => emitAction("reset")}
                  title="Reset Car"
                >
                  <Icons.Reset />
                </TapButton>
                <TapButton
                  className={`ffh-fullscreen-pill ${isFullscreen ? "active" : ""}`}
                  onTrigger={toggleFullscreen}
                  title="Toggle Fullscreen Landscape"
                >
                  <Icons.Fullscreen />
                  <span>{isFullscreen ? "EXIT" : "FULL"}</span>
                </TapButton>
                <TapButton
                  className={`ffh-mini-circle-btn ${customHudEditing ? "active" : ""}`}
                  onTrigger={() => setCustomHudEditing((v) => !v)}
                  title="Customize HUD (Size, Transparency & Position)"
                  data-testid="phone-custom-hud-btn"
                >
                  <HudLayoutSvg />
                </TapButton>
              </div>
            </div>
          </div>

          {/* 2. TOP-CENTER: HELMET/VEST + EP/HP + FF 500 + SAFE ZONE + KILL FEED */}
          <FreeFireTopCenterCluster
            helmetLevel={telemetry.helmetLevel ?? 3}
            vestLevel={telemetry.vestLevel ?? 3}
            ep={telemetry.ep ?? 180}
            playerHp={telemetry.hp ?? 100}
            cardinal={cardinal}
            headingDeg={headingDeg}
            matchElapsed={telemetry.matchElapsed || 0}
            killFeed={telemetry.killFeed || []}
          />

          {/* 3. TOP-RIGHT: TEAL ALIVE + CRIMSON KILLS + GEAR + WEAPON CARDS */}
          <FreeFireTopRightCluster
            aliveCount={telemetry.aliveCount ?? 7}
            kills={telemetry.kills ?? 0}
            onOpenSettings={() => setSettingsOpen(true)}
            showWeaponCards={true}
            showWeaponChips={false}
            weaponId={activeWeaponId}
            ammoState={telemetry.ammoState || DEFAULT_AMMO_STATE}
            reloading={Boolean(telemetry.reloading)}
            primaryWeapon={telemetry.primaryWeapon || "m4a1"}
            secondaryWeapon={telemetry.secondaryWeapon || "deagle"}
            onSwitchWeapon={() => emitAction("switchWeapon")}
            onReloadWeapon={() => emitAction("reloadWeapon")}
            onSelectWeapon={(id) => emitAction(`selectWeapon:${id}`)}
          />

          {/* 4. AIRCRAFT EJECT / VICTORY / DEFEAT BANNER */}
          {(telemetry.matchStatus === "DROPPING" || customHudEditing) && (
            <CustomHudElement
              id="dropParachute"
              editMode={customHudEditing}
              selected={selectedHudElem === "dropParachute"}
              cfg={hudLayout.dropParachute}
              onSelect={setSelectedHudElem}
              onMove={handleMoveLayout}
            >
              <div className="ffh-drop-banner mc-ff-drop-banner ffh-interactive">
                {telemetry.aircraftPhase === "flying" || customHudEditing ? (
                  <TapButton
                    className="ffh-eject-btn"
                    onTrigger={() => emitAction("ejectAircraft")}
                  >
                    EJECT PARACHUTE
                  </TapButton>
                ) : (
                  <div className="ffh-parachute-chip">
                    PARACHUTE DEPLOYED · STEER WITH JOYSTICK
                  </div>
                )}
              </div>
            </CustomHudElement>
          )}

          {(telemetry.matchStatus === "VICTORY" ||
            telemetry.matchStatus === "DEFEAT") && (
            <div className="mc-ff-result-banner ffh-interactive">
              <span
                className={
                  telemetry.matchStatus === "VICTORY"
                    ? "mc-ff-result-title booyah"
                    : "mc-ff-result-title eliminated"
                }
              >
                {telemetry.matchStatus === "VICTORY"
                  ? "BOOYAH! VICTORY"
                  : "ELIMINATED"}
              </span>
              <TapButton
                className="ffh-eject-btn mc-ff-play-again"
                onTrigger={() => emitAction("playAgain")}
              >
                PLAY AGAIN
              </TapButton>
            </div>
          )}

          {/* LOADOUT & EMOTE DRAWERS (WHEN OPEN) */}
          {bagOpen && (
            <div className="mc-ff-loadout-drawer ffh-interactive" style={{ zIndex: 120 }}>
              {WEAPON_ORDER.map((id) => {
                const slotAmmo =
                  (telemetry.ammoState || DEFAULT_AMMO_STATE)[id] || {
                    mag: 0,
                    reserve: 0,
                  };
                const active = activeWeaponId === id;
                return (
                  <TapButton
                    key={id}
                    className={`mc-ff-loadout-item ${active ? "active" : ""}`}
                    onTrigger={() => {
                      emitAction(`selectWeapon:${id}`);
                      setBagOpen(false);
                    }}
                  >
                    <WeaponSilhouetteSvg
                      weaponId={id}
                      className="mc-ff-loadout-svg"
                    />
                    <span>{WEAPONS[id]?.name}</span>
                    <small>
                      {id === "fist"
                        ? "∞"
                        : `${slotAmmo.mag}/${slotAmmo.reserve}`}
                    </small>
                  </TapButton>
                );
              })}
            </div>
          )}

          {emotesOpen && (
            <div className="mc-ff-emote-drawer ffh-interactive" style={{ zIndex: 120 }}>
              {CONTROLLER_EMOTES.map((emote) => (
                <TapButton
                  key={emote.id}
                  className="mc-ff-emote-chip"
                  onTrigger={() => {
                    emitAction(`emote:${emote.id}`);
                    setEmotesOpen(false);
                  }}
                >
                  {emote.label}
                </TapButton>
              ))}
            </div>
          )}

          {/* 5. INDIVIDUAL CUSTOM HUD CONTROLS (FREE FIRE CUSTOM HUD) */}
          {/* JOYSTICK */}
          <CustomHudElement
            id="joystick"
            editMode={customHudEditing}
            selected={selectedHudElem === "joystick"}
            cfg={hudLayout.joystick}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <div
              ref={joyBoxRef}
              className={`ffh-joystick-pad mc-ff-joy-hit ${joyKnob.active ? "active" : ""}`}
              onTouchStart={customHudEditing ? undefined : handleMoveJoyStart}
              onTouchMove={customHudEditing ? undefined : handleMoveJoyMove}
              onTouchEnd={customHudEditing ? undefined : handleMoveJoyEnd}
              onTouchCancel={customHudEditing ? undefined : handleMoveJoyEnd}
              onMouseDown={customHudEditing ? undefined : handleMoveJoyStart}
              onMouseMove={customHudEditing ? undefined : handleMoveJoyMove}
              onMouseUp={customHudEditing ? undefined : handleMoveJoyEnd}
              onMouseLeave={customHudEditing ? undefined : handleMoveJoyEnd}
            >
              <div
                className={`ffh-joystick-knob ${joyKnob.active ? "active" : ""}`}
                style={{
                  transform: `translate(${joyKnob.x}px, ${joyKnob.y}px)`,
                }}
              />
            </div>
          </CustomHudElement>

          {/* LEFT FIRE */}
          <CustomHudElement
            id="leftFire"
            editMode={customHudEditing}
            selected={selectedHudElem === "leftFire"}
            cfg={hudLayout.leftFire}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <HoldButton
              className="ffh-action-circle static-pos"
              activeClassName="active"
              onChange={(v) => {
                if (customHudEditing) return;
                setFiringActive(v);
                updateField("fire", v);
              }}
            >
              <FireBulletSvg />
            </HoldButton>
          </CustomHudElement>

          {/* QUICK WEAPON SWITCH */}
          <CustomHudElement
            id="switchWeapon"
            editMode={customHudEditing}
            selected={selectedHudElem === "switchWeapon"}
            cfg={hudLayout.switchWeapon}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className="ffh-action-circle static-pos"
              onTrigger={() => {
                if (customHudEditing) return;
                emitAction("switchWeapon");
              }}
              title="Cycle Weapon"
            >
              <ReloadSvg />
              <span className="ffh-key-hint">Q</span>
            </TapButton>
          </CustomHudElement>

          {/* MEDKIT */}
          <CustomHudElement
            id="medkit"
            editMode={customHudEditing}
            selected={selectedHudElem === "medkit"}
            cfg={hudLayout.medkit}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-utility-circle ${medkitHealing ? "healing" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                handleMobileHeal();
              }}
              disabled={
                !customHudEditing &&
                ((telemetry.medkits ?? 0) <= 0 ||
                  telemetry.hp >= 100 ||
                  medkitHealing)
              }
              title="Use Medkit"
            >
              <MedkitSvg />
              <span className="ffh-count-badge">{telemetry.medkits ?? 0}</span>
            </TapButton>
          </CustomHudElement>

          {/* BACKPACK */}
          <CustomHudElement
            id="backpack"
            editMode={customHudEditing}
            selected={selectedHudElem === "backpack"}
            cfg={hudLayout.backpack}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-utility-circle ${bagOpen ? "healing" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                setBagOpen((v) => !v);
                setEmotesOpen(false);
              }}
              title="Backpack / Weapon Loadout"
            >
              <BackpackSvg />
            </TapButton>
          </CustomHudElement>

          {/* EMOTES */}
          <CustomHudElement
            id="emotes"
            editMode={customHudEditing}
            selected={selectedHudElem === "emotes"}
            cfg={hudLayout.emotes}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-utility-circle ${emotesOpen ? "healing" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                setEmotesOpen((v) => !v);
                setBagOpen(false);
              }}
              title="Emotes"
            >
              <EmoteWaveSvg />
            </TapButton>
          </CustomHudElement>

          {/* SCOPE / ADS */}
          <CustomHudElement
            id="aimScope"
            editMode={customHudEditing}
            selected={selectedHudElem === "aimScope"}
            cfg={hudLayout.aimScope}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-action-circle ffh-btn-scope ${aimActive ? "active" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                handleToggleAim();
              }}
              title="Scope / ADS"
            >
              <ScopeSvg />
            </TapButton>
          </CustomHudElement>

          {/* JUMP */}
          <CustomHudElement
            id="jump"
            editMode={customHudEditing}
            selected={selectedHudElem === "jump"}
            cfg={hudLayout.jump}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <HoldButton
              className="ffh-action-circle ffh-btn-jump"
              activeClassName="active"
              onChange={(v) => {
                if (customHudEditing) return;
                updateField("jump", v);
              }}
            >
              <JumpSoldierSvg />
            </HoldButton>
          </CustomHudElement>

          {/* PRIMARY FIRE (DRAGGABLE FIRE BUTTON) */}
          <CustomHudElement
            id="rightFire"
            editMode={customHudEditing}
            selected={selectedHudElem === "rightFire"}
            cfg={hudLayout.rightFire}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <DraggableFireButton
              className="ffh-action-circle ffh-btn-fire"
              isFiring={firingActive}
              editMode={customHudEditing}
              onFireStart={() => {
                if (customHudEditing) return;
                setFiringActive(true);
                updateField("fire", true);
              }}
              onFireEnd={() => {
                setFiringActive(false);
                updateField("fire", false);
                updateField("dragUp", false);
                delete inputRef.current.lookDeltaX;
                delete inputRef.current.lookDeltaY;
                emitInput({ lookDeltaX: 0, lookDeltaY: 0 });
              }}
              onFireDrag={({ dragUpActive }) => {
                if (customHudEditing) return;
                updateField("dragUp", dragUpActive);
              }}
            >
              <FireBulletSvg />
            </DraggableFireButton>
          </CustomHudElement>

          {/* CROUCH */}
          <CustomHudElement
            id="crouch"
            editMode={customHudEditing}
            selected={selectedHudElem === "crouch"}
            cfg={hudLayout.crouch}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-action-circle ffh-btn-crouch ${crouchActive ? "active" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                handleToggleCrouch();
              }}
              title="Crouch"
            >
              <CrouchSoldierSvg />
            </TapButton>
          </CustomHudElement>

          {/* RELOAD */}
          <CustomHudElement
            id="reload"
            editMode={customHudEditing}
            selected={selectedHudElem === "reload"}
            cfg={hudLayout.reload}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className="ffh-action-circle ffh-btn-reload"
              onTrigger={() => {
                if (customHudEditing) return;
                emitAction("reloadWeapon");
              }}
              title="Reload"
            >
              <ReloadSvg />
              <span className="ffh-key-hint">R</span>
            </TapButton>
          </CustomHudElement>

          {/* DRIVE BMW */}
          <CustomHudElement
            id="drive"
            editMode={customHudEditing}
            selected={selectedHudElem === "drive"}
            cfg={hudLayout.drive}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-action-circle ffh-btn-drive ${telemetry.nearCar ? "ready" : "standby"}`}
              onTrigger={() => {
                if (customHudEditing) return;
                emitAction("toggleVehicle");
              }}
              title="Enter / Drive BMW M4"
            >
              <CarDriveSvg />
              <span className="ffh-key-hint">F</span>
            </TapButton>
          </CustomHudElement>

          {/* 6. FLOATING CUSTOM HUD TOP BAR & SLIDERS OVERLAY (ON MOBILE) */}
          {customHudEditing && (
            <CustomHudEditorBar
              activePreset={activePreset}
              selectedId={selectedHudElem}
              layout={hudLayout}
              onChangeLayout={handleUpdateLayout}
              onSwitchPreset={handleSwitchPreset}
              onResetLayout={handleResetLayout}
              onResetSelectedElement={handleResetSelected}
              onSaveLayout={handleSaveLayout}
              onExitEdit={() => setCustomHudEditing(false)}
            />
          )}
        </div>
      ) : (
        <>
          <div className="mc-rpm-strip">
            {Array.from({ length: ledCount }).map((_, idx) => {
              const isOn = idx < activeLeds;
              const tier = idx < 6 ? "green" : idx < 10 ? "blue" : "red";
              return (
                <span
                  key={idx}
                  className={`mc-shift-led ${isOn ? `on ${tier}` : ""}`}
                />
              );
            })}
          </div>

          <header className="mc-header">
            <div className="mc-brand-status">
              <div className="mc-m-badge">M</div>
              <div>
                <div className="mc-conn-row">
                  <span
                    className={
                      connected ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"
                    }
                  />
                  <span className="mc-conn-text">
                    {connected
                      ? "M-LINK ACTIVE"
                      : relayStatus === "offline"
                        ? "RELAY OFFLINE"
                        : "CONNECTING..."}
                  </span>
                </div>
                <div className="mc-sub-mode">
                  {steerMode === "tilt"
                    ? "GYRO TILT · L: BRAKE | R: ACCEL"
                    : `WHEEL (${steerSide.toUpperCase()}) · CIRCULAR TOUCH`}
                </div>
              </div>
            </div>

            <div className="mc-digital-cluster">
              <div className="mc-speed-block">
                <span className="mc-speed-digits">
                  {String(Math.abs(telemetry.speed || 0)).padStart(3, "0")}
                </span>
                <span className="mc-speed-unit">KM/H</span>
              </div>
              <div className="mc-cluster-divider" />
              <div className="mc-gear-block">
                <span className="mc-gear-label">GEAR</span>
                <span className="mc-gear-digit">
                  {telemetry.gear || "N"}
                </span>
              </div>
            </div>

            <div className="mc-icon-toolbar">
              <TapButton
                className="mc-icon-btn mc-action-pill"
                onTrigger={() => emitAction("toggleVehicle")}
                title="Exit Car"
              >
                EXIT CAR
              </TapButton>

              <TapButton
                className="mc-icon-btn"
                onTrigger={() => emitAction("camera")}
                title="Switch Camera"
              >
                <Icons.Camera />
              </TapButton>

              <TapButton
                className="mc-icon-btn"
                onTrigger={() => emitAction("reset")}
                title="Reset Car"
              >
                <Icons.Reset />
              </TapButton>

              <TapButton
                className="mc-icon-btn"
                onTrigger={toggleFullscreen}
                title="Fullscreen Landscape"
              >
                <Icons.Fullscreen />
              </TapButton>

              <TapButton
                className="mc-icon-btn mc-settings-trigger"
                onTrigger={() => setSettingsOpen(true)}
                title="Controller Settings"
              >
                <Icons.Settings />
              </TapButton>
            </div>
          </header>

          <HoldButton
            className="mc-jump-btn mc-jump-floating"
            activeClassName="is-pressed"
            onChange={(v) => updateField("jump", v)}
          >
            <span className="mc-jump-icon">↑</span>
            <span>JUMP</span>
          </HoldButton>

          {steerMode === "tilt" ? (
            <div className="mc-gyro-layout">
              <div className="mc-gyro-side">
                <HoldButton
                  className="mc-aux-btn mc-drift-btn"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("handbrake", v)}
                >
                  <span className="mc-btn-icon">
                    <Icons.Drift />
                  </span>
                  <span className="mc-aux-label">DRIFT</span>
                </HoldButton>

                <HoldButton
                  className="mc-pedal mc-brake-pedal"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("brake", v)}
                >
                  <div className="mc-pedal-treads">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="mc-pedal-icon">
                    <Icons.BrakeDisc />
                  </div>
                  <div className="mc-pedal-title">BRAKE</div>
                  <div className="mc-pedal-sub">REVERSE</div>
                </HoldButton>
              </div>

              <div className="mc-gyro-center-card">
                <div className="mc-gyro-badge">
                  <Icons.Gyro />
                  <span>TILT PHONE TO STEER</span>
                </div>

                {!gyroActive ? (
                  <TapButton
                    className="mc-enable-gyro-action-btn"
                    onTrigger={openGyroPrompt}
                  >
                    ENABLE GYRO SENSORS
                  </TapButton>
                ) : (
                  <div className="mc-gyro-horizon">
                    <div
                      className="mc-gyro-horizon-bar"
                      style={{
                        transform: `rotate(${Math.round(-steerVal * 35)}deg)`,
                      }}
                    >
                      <span className="mc-horizon-tip" />
                      <span className="mc-horizon-center" />
                      <span className="mc-horizon-tip" />
                    </div>
                    <div className="mc-gyro-angle-val">
                      {steerVal > 0.04
                        ? `LEFT ${Math.round(steerVal * 100)}%`
                        : steerVal < -0.04
                          ? `RIGHT ${Math.round(Math.abs(steerVal) * 100)}%`
                          : "0° CENTER"}
                    </div>
                  </div>
                )}

                {gyroPermNeeded && (
                  <div className="mc-gyro-perm-warning">
                    PERMISSION DENIED. CHECK BROWSER HTTPS/PERMISSIONS.
                  </div>
                )}

                <TapButton
                  className="mc-recenter-pill"
                  onTrigger={calibrateTilt}
                >
                  ZERO TILT (CENTER)
                </TapButton>
              </div>

              <div className="mc-gyro-side">
                <HoldButton
                  className="mc-aux-btn mc-boost-btn"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("boost", v)}
                >
                  <span className="mc-btn-icon">
                    <Icons.Boost />
                  </span>
                  <span className="mc-aux-label">M-BOOST</span>
                </HoldButton>

                <HoldButton
                  className="mc-pedal mc-gas-pedal"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("accelerate", v)}
                >
                  <div className="mc-pedal-treads">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="mc-pedal-icon">
                    <Icons.GasPedal />
                  </div>
                  <div className="mc-pedal-title">ACCEL</div>
                  <div className="mc-pedal-sub">THROTTLE</div>
                </HoldButton>
              </div>
            </div>
          ) : (
            <div
              className={
                steerSide === "right"
                  ? "mc-wheel-layout wheel-on-right"
                  : "mc-wheel-layout wheel-on-left"
              }
            >
              <div
                ref={wheelBoxRef}
                className="mc-rotary-wheel-zone"
                onTouchStart={handleWheelStart}
                onTouchMove={handleWheelMove}
                onTouchEnd={handleWheelEnd}
                onTouchCancel={handleWheelEnd}
                onMouseDown={handleWheelStart}
                onMouseMove={(e) => {
                  if (e.buttons === 1) handleWheelMove(e);
                }}
                onMouseUp={handleWheelEnd}
                onMouseLeave={handleWheelEnd}
              >
                <div className="mc-rotary-ring-guide">
                  <div className="mc-rotary-glow" />
                  <SteeringWheelGraphic
                    steerValue={steerVal}
                    activeGrab={wheelGrabbed}
                  />
                </div>

                <div className="mc-rotary-footer">
                  <span className="mc-rotary-hint">CIRCULAR ROTATION</span>
                  <span className="mc-rotary-deg">
                    {Math.round(-steerVal * MAX_WHEEL_ROTATION_DEG)}°
                  </span>
                </div>
              </div>

              <div className="mc-dual-pedals-zone">
                <div className="mc-aux-row">
                  <HoldButton
                    className="mc-aux-btn mc-drift-btn"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("handbrake", v)}
                  >
                    <span className="mc-btn-icon">
                      <Icons.Drift />
                    </span>
                    <span className="mc-aux-label">DRIFT</span>
                  </HoldButton>

                  <HoldButton
                    className="mc-aux-btn mc-boost-btn"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("boost", v)}
                  >
                    <span className="mc-btn-icon">
                      <Icons.Boost />
                    </span>
                    <span className="mc-aux-label">M-BOOST</span>
                  </HoldButton>
                </div>

                <div className="mc-pedals-pair">
                  <HoldButton
                    className="mc-pedal mc-brake-pedal"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("brake", v)}
                  >
                    <div className="mc-pedal-treads">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mc-pedal-icon">
                      <Icons.BrakeDisc />
                    </div>
                    <div className="mc-pedal-title">BRAKE</div>
                    <div className="mc-pedal-sub">REVERSE</div>
                  </HoldButton>

                  <HoldButton
                    className="mc-pedal mc-gas-pedal"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("accelerate", v)}
                  >
                    <div className="mc-pedal-treads">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mc-pedal-icon">
                      <Icons.GasPedal />
                    </div>
                    <div className="mc-pedal-title">ACCEL</div>
                    <div className="mc-pedal-sub">THROTTLE</div>
                  </HoldButton>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {settingsOpen && (
        <div
          className="mc-modal-backdrop"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="mc-settings-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mc-settings-header">
              <div className="mc-settings-title">
                <Icons.Settings />
                <span>CONTROLLER & HUD SETTINGS</span>
              </div>
              <TapButton
                className="mc-icon-btn"
                onTrigger={() => setSettingsOpen(false)}
              >
                <Icons.Close />
              </TapButton>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">STEERING MODE</div>
              <div className="mc-segmented">
                <TapButton
                  className={
                    steerMode === "wheel" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onTrigger={() => {
                    setSteerMode("wheel");
                    inputRef.current.steer = 0;
                    setSteerVal(0);
                    emitInput();
                  }}
                >
                  <Icons.Wheel />
                  <span>STEERING WHEEL</span>
                </TapButton>
                <TapButton
                  className={
                    steerMode === "tilt" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onTrigger={openGyroPrompt}
                >
                  <Icons.Gyro />
                  <span>GYRO TILT (PEDALS)</span>
                </TapButton>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">STEERING SIDE (WHEEL MODE)</div>
              <div className="mc-segmented">
                <TapButton
                  className={
                    steerSide === "left" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onTrigger={() => handleSteerSideChange("left")}
                >
                  <span>STEER LEFT · PEDALS RIGHT</span>
                </TapButton>
                <TapButton
                  className={
                    steerSide === "right" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onTrigger={() => handleSteerSideChange("right")}
                >
                  <span>STEER RIGHT · PEDALS LEFT</span>
                </TapButton>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">WORLD ENVIRONMENT</div>
              <div className="mc-segmented">
                {Object.entries(SCENE_PRESETS).map(([key, item]) => (
                  <TapButton
                    key={key}
                    className={
                      scenePreset === key ? "mc-seg-btn active" : "mc-seg-btn"
                    }
                    onTrigger={() => handleSceneChange(key)}
                  >
                    <span>{item.label}</span>
                  </TapButton>
                ))}
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">
                LAPTOP PAIR SESSION ({pairToken})
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  value={pairDraft}
                  onChange={(e) => setPairDraft(e.target.value)}
                  placeholder="pair_xxxxxxxx"
                  style={{
                    flex: 1,
                    background: "rgba(15, 23, 42, 0.85)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    padding: "8px 10px",
                    fontSize: "12px",
                  }}
                />
                <TapButton
                  className="mc-seg-btn active"
                  style={{ flex: "0 0 auto", padding: "8px 14px" }}
                  onTrigger={() => {
                    const clean =
                      pairDraft.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) ||
                      "default";
                    setPairDraft(clean);
                    setPairToken(clean);
                  }}
                >
                  <span>PAIR</span>
                </TapButton>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">FREE FIRE CUSTOM HUD</div>
              <TapButton
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
                onTrigger={() => {
                  setSettingsOpen(false);
                  setCustomHudEditing(true);
                }}
                data-testid="phone-settings-open-hud-btn"
              >
                <HudLayoutSvg />
                <span>CUSTOMIZE HUD (SIZE, TRANSPARENCY & LAYOUT)</span>
              </TapButton>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">DISPLAY &amp; FULLSCREEN</div>
              <TapButton
                className={
                  isFullscreen ? "mc-seg-btn active" : "mc-seg-btn"
                }
                style={{ width: "100%", padding: "10px 14px" }}
                onTrigger={() => {
                  toggleFullscreen();
                  setSettingsOpen(false);
                }}
              >
                <Icons.Fullscreen />
                <span>
                  {isFullscreen
                    ? "EXIT FULLSCREEN"
                    : "ENTER FULLSCREEN LANDSCAPE"}
                </span>
              </TapButton>
            </div>
          </div>
        </div>
      )}

      {fsHint && <div className="mc-fs-hint-pill">{fsHint}</div>}

      {gyroPromptOpen && (
        <div
          className="mc-modal-backdrop mc-gyro-modal-backdrop"
          onClick={() => setGyroPromptOpen(false)}
        >
          <div
            className="mc-gyro-permission-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mc-gyro-modal-icon">
              <Icons.Gyro />
            </div>
            <h2>ENABLE GYRO SENSORS</h2>
            <p>
              Use your phone's motion sensors to control the steering of your
              BMW M4.
            </p>
            <div className="mc-gyro-instructions">
              <div>01. Hold your phone horizontally.</div>
              <div>02. Allow motion sensor permission.</div>
              <div>03. Tilt your phone to steer.</div>
            </div>
            <div className="mc-gyro-status">
              <span
                className={
                  gyroActive ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"
                }
              />
              {gyroActive
                ? gyroSensorDetected
                  ? "GYROSCOPE ACTIVE"
                  : "WAITING FOR SENSOR DATA"
                : "SENSOR NOT ACTIVATED"}
            </div>
            {gyroError && (
              <div className="mc-gyro-modal-error">{gyroError}</div>
            )}
            <TapButton
              className="mc-enable-gyro-action-btn"
              onTrigger={requestAndEnableGyro}
            >
              {gyroError ? "RETRY GYRO ACTIVATION" : "ENABLE SENSORS"}
            </TapButton>
            <TapButton
              className="mc-recenter-pill"
              onTrigger={() => setGyroPromptOpen(false)}
            >
              CANCEL
            </TapButton>
          </div>
        </div>
      )}
    </div>
  );
}
