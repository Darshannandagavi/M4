import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
import CharacterModel, { CHARACTER_SCALE } from "../Character/CharacterModel";
import CharacterController from "../Character/CharacterController";
import Icons from "../UI/Icons";
import SteeringWheelGraphic from "../UI/SteeringWheelGraphic";
import SportSpeedometer from "../UI/SportSpeedometer";
import { GameSettingsModal, QrConnectModal } from "../UI/GameModals";

// Car faces +X when yaw = 0, so Left (driver side) is -Z
const DRIVER_DOOR_OFFSET = new THREE.Vector3(0.05, 0, -1.35);
const DRIVER_SEAT_OFFSET = new THREE.Vector3(-0.08, 0.18, -0.34);
const INTERACTION_DISTANCE = 3.6;
const MAX_ENTER_SPEED_KMH = 5.0;

const EMOTES = [
  { key: "1", id: "wave", label: "Wave" },
  { key: "2", id: "dance", label: "Macarena Dance" },
  { key: "3", id: "salute", label: "Salute" },
  { key: "4", id: "celebrate", label: "Celebrate" },
  { key: "5", id: "point", label: "Point" },
  { key: "6", id: "sit", label: "Sit" },
];

const UP_AXIS = new THREE.Vector3(0, 1, 0);

function getCarWorldPoint(car, localOffset, target = new THREE.Vector3()) {
  if (!car) return target.set(0, 0, 0);
  target.copy(localOffset).applyAxisAngle(UP_AXIS, car.rotation.y);
  target.add(car.position);
  return target;
}

/**
 * Keeps the character model seated inside the car while driving,
 * and smoothly interpolates the character through the open door during enter/exit.
 */
function VehicleOccupantSync({
  carRef,
  characterRef,
  playerMode,
  doorProgressRef,
}) {
  const doorPos = useRef(new THREE.Vector3());
  const seatPos = useRef(new THREE.Vector3());

  useFrame(() => {
    const car = carRef.current;
    const character = characterRef.current;
    if (!car || !character) return;

    const forwardSeatYaw = car.rotation.y + Math.PI / 2;

    if (playerMode === "driving") {
      getCarWorldPoint(car, DRIVER_SEAT_OFFSET, seatPos.current);
      character.position.copy(seatPos.current);
      character.rotation.set(car.rotation.x, forwardSeatYaw, car.rotation.z);
      character.scale.setScalar(CHARACTER_SCALE * 0.86);
      return;
    }

    if (playerMode === "entering" || playerMode === "exiting") {
      const progress = THREE.MathUtils.clamp(
        doorProgressRef?.current?.progress ?? 0,
        0,
        1,
      );

      getCarWorldPoint(car, DRIVER_DOOR_OFFSET, doorPos.current);
      getCarWorldPoint(car, DRIVER_SEAT_OFFSET, seatPos.current);

      if (playerMode === "entering") {
        const moveT = THREE.MathUtils.smoothstep(progress, 0.32, 0.96);
        character.position.lerpVectors(doorPos.current, seatPos.current, moveT);
        character.rotation.set(0, forwardSeatYaw, 0);
        character.scale.setScalar(
          THREE.MathUtils.lerp(CHARACTER_SCALE, CHARACTER_SCALE * 0.86, moveT),
        );
      } else {
        const moveT = THREE.MathUtils.smoothstep(progress, 0.28, 0.84);
        character.position.lerpVectors(seatPos.current, doorPos.current, moveT);
        character.rotation.set(0, forwardSeatYaw - moveT * 0.4, 0);
        character.scale.setScalar(
          THREE.MathUtils.lerp(CHARACTER_SCALE * 0.86, CHARACTER_SCALE, moveT),
        );
      }
      return;
    }

    character.scale.setScalar(CHARACTER_SCALE);
  });

  return null;
}

export default function LaptopGameApp() {
  const [scenePreset, setScenePreset] = useState("track");
  const [cameraMode, setCameraMode] = useState("chase");
  const [steerHudSide, setSteerHudSide] = useState("left");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [phoneLinked, setPhoneLinked] = useState(false);
  const [playerMode, setPlayerMode] = useState("driving"); // driving | onFoot | entering | exiting
  const [charAnimation, setCharAnimation] = useState("drivingSeat");
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
  const doorProgressRef = useRef({
    animation: null,
    progress: 0,
  });
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
    crouch: false,
    sprint: false,
    autoRun: false,
    steer: 0,
    moveX: 0,
    moveY: 0,
    lookX: 0,
    lookY: 0,
    lookDeltaX: 0,
    lookDeltaY: 0,
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
      crouch: false,
      sprint: false,
      autoRun: false,
      steer: 0,
      moveX: 0,
      moveY: 0,
      lookX: 0,
      lookY: 0,
      lookDeltaX: 0,
      lookDeltaY: 0,
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
      setPlayerMode("driving");
      setCharAnimation("drivingSeat");
      setInteractionMessage("");
    } else if (expectedMode === "exiting") {
      if (carRef.current && characterRef.current) {
        const door = getCarWorldPoint(
          carRef.current,
          DRIVER_DOOR_OFFSET,
          interactionPointRef.current,
        );
        characterRef.current.position.copy(door);
        characterRef.current.rotation.set(
          0,
          carRef.current.rotation.y + Math.PI / 2,
          0,
        );
      }
      setPlayerMode("onFoot");
      setCharAnimation("idle");
      setInteractionMessage("");
    }
    setEmoteActive(false);
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
    const door = getCarWorldPoint(
      carRef.current,
      DRIVER_DOOR_OFFSET,
      interactionPointRef.current,
    );
    characterRef.current.position.copy(door);
    characterRef.current.rotation.y = carRef.current.rotation.y + Math.PI / 2;

    doorProgressRef.current = { animation: "enterCar", progress: 0 };
    setEmoteActive(false);
    setCharAnimation("enterCar");
    setPlayerMode("entering");
    setInteractionMessage("Opening door & entering BMW M4...");
  }, [playerMode, nearCar, speedKmh, clearRemoteInput, finishTransition]);

  const exitVehicle = useCallback(() => {
    if (playerMode !== "driving" || !carRef.current || !characterRef.current)
      return;
    if (speedKmh > MAX_ENTER_SPEED_KMH) {
      setInteractionMessage("Brake and stop before exiting");
      return;
    }

    clearRemoteInput();
    doorProgressRef.current = { animation: "exitCar", progress: 0 };
    setCharAnimation("exitCar");
    setPlayerMode("exiting");
    setInteractionMessage("Opening door & exiting BMW M4...");
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

  const handleAnimationProgress = useCallback((animation, progress) => {
    if (animation !== "enterCar" && animation !== "exitCar") return;
    doorProgressRef.current = {
      animation,
      progress: THREE.MathUtils.clamp(progress, 0, 1),
    };
  }, []);

  const handleCharacterAnimationFinished = useCallback(
    (finishedAnimation) => {
      if (finishedAnimation === "enterCar") {
        doorProgressRef.current.progress = 1;
        finishTransition("entering");
        return;
      }
      if (finishedAnimation === "exitCar") {
        doorProgressRef.current.progress = 1;
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

  // Immediately push mode changes to the phone so the Phone HUD switches with zero delay
  useEffect(() => {
    socketRef.current?.emit("game:telemetry", {
      speed: telemetry.speed,
      gear: telemetry.gear,
      rpm: telemetry.rpm,
      drifting: telemetry.drifting,
      boost: telemetry.boost,
      playerMode,
      nearCar,
    });
  }, [playerMode, nearCar, telemetry]);

  // Keep the interaction prompt and phone telemetry synced with driver-side door proximity
  // Keep the interaction prompt and phone telemetry synced every 100ms in ALL modes
  useEffect(() => {
    const interval = window.setInterval(() => {
      let canReach = false;

      if (playerMode === "onFoot" && carRef.current && characterRef.current) {
        const door = getCarWorldPoint(
          carRef.current,
          DRIVER_DOOR_OFFSET,
          interactionPointRef.current,
        );
        const distance = characterRef.current.position.distanceTo(door);
        canReach = distance <= INTERACTION_DISTANCE;
        setNearCar(canReach);
        setInteractionMessage(
          canReach
            ? speedKmh <= MAX_ENTER_SPEED_KMH
              ? "Press F or Tap ENTER to get in BMW M4"
              : "Stop the BMW to enter"
            : "",
        );
      } else {
        setNearCar(false);
        if (playerMode === "driving") {
          setInteractionMessage(
            speedKmh > MAX_ENTER_SPEED_KMH ? "Brake and stop to exit" : "",
          );
        }
      }

      socketRef.current?.emit("game:telemetry", {
        speed: telemetry.speed,
        gear: telemetry.gear,
        rpm: telemetry.rpm,
        drifting: telemetry.drifting,
        boost: telemetry.boost,
        playerMode,
        nearCar: canReach,
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [playerMode, speedKmh, telemetry]);

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
      remoteInputRef.current.crouch = Boolean(data.crouch);
      remoteInputRef.current.sprint = Boolean(data.sprint);
      remoteInputRef.current.autoRun = Boolean(data.autoRun);
      remoteInputRef.current.steer = Number(data.steer) || 0;
      remoteInputRef.current.moveX = Number(data.moveX) || 0;
      remoteInputRef.current.moveY = Number(data.moveY) || 0;
      remoteInputRef.current.lookX = Number(data.lookX) || 0;
      remoteInputRef.current.lookY = Number(data.lookY) || 0;
      if (data.lookDeltaX) {
        remoteInputRef.current.lookDeltaX += Number(data.lookDeltaX) || 0;
      }
      if (data.lookDeltaY) {
        remoteInputRef.current.lookDeltaY += Number(data.lookDeltaY) || 0;
      }
    });
    socket.on("controller:action", (action) => {
      if (action === "camera") cycleCamera();
      if (action === "reset") remoteInputRef.current.reset = true;
      if (action === "toggleVehicle") toggleVehicle();
      if (typeof action === "string" && action.startsWith("emote:")) {
        playEmote(action.split(":")[1]);
      }
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
  }, [cycleCamera, toggleVehicle, playEmote]);

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

  const handleTelemetryChange = useCallback(
    (nextTelemetry) => {
      setTelemetry(nextTelemetry);
      socketRef.current?.emit("game:telemetry", {
        speed: nextTelemetry.speed,
        gear: nextTelemetry.gear,
        rpm: nextTelemetry.rpm,
        drifting: nextTelemetry.drifting,
        boost: nextTelemetry.boost,
        playerMode,
        nearCar,
      });
    },
    [playerMode, nearCar],
  );

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
            doorProgressRef={doorProgressRef}
            onWheelsReady={handleWheelsReady}
            onError={handleModelError}
          />
          <CharacterModel
            ref={characterRef}
            animation={playerMode === "driving" ? "drivingSeat" : charAnimation}
            visible={true}
            steerValue={currentSteer}
            onAnimationFinished={handleCharacterAnimationFinished}
            onAnimationProgress={handleAnimationProgress}
          />
        </Suspense>
        <VehicleOccupantSync
          carRef={carRef}
          characterRef={characterRef}
          playerMode={playerMode}
          doorProgressRef={doorProgressRef}
        />
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
          carRef={carRef}
          collidersRef={collidersRef}
          enabled={playerMode === "onFoot"}
          emoteActive={emoteActive}
          cameraYawRef={cameraYawRef}
          remoteInputRef={remoteInputRef}
          onAnimationChange={setCharAnimation}
          onEmote={(key) => {
            const emote = EMOTES.find((item) => item.key === key);
            if (emote) playEmote(emote.id);
          }}
        />

        <FollowCamera
          targetRef={isCharacterMode ? characterRef : carRef}
          physicsStateRef={physicsStateRef}
          remoteInputRef={remoteInputRef}
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
              className="mc-icon-btn mc-action-pill"
              onClick={enterVehicle}
              disabled={!nearCar || speedKmh > MAX_ENTER_SPEED_KMH}
              title="Enter BMW M4 (F)"
            >
              ENTER CAR
            </button>
          ) : playerMode === "driving" ? (
            <button
              type="button"
              className="mc-icon-btn mc-action-pill"
              onClick={exitVehicle}
              disabled={speedKmh > MAX_ENTER_SPEED_KMH}
              title="Exit BMW M4 (F)"
            >
              EXIT CAR
            </button>
          ) : (
            <button
              type="button"
              className="mc-icon-btn mc-action-pill"
              disabled
            >
              {playerMode === "entering" ? "ENTERING..." : "EXITING..."}
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
            WASD / PHONE JOYSTICK MOVE · SWIPE PHONE / DRAG MOUSE TO TURN ·
            SHIFT SPRINT · SPACE JUMP · F ENTER CAR
          </div>
        </section>
      )}

      {(interactionMessage || isTransitioning) && (
        <div
          className="vehicle-interaction-prompt"
          style={{
            pointerEvents: nearCar ? "auto" : "none",
            cursor: nearCar ? "pointer" : "default",
          }}
          onClick={nearCar ? toggleVehicle : undefined}
        >
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
