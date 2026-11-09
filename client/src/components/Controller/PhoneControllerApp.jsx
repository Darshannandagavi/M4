import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { io } from "socket.io-client";
import {
  MAX_TILT_DEG,
  MAX_WHEEL_ROTATION_DEG,
  SCENE_PRESETS,
  TILT_DEADZONE_DEG,
} from "../../config/gameConstants";
import { extractTiltDegrees, getSocketUrl } from "../../utils/network";
import Icons from "../UI/Icons";
import HoldButton from "../UI/HoldButton";
import SteeringWheelGraphic from "../UI/SteeringWheelGraphic";

export default function PhoneControllerApp() {
  const [connected, setConnected] = useState(false);
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
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    gear: "N",
    rpm: 850,
    drifting: false,
    boost: false,
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
    steer: 0,
  });
  const rawTiltRef = useRef(0);
  const tiltZeroRef = useRef(0);
  const wheelBoxRef = useRef(null);
  const prevFingerAngleRef = useRef(null);
  const wheelAngleDegRef = useRef(0);

  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("selectstart", prevent);

    const onResize = () => {
      setIsPortraitViewport(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("selectstart", prevent);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const emitInput = useCallback(() => {
    socketRef.current?.emit("controller:input", inputRef.current);
  }, []);

  useEffect(() => {
    const socket = io(getSocketUrl(), { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("game:telemetry", (data) => setTelemetry(data));
    socket.on("game:haptic", (pattern) => {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    });

    const heartbeat = setInterval(() => {
      if (socket.connected) {
        socket.emit("controller:input", inputRef.current);
      }
    }, 30);

    return () => {
      clearInterval(heartbeat);
      socket.disconnect();
    };
  }, []);

  const updateField = useCallback(
    (key, value) => {
      inputRef.current[key] = value;
      emitInput();
    },
    [emitInput],
  );

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
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      const pt = e.targetTouches?.[0] || e.touches?.[0] || e;
      prevFingerAngleRef.current = getFingerPolarAngle(pt);
      setWheelGrabbed(true);
    },
    [getFingerPolarAngle],
  );

  const handleWheelMove = useCallback(
    (e) => {
      if (prevFingerAngleRef.current === null) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const pt = e.targetTouches?.[0] || e.touches?.[0] || e;
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
      if (e && e.cancelable) e.preventDefault();
      prevFingerAngleRef.current = null;
      wheelAngleDegRef.current = 0;
      setWheelGrabbed(false);
      inputRef.current.steer = 0;
      setSteerVal(0);
      emitInput();
    },
    [emitInput],
  );

  const toggleFullscreen = useCallback(() => {
    const docEl = document.documentElement;
    if (!document.fullscreenElement && docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
      if (window.screen?.orientation?.lock) {
        window.screen.orientation.lock("landscape").catch(() => {});
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleSteerSideChange = useCallback((side) => {
    setSteerSide(side);
    socketRef.current?.emit("controller:settings", { steerHudSide: side });
  }, []);

  const handleSceneChange = useCallback((presetKey) => {
    setScenePreset(presetKey);
    socketRef.current?.emit("controller:settings", { scenePreset: presetKey });
  }, []);

  const rpmRatio = Math.min(1, (telemetry.rpm || 850) / 7500);
  const ledCount = 14;
  const activeLeds = Math.round(rpmRatio * ledCount);

  return (
    <div
      className={
        isPortraitViewport ? "mc-viewport mc-force-landscape" : "mc-viewport"
      }
    >
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
                {connected ? "M-LINK ACTIVE" : "CONNECTING..."}
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
            <span className="mc-gear-digit">{telemetry.gear || "N"}</span>
          </div>
        </div>

        <div className="mc-icon-toolbar">
          <button
            type="button"
            className="mc-icon-btn"
            onClick={() =>
              socketRef.current?.emit("controller:action", "camera")
            }
            title="Switch Camera"
          >
            <Icons.Camera />
          </button>

          <button
            type="button"
            className="mc-icon-btn"
            onClick={() =>
              socketRef.current?.emit("controller:action", "reset")
            }
            title="Reset Car"
          >
            <Icons.Reset />
          </button>

          <button
            type="button"
            className="mc-icon-btn"
            onClick={toggleFullscreen}
            title="Fullscreen Landscape"
          >
            <Icons.Fullscreen />
          </button>

          <button
            type="button"
            className="mc-icon-btn mc-settings-trigger"
            onClick={() => setSettingsOpen(true)}
            title="Controller Settings"
          >
            <Icons.Settings />
          </button>
        </div>
      </header>

      <button
        type="button"
        className="mc-jump-btn mc-jump-floating"
        onPointerDown={(event) => {
          event.preventDefault();
          updateField("jump", true);
        }}
        onPointerUp={() => updateField("jump", false)}
        onPointerCancel={() => updateField("jump", false)}
        onPointerLeave={() => updateField("jump", false)}
      >
        <span className="mc-jump-icon">↑</span>
        <span>JUMP</span>
      </button>

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
              <button
                type="button"
                className="mc-enable-gyro-action-btn"
                onClick={openGyroPrompt}
              >
                ENABLE GYRO SENSORS
              </button>
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

            <button
              type="button"
              className="mc-recenter-pill"
              onClick={calibrateTilt}
            >
              ZERO TILT (CENTER)
            </button>
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
              <button
                type="button"
                className="mc-icon-btn"
                onClick={() => setSettingsOpen(false)}
              >
                <Icons.Close />
              </button>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">STEERING MODE</div>
              <div className="mc-segmented">
                <button
                  type="button"
                  className={
                    steerMode === "wheel" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={() => {
                    setSteerMode("wheel");
                    inputRef.current.steer = 0;
                    setSteerVal(0);
                    emitInput();
                  }}
                >
                  <Icons.Wheel />
                  <span>STEERING WHEEL</span>
                </button>
                <button
                  type="button"
                  className={
                    steerMode === "tilt" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={openGyroPrompt}
                >
                  <Icons.Gyro />
                  <span>GYRO TILT (PEDALS)</span>
                </button>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">STEERING SIDE (WHEEL MODE)</div>
              <div className="mc-segmented">
                <button
                  type="button"
                  className={
                    steerSide === "left" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={() => handleSteerSideChange("left")}
                >
                  <span>STEER LEFT · PEDALS RIGHT</span>
                </button>
                <button
                  type="button"
                  className={
                    steerSide === "right" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={() => handleSteerSideChange("right")}
                >
                  <span>STEER RIGHT · PEDALS LEFT</span>
                </button>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">WORLD ENVIRONMENT</div>
              <div className="mc-segmented">
                {Object.entries(SCENE_PRESETS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    className={
                      scenePreset === key ? "mc-seg-btn active" : "mc-seg-btn"
                    }
                    onClick={() => handleSceneChange(key)}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
            <button
              type="button"
              className="mc-enable-gyro-action-btn"
              onClick={requestAndEnableGyro}
            >
              {gyroError ? "RETRY GYRO ACTIVATION" : "ENABLE SENSORS"}
            </button>
            <button
              type="button"
              className="mc-recenter-pill"
              onClick={() => setGyroPromptOpen(false)}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
