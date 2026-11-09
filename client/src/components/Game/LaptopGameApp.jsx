import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Loader } from "@react-three/drei";
import * as THREE from "three";
import { io } from "socket.io-client";

import {
  CAMERA_MODES,
  INITIAL_TELEMETRY,
  MAX_WHEEL_ROTATION_DEG,
} from "../../config/gameConstants";
import { getNetworkControllerUrl, getSocketUrl } from "../../utils/network";
import OpenWorldMap from "../World/OpenWorldMap";
import DrivingWorld from "../World/DrivingWorld";
import FollowCamera from "../World/FollowCamera";
import BMWM4 from "../Car/BMWM4";
import CarController from "../Car/CarController";
import CharacterModel from "../Character/CharacterModel";
import CharacterController from "../Character/CharacterController";
import Icons from "../UI/Icons";
import SteeringWheelGraphic from "../UI/SteeringWheelGraphic";
import SportSpeedometer from "../UI/SportSpeedometer";
import { GameSettingsModal, QrConnectModal } from "../UI/GameModals";

const DRIVER_DOOR_OFFSET = new THREE.Vector3(-0.25, 0, 1.42);
const INTERACTION_DISTANCE = 3.4;
const MAX_ENTER_SPEED_KMH = 2.5;
const TRANSITION_FALLBACK_MS = 1600;

const EMOTES = [
  { key: "1", id: "wave", label: "Wave" },
  { key: "2", id: "dance", label: "Dance" },
  { key: "3", id: "salute", label: "Salute" },
  { key: "4", id: "celebrate", label: "Celebrate" },
  { key: "5", id: "point", label: "Point" },
  { key: "6", id: "sit", label: "Sit" },
];

function getDriverDoorPosition(car, target = new THREE.Vector3()) {
  if (!car) return target.set(0, 0, 0);
  const yaw = car.rotation.y;
  target
    .copy(DRIVER_DOOR_OFFSET)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  target.add(car.position);
  return target;
}

export default function LaptopGameApp() {
  const [scenePreset, setScenePreset] = useState("track");
  const [cameraMode, setCameraMode] = useState("chase");
  const [steerHudSide, setSteerHudSide] = useState("left");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [phoneLinked, setPhoneLinked] = useState(false);
  const [playerMode, setPlayerMode] = useState("driving"); // driving | onFoot | entering | exiting
  const [charAnimation, setCharAnimation] = useState("idle");
  const [characterVisible, setCharacterVisible] = useState(false);
  const [nearCar, setNearCar] = useState(false);
  const [interactionMessage, setInteractionMessage] = useState("");
  const [emoteActive, setEmoteActive] = useState(false);
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [modelError, setModelError] = useState("");

  const collidersRef = useRef([]);
  const carRef = useRef(null);
  const characterRef = useRef(null);
  const wheelAssembliesRef = useRef([]);
  const socketRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const interactionPointRef = useRef(new THREE.Vector3());
  const cameraYawRef = useRef(0);
  const physicsStateRef = useRef({
    vx: 0,
    vy: 0,
    steering: 0,
    isDrifting: false,
    boost: false,
  });
  const remoteInputRef = useRef({
    accelerate: false,
    brake: false,
    handbrake: false,
    boost: false,
    jump: false,
    steer: 0,
    reset: false,
  });

  const isCharacterMode = playerMode === "onFoot" || playerMode === "exiting";
  const isTransitioning = playerMode === "entering" || playerMode === "exiting";
  const speedKmh = Math.abs(Number(telemetry.speed) || 0);

  const clearRemoteInput = useCallback(() => {
    Object.assign(remoteInputRef.current, {
      accelerate: false,
      brake: false,
      handbrake: false,
      boost: false,
      jump: false,
      steer: 0,
    });
  }, []);

  const cycleCamera = useCallback(() => {
    setCameraMode((previous) => {
      const index = CAMERA_MODES.findIndex((item) => item.id === previous);
      return CAMERA_MODES[(index + 1) % CAMERA_MODES.length].id;
    });
  }, []);

  const finishTransition = useCallback((expectedMode) => {
    if (expectedMode === "entering") {
      setCharacterVisible(false);
      setPlayerMode("driving");
    } else if (expectedMode === "exiting") {
      setPlayerMode("onFoot");
      setCharAnimation("idle");
    }
    setEmoteActive(false);
    transitionTimerRef.current = null;
  }, []);

  const enterVehicle = useCallback(() => {
    if (
      playerMode !== "onFoot" ||
      !nearCar ||
      !carRef.current ||
      !characterRef.current
    )
      return;
    if (speedKmh > MAX_ENTER_SPEED_KMH) {
      setInteractionMessage("Stop the BMW before entering");
      return;
    }

    clearRemoteInput();
    const door = getDriverDoorPosition(
      carRef.current,
      interactionPointRef.current,
    );
    characterRef.current.position.copy(door);
    characterRef.current.rotation.y = carRef.current.rotation.y + Math.PI / 2;
    setEmoteActive(false);
    setCharAnimation("enterCar");
    setPlayerMode("entering");
    setInteractionMessage("Entering BMW M4...");

    if (transitionTimerRef.current)
      window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(
      () => finishTransition("entering"),
      TRANSITION_FALLBACK_MS,
    );
  }, [playerMode, nearCar, speedKmh, clearRemoteInput, finishTransition]);

  const exitVehicle = useCallback(() => {
    if (playerMode !== "driving" || !carRef.current || !characterRef.current)
      return;
    if (speedKmh > MAX_ENTER_SPEED_KMH) {
      setInteractionMessage("Brake and stop before exiting");
      return;
    }

    clearRemoteInput();
    const door = getDriverDoorPosition(
      carRef.current,
      interactionPointRef.current,
    );
    characterRef.current.position.copy(door);
    characterRef.current.rotation.y = carRef.current.rotation.y + Math.PI / 2;
    setCharacterVisible(true);
    setCharAnimation("exitCar");
    setPlayerMode("exiting");
    setInteractionMessage("Exiting BMW M4...");

    if (transitionTimerRef.current)
      window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(
      () => finishTransition("exiting"),
      TRANSITION_FALLBACK_MS,
    );
  }, [playerMode, speedKmh, clearRemoteInput, finishTransition]);

  const toggleVehicle = useCallback(() => {
    if (playerMode === "onFoot") enterVehicle();
    else if (playerMode === "driving") exitVehicle();
  }, [playerMode, enterVehicle, exitVehicle]);

  const playEmote = useCallback(
    (emoteId) => {
      if (
        playerMode !== "onFoot" ||
        emoteActive ||
        !EMOTES.some((item) => item.id === emoteId)
      )
        return;
      setCharAnimation(emoteId);
      setEmoteActive(true);
    },
    [playerMode, emoteActive],
  );

  const handleCharacterAnimationFinished = useCallback(
    (finishedAnimation) => {
      if (finishedAnimation === "enterCar") {
        finishTransition("entering");
        return;
      }
      if (finishedAnimation === "exitCar") {
        finishTransition("exiting");
        return;
      }
      setEmoteActive(false);
      setCharAnimation("idle");
    },
    [finishTransition],
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.repeat ||
        event.target?.tagName === "INPUT" ||
        event.target?.tagName === "TEXTAREA"
      )
        return;
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleVehicle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleVehicle]);

  // Keep the interaction prompt tied to the actual driver-side door, not the car centre.
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (playerMode !== "onFoot" || !carRef.current || !characterRef.current) {
        setNearCar(false);
        if (playerMode === "driving") {
          setInteractionMessage(
            speedKmh > MAX_ENTER_SPEED_KMH ? "Brake and stop to exit" : "",
          );
        }
        return;
      }
      const door = getDriverDoorPosition(
        carRef.current,
        interactionPointRef.current,
      );
      const distance = characterRef.current.position.distanceTo(door);
      const canReach = distance <= INTERACTION_DISTANCE;
      setNearCar(canReach);
      setInteractionMessage(
        canReach
          ? speedKmh <= MAX_ENTER_SPEED_KMH
            ? "Press F to enter BMW M4"
            : "Stop the BMW to enter"
          : "",
      );
    }, 120);
    return () => window.clearInterval(interval);
  }, [playerMode, speedKmh]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current)
        window.clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const socket = io(getSocketUrl(), { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.on("controller:input", (data) => {
      setPhoneLinked(true);
      remoteInputRef.current.accelerate = Boolean(data.accelerate);
      remoteInputRef.current.brake = Boolean(data.brake);
      remoteInputRef.current.handbrake = Boolean(data.handbrake);
      remoteInputRef.current.boost = Boolean(data.boost);
      remoteInputRef.current.jump = Boolean(data.jump);
      remoteInputRef.current.steer = Number(data.steer) || 0;
    });
    socket.on("controller:action", (action) => {
      if (action === "camera") cycleCamera();
      if (action === "reset") remoteInputRef.current.reset = true;
    });
    socket.on("controller:settings", (settings) => {
      if (settings.steerHudSide) setSteerHudSide(settings.steerHudSide);
      if (settings.scenePreset) setScenePreset(settings.scenePreset);
    });
    socket.on("controller:disconnected", () => setPhoneLinked(false));
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [cycleCamera]);

  useEffect(() => {
    if (playerMode !== "driving") clearRemoteInput();
  }, [playerMode, clearRemoteInput]);

  const handleCollision = useCallback((impactSpeed) => {
    const intensity = Math.max(0, Math.min(1, impactSpeed / 28));
    if (intensity < 0.08) return;
    const pulse = Math.round(18 + intensity * 105);
    const pause = Math.round(18 + (1 - intensity) * 28);
    socketRef.current?.emit("game:haptic", [
      pulse,
      pause,
      Math.round(pulse * 0.55),
    ]);
  }, []);

  const handleTelemetryChange = useCallback((nextTelemetry) => {
    setTelemetry(nextTelemetry);
    socketRef.current?.emit("game:telemetry", {
      speed: nextTelemetry.speed,
      gear: nextTelemetry.gear,
      rpm: nextTelemetry.rpm,
      drifting: nextTelemetry.drifting,
      boost: nextTelemetry.boost,
    });
  }, []);

  const handleWheelsReady = useCallback((rigData) => {
    wheelAssembliesRef.current = rigData;
  }, []);
  const handleModelError = useCallback((error) => {
    console.error("Model loading failed:", error);
    setModelError(
      "Could not load one or more 3D model assets. Check the model files and console.",
    );
  }, []);

  const currentSteer = telemetry.steerInput || 0;
  const networkUrl = getNetworkControllerUrl();
  const copyNetworkUrl = useCallback(() => {
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard
      .writeText(networkUrl)
      .catch((error) => console.error("Unable to copy controller URL:", error));
  }, [networkUrl]);

  return (
    <main className="game-shell">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[-7.4, 2.5, 0]}
          fov={44}
          near={0.1}
          far={320}
        />
        <Suspense fallback={null}>
          <OpenWorldMap collidersRef={collidersRef} />
        </Suspense>
        <DrivingWorld presetKey={scenePreset} />
        <Suspense fallback={null}>
          <BMWM4
            ref={carRef}
            onWheelsReady={handleWheelsReady}
            onError={handleModelError}
          />
          <CharacterModel
            ref={characterRef}
            animation={charAnimation}
            visible={characterVisible}
            onAnimationFinished={handleCharacterAnimationFinished}
          />
        </Suspense>
        <CarController
          carRef={carRef}
          wheelAssembliesRef={wheelAssembliesRef}
          collidersRef={collidersRef}
          enabled={playerMode === "driving"}
          onTelemetryChange={handleTelemetryChange}
          onCollision={handleCollision}
          physicsStateRef={physicsStateRef}
          remoteInputRef={remoteInputRef}
        />
        <CharacterController
          characterRef={characterRef}
          collidersRef={collidersRef}
          enabled={playerMode === "onFoot"}
          emoteActive={emoteActive}
          cameraYawRef={cameraYawRef}
          onAnimationChange={setCharAnimation}
          onEmote={(key) => {
            const emote = EMOTES.find((item) => item.key === key);
            if (emote) playEmote(emote.id);
          }}
        />
        <FollowCamera
          targetRef={isCharacterMode ? characterRef : carRef}
          physicsStateRef={physicsStateRef}
          cameraMode={cameraMode}
          isCharacterMode={isCharacterMode}
          orbitYawRef={cameraYawRef}
        />
      </Canvas>

      <div className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">M</span>
          <div>
            <div className="eyebrow">BMW M PERFORMANCE</div>
            <div className="brand-title">
              {isCharacterMode ? "OPEN WORLD CHARACTER" : "M4 COMPETITION"}
            </div>
          </div>
        </div>
        <div className="mc-icon-toolbar">
          {playerMode === "onFoot" ? (
            <button
              type="button"
              className="mc-icon-btn"
              onClick={enterVehicle}
              disabled={!nearCar || speedKmh > MAX_ENTER_SPEED_KMH}
              title="Enter BMW M4"
            >
              ENTER
            </button>
          ) : playerMode === "driving" ? (
            <button
              type="button"
              className="mc-icon-btn"
              onClick={exitVehicle}
              disabled={speedKmh > MAX_ENTER_SPEED_KMH}
              title="Exit BMW M4"
            >
              EXIT
            </button>
          ) : (
            <button type="button" className="mc-icon-btn" disabled>
              {playerMode === "entering" ? "ENTERING" : "EXITING"}
            </button>
          )}
          <button
            type="button"
            className="mc-icon-btn"
            onClick={() => setQrModalOpen(true)}
            title="Show Phone QR Code"
          >
            <Icons.QRCode />
          </button>
          <button
            type="button"
            className="mc-icon-btn"
            onClick={cycleCamera}
            title="Switch Camera"
          >
            <Icons.Camera />
          </button>
          <button
            type="button"
            className="mc-icon-btn"
            onClick={() => {
              remoteInputRef.current.reset = true;
            }}
            title="Reset Vehicle"
          >
            <Icons.Reset />
          </button>
          <button
            type="button"
            className="mc-icon-btn mc-settings-trigger"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
          >
            <Icons.Settings />
          </button>
        </div>
      </div>

      {playerMode === "driving" && (
        <>
          <section className={`steering-hud-pod side-${steerHudSide}`}>
            <div className="steering-hud-header">
              <span className="steering-angle-readout">
                {Math.round(-currentSteer * MAX_WHEEL_ROTATION_DEG)}°
              </span>
            </div>
            <div className="steering-wheel-ring-wrap">
              <SteeringWheelGraphic
                steerValue={currentSteer}
                activeGrab={false}
              />
            </div>
          </section>
          <div
            className={`drive-hud sport-hud side-${steerHudSide === "left" ? "right" : "left"}`}
          >
            <SportSpeedometer telemetry={telemetry} />
            <div className="telemetry-badges">
              {telemetry.drifting && (
                <div className="badge drift-badge">
                  DRIFT {telemetry.driftAngle}°
                </div>
              )}
              {telemetry.boost && (
                <div className="badge boost-badge">M-BOOST</div>
              )}
            </div>
          </div>
        </>
      )}

      {playerMode === "onFoot" && (
        <section className="character-action-panel">
          <div className="character-panel-heading">CHARACTER ACTIONS</div>
          <div className="character-emote-grid">
            {EMOTES.map((emote) => (
              <button
                key={emote.id}
                type="button"
                className="character-emote-btn"
                disabled={emoteActive}
                onClick={() => playEmote(emote.id)}
              >
                <span className="emote-key">{emote.key}</span>
                {emote.label}
              </button>
            ))}
          </div>
          <div className="character-control-hint">
            WASD MOVE · SHIFT SPRINT · SPACE JUMP · 1–6 EMOTES · F ENTER
          </div>
        </section>
      )}

      {(interactionMessage || isTransitioning) && (
        <div className="vehicle-interaction-prompt">
          {interactionMessage || "Please wait..."}
        </div>
      )}

      <QrConnectModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        networkUrl={networkUrl}
        onCopyUrl={copyNetworkUrl}
      />
      <GameSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        steerHudSide={steerHudSide}
        onSteerHudSideChange={setSteerHudSide}
        scenePreset={scenePreset}
        onScenePresetChange={setScenePreset}
      />
      {modelError && <div className="error-banner">{modelError}</div>}
      <div className="corner-status">
        <span
          className={phoneLinked ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"}
        />
        {playerMode === "driving"
          ? `DRIVING M4 · ${Math.round(speedKmh)} KM/H`
          : playerMode === "onFoot"
            ? "ON FOOT · EXPLORE THE WORLD"
            : playerMode.toUpperCase()}
      </div>
      <Loader containerStyles={{ background: "rgba(9,13,20,.92)" }} />
    </main>
  );
}
