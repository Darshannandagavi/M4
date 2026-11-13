import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Loader } from "@react-three/drei";
import * as THREE from "three";

import {
  CAMERA_MODES,
  INITIAL_TELEMETRY,
  MAX_WHEEL_ROTATION_DEG,
  WEAPONS,
  WEAPON_ORDER,
  LOOT_ITEMS,
} from "../../config/gameConstants";
import {
  connectRelaySocket,
  fetchNetworkInfo,
  getNetworkControllerUrl,
  getOrCreatePlayerSession,
  getRoomCodeFromUrl,
  getUrlParam,
  isLoopbackHost,
  setSessionPlayerName,
} from "../../utils/network";
import CustomRoomLobby from "../Lobby/CustomRoomLobby";
import OpenWorldMap from "../World/OpenWorldMap";
import DrivingWorld from "../World/DrivingWorld";
import FollowCamera from "../World/FollowCamera";
import BMWM4 from "../Car/BMWM4";
import CarController from "../Car/CarController";
import CharacterModel, { CHARACTER_SCALE } from "../Character/CharacterModel";
import CharacterController from "../Character/CharacterController";
import RemotePlayers from "../Character/RemotePlayers";
import CombatManager from "../Combat/CombatManager";
import SteeringWheelGraphic from "../UI/SteeringWheelGraphic";
import SportSpeedometer from "../UI/SportSpeedometer";
import { GameSettingsModal, QrConnectModal } from "../UI/GameModals";
import FreeFireHUD from "../UI/FreeFireHUD";
import FreeFireVictoryModal from "../UI/FreeFireVictoryModal";
import ZoneManager from "../Zone/ZoneManager";
import LootManager from "../Loot/LootManager";
import InventoryUI from "../UI/InventoryUI";
import AircraftDrop from "../Aircraft/AircraftDrop";
import { WorldHtmlLayer } from "../UI/WorldHtml";

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

function VehicleOccupantSync({
  carRef,
  characterRef,
  playerMode,
  doorProgressRef,
  enabled = true,
}) {
  const doorPos = useRef(new THREE.Vector3());
  const seatPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!enabled) return;
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
  const [playerSession, setPlayerSession] = useState(() =>
    getOrCreatePlayerSession(),
  );
  const initialPlayerNameRef = useRef(playerSession.playerName);
  const [initialInviteCode] = useState(() => getRoomCodeFromUrl());
  const [screenMode, setScreenMode] = useState(() =>
    getUrlParam("quick") === "1" ? "game" : "lobby",
  );
  const [lobbySocket, setLobbySocket] = useState(null);
  const [roomState, setRoomState] = useState(null);
  const [countdownSec, setCountdownSec] = useState(null);
  const [lobbyError, setLobbyError] = useState("");
  const [activeMatchManifest, setActiveMatchManifest] = useState(null);

  const [scenePreset, setScenePreset] = useState("track");
  const [mapPreset, setMapPreset] = useState("bermuda");
  const [cameraMode, setCameraMode] = useState("chase");
  const [steerHudSide, setSteerHudSide] = useState("left");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editCustomHud, setEditCustomHud] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [phoneLinked, setPhoneLinked] = useState(false);
  const [controllerCount, setControllerCount] = useState(0);
  const [relayStatus, setRelayStatus] = useState("connecting");
  const [lanIp, setLanIp] = useState(null);
  const [playerMode, setPlayerMode] = useState("onFoot");
  const [charAnimation, setCharAnimation] = useState("idle");
  const [collidersVersion, setCollidersVersion] = useState(0);
  const [aircraftEjectToken, setAircraftEjectToken] = useState(0);
  const [aircraftPhase, setAircraftPhase] = useState("flying");
  const [nearCar, setNearCar] = useState(false);
  const [interactionMessage, setInteractionMessage] = useState("");
  const [emoteActive, setEmoteActive] = useState(false);
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [modelError, setModelError] = useState("");

  // Free Fire Combat State
  const [weaponId, setWeaponId] = useState("m4a1");
  const [ammoState, setAmmoState] = useState({
    m4a1: { mag: WEAPONS.m4a1.magSize, reserve: WEAPONS.m4a1.reserveAmmo },
    ak47: { mag: WEAPONS.ak47.magSize, reserve: WEAPONS.ak47.reserveAmmo },
    awm: { mag: WEAPONS.awm.magSize, reserve: WEAPONS.awm.reserveAmmo },
    mp40: { mag: WEAPONS.mp40.magSize, reserve: WEAPONS.mp40.reserveAmmo },
    deagle: { mag: WEAPONS.deagle.magSize, reserve: WEAPONS.deagle.reserveAmmo },
    fist: { mag: 0, reserve: 0 },
  });
  const [reloading, setReloading] = useState(false);
  const [mouseFiring, setMouseFiring] = useState(false);
  const [mouseAiming, setMouseAiming] = useState(false);
  const [remoteFiring, setRemoteFiring] = useState(false);
  const [remoteAiming, setRemoteAiming] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [armor, setArmor] = useState(100);
  const [helmet, setHelmet] = useState(100);
  const [vestLevel, setVestLevel] = useState(3);
  const [helmetLevel, setHelmetLevel] = useState(3);
  const [kills, setKills] = useState(0);
  const [hitMarker, setHitMarker] = useState(null); // { headshot: boolean }
  const [matchStatus, setMatchStatus] = useState("DROPPING"); // "DROPPING" | "IN_PROGRESS" | "VICTORY" | "DEFEAT"
  const [damageDealt, setDamageDealt] = useState(0);
  const [headshots, setHeadshots] = useState(0);
  const [shotsFired, setShotsFired] = useState(0);
  const [survivalSeconds, setSurvivalSeconds] = useState(0);
  const [aliveCount, setAliveCount] = useState(7);
  const [killFeed, setKillFeed] = useState([]);
  const [killBanner, setKillBanner] = useState(null);
  const [resetToken, setResetToken] = useState(0);
  const [finalRank, setFinalRank] = useState(1);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [interactPressed, setInteractPressed] = useState(false);
  const [zoneDamageFlash, setZoneDamageFlash] = useState(false);
  const [aimAssistState, setAimAssistState] = useState({ locked: false, headshot: false });
  const [enemiesList, setEnemiesList] = useState([]);
  const [remoteHumansList, setRemoteHumansList] = useState([]);
  const remotePlayersDataRef = useRef(new Map());
  const prevHumanIdsRef = useRef("");

  const activeMatchIdRef = useRef(null);
  const playerHpRef = useRef(playerHp);
  playerHpRef.current = playerHp;
  const armorRef = useRef(armor);
  armorRef.current = armor;
  const charAnimationRef = useRef("idle");
  charAnimationRef.current = charAnimation;
  const weaponIdRef = useRef("m4a1");
  weaponIdRef.current = weaponId;
  const isAimingRef = useRef(false);
  const isFiringRef = useRef(false);
  const playerModeRef = useRef("onFoot");
  playerModeRef.current = playerMode;

  const myTeamId = useMemo(() => {
    const fromManifest = activeMatchManifest?.humans?.find(
      (h) => h.id === playerSession.playerId,
    )?.teamId;
    if (fromManifest != null) return fromManifest;
    const fromRoom = roomState?.players?.find(
      (p) => p.playerId === playerSession.playerId,
    )?.teamId;
    if (fromRoom != null) return fromRoom;
    return 1;
  }, [activeMatchManifest, roomState, playerSession.playerId]);
  const dragFireUpRef = useRef(false);
  const dragUpRatioRef = useRef(0);
  const [inventory, setInventory] = useState({
    items: [],
    primaryWeapon: "m4a1",
    secondaryWeapon: null,
    vest: "vest_3",
    helmet: "helmet_3",
    medkits: 3,
  });

  const collidersRef = useRef([]);
  const carRef = useRef(null);
  const characterRef = useRef(null);
  const wheelAssembliesRef = useRef([]);
  const reloadTimerRef = useRef(null);
  const autoReloadTimerRef = useRef(null);
  const hitTimerRef = useRef(null);
  const bannerTimerRef = useRef(null);
  const zoneFlashTimerRef = useRef(null);
  const jumpTimerRef = useRef(null);
  const remoteFireReleaseTimerRef = useRef(null);
  const remoteFireMinUntilRef = useRef(0);
  const prevRemoteJumpRef = useRef(false);
  const prevRemoteFireRef = useRef(false);
  const interactionToastUntilRef = useRef(0);
  const socketRef = useRef(null);
  const doorProgressRef = useRef({
    animation: null,
    progress: 0,
  });
  const interactionPointRef = useRef(new THREE.Vector3());
  const cameraYawRef = useRef(0);
  const cameraPitchRef = useRef(0.16);

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
    jumpPulse: false,
    crouch: false,
    sprint: false,
    autoRun: false,
    fire: false,
    firePulse: false,
    aim: false,
    dragUp: false,
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

  const currentWeapon = WEAPONS[weaponId] || WEAPONS.m4a1;
  const currentAmmo = ammoState[weaponId] || { mag: 0, reserve: 0 };
  const isArmed = playerMode === "onFoot" && weaponId !== "fist";
  const isPunching =
    playerMode === "onFoot" &&
    weaponId === "fist" &&
    (mouseFiring || remoteFiring);
  const isAiming = isArmed && (mouseAiming || remoteAiming);
  const isFiring =
    isArmed &&
    !reloading &&
    currentAmmo.mag > 0 &&
    (mouseFiring || remoteFiring);
  isAimingRef.current = isAiming;
  isFiringRef.current = isFiring || isPunching;

  const clearRemoteInput = useCallback(() => {
    dragFireUpRef.current = false;
    dragUpRatioRef.current = 0;
    if (remoteFireReleaseTimerRef.current) {
      window.clearTimeout(remoteFireReleaseTimerRef.current);
      remoteFireReleaseTimerRef.current = null;
    }
    remoteFireMinUntilRef.current = 0;
    prevRemoteJumpRef.current = false;
    prevRemoteFireRef.current = false;
    Object.assign(remoteInputRef.current, {
      accelerate: false,
      brake: false,
      handbrake: false,
      boost: false,
      jump: false,
      jumpPulse: false,
      crouch: false,
      sprint: false,
      autoRun: false,
      fire: false,
      firePulse: false,
      aim: false,
      steer: 0,
      moveX: 0,
      moveY: 0,
      lookX: 0,
      lookY: 0,
      lookDeltaX: 0,
      lookDeltaY: 0,
    });
    setRemoteFiring(false);
    setRemoteAiming(false);
    setMouseFiring(false);
    setMouseAiming(false);
  }, []);

  const switchWeapon = useCallback(() => {
    if (reloadTimerRef.current) {
      window.clearTimeout(reloadTimerRef.current);
      reloadTimerRef.current = null;
    }
    setReloading(false);
    setWeaponId((prev) => {
      const idx = WEAPON_ORDER.indexOf(prev);
      return WEAPON_ORDER[(idx + 1) % WEAPON_ORDER.length];
    });
  }, []);

  const reloadWeapon = useCallback(() => {
    if (reloading || weaponId === "fist") return;
    const spec = WEAPONS[weaponId];
    const slot = ammoState[weaponId];
    if (!spec || !slot || slot.mag >= spec.magSize || slot.reserve <= 0) return;

    if (reloadTimerRef.current) {
      window.clearTimeout(reloadTimerRef.current);
    }
    setReloading(true);
    const targetWeaponId = weaponId;
    reloadTimerRef.current = window.setTimeout(() => {
      setAmmoState((prev) => {
        const current = prev[targetWeaponId];
        if (!current) return prev;
        const needed = spec.magSize - current.mag;
        const load = Math.min(needed, current.reserve);
        return {
          ...prev,
          [targetWeaponId]: {
            mag: current.mag + load,
            reserve: current.reserve - load,
          },
        };
      });
      setReloading(false);
      reloadTimerRef.current = null;
    }, spec.reloadTime * 1000);
  }, [reloading, weaponId, ammoState]);

  // Cleanup all transient UI/reload timers on unmount
  useEffect(() => {
    return () => {
      if (reloadTimerRef.current) window.clearTimeout(reloadTimerRef.current);
      if (autoReloadTimerRef.current) window.clearTimeout(autoReloadTimerRef.current);
      if (hitTimerRef.current) window.clearTimeout(hitTimerRef.current);
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current);
      if (zoneFlashTimerRef.current) window.clearTimeout(zoneFlashTimerRef.current);
      if (jumpTimerRef.current) window.clearTimeout(jumpTimerRef.current);
    };
  }, []);

  // Trigger Defeat when player HP reaches 0 during active match
  useEffect(() => {
    if (playerHp <= 0 && matchStatus === "IN_PROGRESS") {
      setMatchStatus("DEFEAT");
      setFinalRank(aliveCount);
    }
  }, [playerHp, matchStatus, aliveCount]);

  // Match Survival Timer
  useEffect(() => {
    if (matchStatus !== "IN_PROGRESS") return undefined;
    const timer = window.setInterval(() => {
      setSurvivalSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [matchStatus]);

  const handleShotEvaluated = useCallback(
    (result) => {
      setShotsFired((s) => s + 1);
      setAmmoState((prev) => {
        const cur = prev[weaponId];
        if (!cur) return prev;
        const nextMag = Math.max(0, cur.mag - 1);
        if (nextMag === 0 && cur.reserve > 0) {
          if (autoReloadTimerRef.current) {
            window.clearTimeout(autoReloadTimerRef.current);
          }
          autoReloadTimerRef.current = window.setTimeout(() => {
            autoReloadTimerRef.current = null;
            reloadWeapon();
          }, 120);
        }
        return {
          ...prev,
          [weaponId]: { ...cur, mag: nextMag },
        };
      });

      if (result.hit) {
        setHitMarker({ headshot: result.headshot });
        if (hitTimerRef.current) window.clearTimeout(hitTimerRef.current);
        hitTimerRef.current = window.setTimeout(() => {
          hitTimerRef.current = null;
          setHitMarker(null);
        }, 180);
        setDamageDealt((d) => d + result.damage);
        if (result.headshot) {
          setHeadshots((h) => h + 1);
        }
        socketRef.current?.emit(
          "game:haptic",
          result.headshot ? [40, 25, 65] : 22,
        );
        if (socketRef.current?.connected && activeMatchIdRef.current) {
          socketRef.current.emit("player:damage", {
            matchId: activeMatchIdRef.current,
            attackerId: playerSession.playerId,
            targetId: result.botId || result.targetId,
            damage: result.damage,
            isHeadshot: result.headshot,
            weaponId: weaponId,
          });
        }
      }
    },
    [weaponId, reloadWeapon, playerSession.playerId],
  );

  const handlePlayerDamaged = useCallback((dmg) => {
    setPlayerHp((prev) => Math.max(0, prev - dmg));
  }, []);

  const handleBotsPositionUpdate = useCallback(
    (livingBots) => {
      const remoteHumans = [];
      if (remotePlayersDataRef.current) {
        for (const rp of remotePlayersDataRef.current.values()) {
          if (!rp.isBot && rp.id !== playerSession.playerId && rp.alive && Array.isArray(rp.pos)) {
            const isTeammate = myTeamId != null && rp.teamId === myTeamId;
            remoteHumans.push({
              id: rp.id,
              name: rp.name,
              x: rp.pos[0],
              z: rp.pos[2],
              headingDeg: rp.rot ? Math.round((-rp.rot[0] * 180) / Math.PI) % 360 : 0,
              state: isTeammate ? "teammate" : "combat",
              isTeammate,
            });
          }
        }
      }
      setEnemiesList([...livingBots, ...remoteHumans]);
    },
    [playerSession.playerId, myTeamId],
  );

  const handleBotEliminated = useCallback((bot, killerName, isHeadshot) => {
    const isPlayer = killerName === "YOU";
    const entry = {
      id: `${Date.now()}-${Math.random()}`,
      killer: killerName,
      victim: bot.name,
      headshot: isHeadshot,
      isPlayer,
    };
    setKillFeed((prev) => [...prev.slice(-4), entry]);

    if (isPlayer) {
      setKills((k) => k + 1);
      setKillBanner({
        text: bot.name,
        headshot: isHeadshot,
      });
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = window.setTimeout(() => {
        bannerTimerRef.current = null;
        setKillBanner(null);
      }, 2500);
    }
  }, []);

  const handleAllBotsEliminated = useCallback(() => {
    setMatchStatus("VICTORY");
    setFinalRank(1);
  }, []);

  const handleAircraftLanded = useCallback(() => {
    setMatchStatus("IN_PROGRESS");
    setPlayerMode("onFoot");
    setCharAnimation("idle");
  }, []);

  const handleZoneDamage = useCallback((dps) => {
    setZoneDamageFlash(true);
    if (zoneFlashTimerRef.current) window.clearTimeout(zoneFlashTimerRef.current);
    zoneFlashTimerRef.current = window.setTimeout(() => {
      zoneFlashTimerRef.current = null;
      setZoneDamageFlash(false);
    }, 220);
    setPlayerHp((prev) => Math.max(0, prev - dps));
  }, []);

  const handleLootPickup = useCallback((loot) => {
    if (!loot) return;
    if (loot.type === "weapon") {
      setWeaponId(loot.weaponId);
      setInventory((prev) => ({
        ...prev,
        primaryWeapon: loot.weaponId,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: 1 }],
      }));
    } else if (loot.type === "ammo") {
      setAmmoState((prev) => {
        const next = { ...prev };
        (loot.ammoFor || []).forEach((wId) => {
          if (next[wId]) {
            next[wId] = { ...next[wId], reserve: next[wId].reserve + loot.amount };
          }
        });
        return next;
      });
      setInventory((prev) => ({
        ...prev,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: loot.amount }],
      }));
    } else if (loot.type === "heal") {
      setInventory((prev) => ({
        ...prev,
        medkits: prev.medkits + 1,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: 1 }],
      }));
    } else if (loot.type === "armor") {
      setVestLevel(loot.level);
      setArmor(100);
      setInventory((prev) => ({
        ...prev,
        vest: loot.itemId,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: 1 }],
      }));
    } else if (loot.type === "helmet") {
      setHelmetLevel(loot.level);
      setHelmet(100);
      setInventory((prev) => ({
        ...prev,
        helmet: loot.itemId,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: 1 }],
      }));
    }
  }, []);

  const handleEquipWeapon = useCallback((itemId, slot) => {
    const item = LOOT_ITEMS[itemId];
    if (item?.type === "weapon") {
      setWeaponId(item.weaponId);
      setInventory((prev) => ({
        ...prev,
        [slot === "secondary" ? "secondaryWeapon" : "primaryWeapon"]: item.weaponId,
      }));
    } else if (item?.type === "armor") {
      setVestLevel(item.level);
      setArmor(100);
      setInventory((prev) => ({ ...prev, vest: itemId }));
    } else if (item?.type === "helmet") {
      setHelmetLevel(item.level);
      setHelmet(100);
      setInventory((prev) => ({ ...prev, helmet: itemId }));
    }
  }, []);

  const handleDropItem = useCallback((uid) => {
    setInventory((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.uid !== uid),
    }));
  }, []);

  const handlePlayAgain = useCallback(() => {
    setMatchStatus("DROPPING");
    setPlayerMode("onFoot");
    setCharAnimation("idle");
    setAircraftPhase("flying");
    setReloading(false);
    setPlayerHp(100);
    setArmor(100);
    setHelmet(100);
    setVestLevel(3);
    setHelmetLevel(3);
    setKills(0);
    setDamageDealt(0);
    setHeadshots(0);
    setShotsFired(0);
    setSurvivalSeconds(0);
    setAliveCount(7);
    setKillFeed([]);
    setKillBanner(null);
    setAmmoState({
      m4a1: { mag: WEAPONS.m4a1.magSize, reserve: WEAPONS.m4a1.reserveAmmo },
      ak47: { mag: WEAPONS.ak47.magSize, reserve: WEAPONS.ak47.reserveAmmo },
      awm: { mag: WEAPONS.awm.magSize, reserve: WEAPONS.awm.reserveAmmo },
      mp40: { mag: WEAPONS.mp40.magSize, reserve: WEAPONS.mp40.reserveAmmo },
      deagle: { mag: WEAPONS.deagle.magSize, reserve: WEAPONS.deagle.reserveAmmo },
      fist: { mag: 0, reserve: 0 },
    });
    setInventory({
      items: [],
      primaryWeapon: "m4a1",
      secondaryWeapon: null,
      vest: "vest_3",
      helmet: "helmet_3",
      medkits: 3,
    });
    setResetToken((t) => t + 1);
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
        let door = getCarWorldPoint(
          carRef.current,
          DRIVER_DOOR_OFFSET,
          interactionPointRef.current,
        );

        // Fallback to passenger side if driver door is right against a wall
        const rawMeshes = collidersRef.current?.meshes || (Array.isArray(collidersRef.current) ? collidersRef.current : []);
        const worldMeshes = rawMeshes.map((c) => (c?.isObject3D ? c : c?.mesh)).filter(Boolean);
        if (worldMeshes.length > 0) {
          const carCenter = carRef.current.position.clone().add(new THREE.Vector3(0, 0.8, 0));
          const toDoor = door.clone().sub(carCenter).normalize();
          const doorProbe = new THREE.Raycaster(carCenter, toDoor, 0, 2.0);
          const wallHits = doorProbe.intersectObjects(worldMeshes, false);
          if (wallHits.length > 0 && wallHits[0].distance < 1.6) {
            door = getCarWorldPoint(
              carRef.current,
              new THREE.Vector3(0.05, 0, 1.35),
              interactionPointRef.current,
            );
          }
        }

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
      !carRef.current ||
      !characterRef.current
    ) {
      return;
    }
    if (matchStatus !== "IN_PROGRESS") {
      interactionToastUntilRef.current = Date.now() + 2000;
      setInteractionMessage("Land first before entering the BMW M4");
      return;
    }
    if (!nearCar) {
      interactionToastUntilRef.current = Date.now() + 2200;
      setInteractionMessage("Move closer to the BMW M4 to enter");
      return;
    }
    if (speedKmh > MAX_ENTER_SPEED_KMH) {
      interactionToastUntilRef.current = Date.now() + 2000;
      setInteractionMessage("Stop the BMW before entering");
      return;
    }

    if (reloadTimerRef.current) {
      window.clearTimeout(reloadTimerRef.current);
      reloadTimerRef.current = null;
    }
    setReloading(false);

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
    interactionToastUntilRef.current = 0;
    setInteractionMessage("Opening door & entering BMW M4...");
  }, [playerMode, matchStatus, nearCar, speedKmh, clearRemoteInput]);

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
  }, [playerMode, speedKmh, clearRemoteInput]);

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

  // Keyboard & Mouse Combat Controls (On Foot)
  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.repeat ||
        event.target?.tagName === "INPUT" ||
        event.target?.tagName === "TEXTAREA"
      )
        return;
      const key = event.key.toLowerCase();
      if (key === "tab") {
        event.preventDefault();
        setIsInventoryOpen((prev) => !prev);
      } else if (key === "e") {
        setInteractPressed(true);
      } else if (key === "f") {
        event.preventDefault();
        toggleVehicle();
      } else if (playerMode === "onFoot") {
        if (key === "q" || key === "g") {
          event.preventDefault();
          switchWeapon();
        } else if (key === "r") {
          event.preventDefault();
          reloadWeapon();
        }
      }
    };

    const onKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (key === "e") {
        setInteractPressed(false);
      }
    };

    const onMouseDown = (event) => {
      if (playerMode !== "onFoot") return;
      if (
        event.target?.closest(
          "button, .mc-modal-backdrop, .character-action-panel, .topbar",
        )
      ) {
        return;
      }
      if (event.button === 0) setMouseFiring(true);
      if (event.button === 2) setMouseAiming(true);
    };

    const onMouseUp = (event) => {
      if (event.button === 0) setMouseFiring(false);
      if (event.button === 2) setMouseAiming(false);
    };

    const onContextMenu = (event) => {
      if (playerMode === "onFoot") event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("contextmenu", onContextMenu);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, [toggleVehicle, playerMode, switchWeapon, reloadWeapon]);

  const hudSnapshotRef = useRef({});
  const charPos = characterRef.current?.position;
  let headingDeg = Math.round((-cameraYawRef.current * 180) / Math.PI) % 360;
  if (headingDeg < 0) headingDeg += 360;

  const currentCarPos = carRef.current
    ? {
        x: carRef.current.position.x,
        z: carRef.current.position.z,
        headingDeg: Math.round((-carRef.current.rotation.y * 180) / Math.PI) % 360,
      }
    : null;

  hudSnapshotRef.current = {
    telemetry,
    inLobby: screenMode === "lobby",
    playerMode,
    matchStatus,
    aircraftPhase,
    speedKmh,
    nearCar,
    weaponId,
    weaponName: currentWeapon.name,
    ammo: currentAmmo.mag,
    reserveAmmo: currentAmmo.reserve,
    reloading,
    aliveCount,
    hp: Math.round(playerHp),
    ep: 180,
    vestLevel,
    helmetLevel,
    medkits: inventory.medkits,
    primaryWeapon: inventory.primaryWeapon,
    secondaryWeapon: inventory.secondaryWeapon,
    ammoState,
    matchElapsed: survivalSeconds,
    kills,
    killFeed: killFeed.slice(-3),
    posX: charPos ? Math.round(charPos.x * 10) / 10 : 0,
    posZ: charPos ? Math.round(charPos.z * 10) / 10 : 0,
    headingDeg,
    statusMsg: interactionMessage,
    enemies: enemiesList,
    carPos: currentCarPos,
  };

  const lastNearCarRef = useRef(false);
  const lastInteractionMsgRef = useRef("");

  const emitTelemetrySnapshot = useCallback((canReachOverride) => {
    const snap = hudSnapshotRef.current;
    const canReach =
      typeof canReachOverride === "boolean"
        ? canReachOverride
        : lastNearCarRef.current;
    socketRef.current?.emit("game:telemetry", {
      speed: snap.telemetry.speed,
      gear: snap.telemetry.gear,
      rpm: snap.telemetry.rpm,
      drifting: snap.telemetry.drifting,
      boost: snap.telemetry.boost,
      inLobby: Boolean(snap.inLobby),
      playerMode: snap.playerMode,
      matchStatus: snap.matchStatus,
      aircraftPhase: snap.aircraftPhase,
      nearCar: canReach,
      weaponId: snap.weaponId,
      weaponName: snap.weaponName,
      ammo: snap.ammo,
      reserveAmmo: snap.reserveAmmo,
      reloading: snap.reloading,
      aliveCount: snap.aliveCount,
      hp: snap.hp,
      ep: snap.ep,
      vestLevel: snap.vestLevel,
      helmetLevel: snap.helmetLevel,
      medkits: snap.medkits,
      primaryWeapon: snap.primaryWeapon,
      secondaryWeapon: snap.secondaryWeapon,
      ammoState: snap.ammoState,
      matchElapsed: snap.matchElapsed,
      kills: snap.kills,
      killFeed: snap.killFeed,
      posX: snap.posX,
      posZ: snap.posZ,
      headingDeg: snap.headingDeg,
      statusMsg: snap.statusMsg,
      enemies: snap.enemies || [],
      carPos: snap.carPos || null,
    });
  }, []);

  const handleFireDrag = useCallback(
    ({ deltaX, deltaY, dragUpRatio, dragUpActive }) => {
      dragFireUpRef.current = dragUpActive;
      dragUpRatioRef.current = dragUpRatio;
      if (dragUpActive && deltaY < 0) {
        cameraPitchRef.current = THREE.MathUtils.clamp(
          cameraPitchRef.current + Math.abs(deltaY) * 0.0035,
          -0.35,
          0.9,
        );
      }
    },
    [],
  );

  useEffect(() => {
    emitTelemetrySnapshot();
  }, [
    emitTelemetrySnapshot,
    screenMode,
    playerMode,
    matchStatus,
    aircraftPhase,
    weaponId,
    reloading,
    playerHp,
    inventory.medkits,
    ammoState,
    interactionMessage,
  ]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const snap = hudSnapshotRef.current;
      let canReach = false;
      let nextMsg = "";

      if (
        snap.matchStatus === "IN_PROGRESS" &&
        snap.playerMode === "onFoot" &&
        carRef.current &&
        characterRef.current
      ) {
        const door = getCarWorldPoint(
          carRef.current,
          DRIVER_DOOR_OFFSET,
          interactionPointRef.current,
        );
        const distance = characterRef.current.position.distanceTo(door);
        canReach = distance <= INTERACTION_DISTANCE;
        nextMsg = canReach
          ? snap.speedKmh <= MAX_ENTER_SPEED_KMH
            ? "Press F or Tap ENTER to get in BMW M4"
            : "Stop the BMW to enter"
          : "";
      } else if (snap.playerMode === "driving") {
        nextMsg = snap.speedKmh > MAX_ENTER_SPEED_KMH ? "Brake and stop to exit" : "";
      }

      if (lastNearCarRef.current !== canReach) {
        lastNearCarRef.current = canReach;
        setNearCar(canReach);
      }
      if (nextMsg || Date.now() >= interactionToastUntilRef.current) {
        if (lastInteractionMsgRef.current !== nextMsg) {
          lastInteractionMsgRef.current = nextMsg;
          setInteractionMessage(nextMsg);
        }
      }

      emitTelemetrySnapshot(canReach);
    }, 100);
    return () => window.clearInterval(interval);
  }, [emitTelemetrySnapshot]);

  const socketActionsRef = useRef({});
  socketActionsRef.current = {
    cycleCamera,
    toggleVehicle,
    switchWeapon,
    reloadWeapon,
    playEmote,
    selectWeapon: (id) => {
      if (!Object.prototype.hasOwnProperty.call(WEAPONS, id)) return;
      setReloading(false);
      setWeaponId(id);
    },
    heal: () => handleUseMedkit(),
    ejectAircraft: () => setAircraftEjectToken((t) => t + 1),
    playAgain: handlePlayAgain,
    emitTelemetry: () => emitTelemetrySnapshot(),
    clearRemoteInput: () => clearRemoteInput(),
  };

  useEffect(() => {
    let active = true;
    const resolveLan = async () => {
      if (
        typeof window !== "undefined" &&
        !isLoopbackHost(window.location.hostname)
      ) {
        return;
      }
      const info = await fetchNetworkInfo();
      if (active && info?.primaryIp) {
        setLanIp(info.primaryIp);
      }
    };
    resolveLan();
    return () => {
      active = false;
    };
  }, [qrModalOpen]);

  useEffect(() => {
    const cleanupSocket = connectRelaySocket({
      role: "game",
      pairToken: playerSession.pairToken,
      playerId: playerSession.playerId,
      playerName: initialPlayerNameRef.current,
      onStatusChange: (statusInfo) => {
        setRelayStatus(statusInfo?.status || "connecting");
        if (statusInfo?.status !== "connected") {
          setPhoneLinked(false);
          setControllerCount(0);
        }
      },
      onCleanupSocket: (oldSocket) => {
        if (socketRef.current === oldSocket) {
          socketRef.current = null;
          setLobbySocket(null);
        }
      },
      onSocket: (socket) => {
        socketRef.current = socket;
        setLobbySocket(socket);

        socket.on("connect", () => {
          socketActionsRef.current.emitTelemetry?.();
        });

        socket.on("controller:status", (status) => {
          const isOnline = Boolean(status?.connected);
          setPhoneLinked(isOnline);
          setControllerCount(Number(status?.count) || (isOnline ? 1 : 0));
          if (isOnline) {
            socketActionsRef.current.emitTelemetry?.();
          }
        });

        socket.on("room:state", (room) => {
          setRoomState(room || null);
          if (!room || room.status !== "COUNTDOWN") {
            setCountdownSec(null);
          }
        });

        socket.on("room:countdown", (tick) => {
          if (typeof tick?.remainingSec === "number") {
            setCountdownSec(tick.remainingSec);
          }
        });

        socket.on("room:kicked", (notice) => {
          setRoomState(null);
          setCountdownSec(null);
          setActiveMatchManifest(null);
          setLobbyError(notice?.reason || "Removed from room by host.");
          setScreenMode("lobby");
        });

        socket.on("match:started", (payload) => {
          const nextRoom = payload?.room || null;
          const manifest = payload?.matchManifest || nextRoom?.matchManifest || null;
          if (nextRoom) setRoomState(nextRoom);
          setCountdownSec(null);
          setLobbyError("");
          const matchId = payload?.matchId || manifest?.matchId;
          if (matchId) {
            activeMatchIdRef.current = matchId;
            socket.emit("match:join", {
              matchId,
              playerId: playerSession.playerId,
            });
          }
          if (manifest) {
            setActiveMatchManifest(manifest);
            if (manifest.config?.mapId) {
              setMapPreset(manifest.config.mapId);
            }
          }
          socketActionsRef.current.playAgain?.();
          setScreenMode("game");
        });

        socket.on("match:snapshot", (snapshot) => {
          if (!snapshot || !Array.isArray(snapshot.players)) return;

          // Store high-frequency 3D transforms in ref (Zero React Re-renders)
          snapshot.players.forEach((p) => {
            remotePlayersDataRef.current.set(p.id, p);
          });

          // Only update React list if actual remote human players joined or left
          const humans = snapshot.players.filter(
            (p) => !p.isBot && p.id !== playerSession.playerId,
          );
          const idsStr = humans.map((h) => h.id).sort().join(",");
          if (idsStr !== prevHumanIdsRef.current) {
            prevHumanIdsRef.current = idsStr;
            setRemoteHumansList(
              humans.map((h) => ({ id: h.id, name: h.name, teamId: h.teamId })),
            );
          }

          const me = snapshot.players.find((p) => p.id === playerSession.playerId);
          if (me) {
            if (typeof me.hp === "number" && Math.abs(me.hp - playerHpRef.current) > 1) {
              setPlayerHp(me.hp);
            }
            if (typeof me.armor === "number" && Math.abs(me.armor - armorRef.current) > 1) {
              setArmor(me.armor);
            }
          }
        });

        socket.on("player:damaged", (data) => {
          if (data?.targetId === playerSession.playerId) {
            if (typeof data.remainingHp === "number") {
              setPlayerHp(data.remainingHp);
            }
            if (typeof data.remainingArmor === "number") {
              setArmor(data.remainingArmor);
            }
          }
        });

        socket.on("controller:input", (data) => {
          if (!data || typeof data !== "object") return;
          setPhoneLinked((prev) => (prev ? prev : true));
          remoteInputRef.current.accelerate = Boolean(data.accelerate);
          remoteInputRef.current.brake = Boolean(data.brake);
          remoteInputRef.current.handbrake = Boolean(data.handbrake);
          remoteInputRef.current.boost = Boolean(data.boost);

          const nextJump = Boolean(data.jump);
          if (nextJump && !prevRemoteJumpRef.current) {
            remoteInputRef.current.jumpPulse = true;
          }
          prevRemoteJumpRef.current = nextJump;
          remoteInputRef.current.jump = nextJump;

          remoteInputRef.current.crouch = Boolean(data.crouch);
          remoteInputRef.current.sprint = Boolean(data.sprint);
          remoteInputRef.current.autoRun = Boolean(data.autoRun);

          const nextFire = Boolean(data.fire);
          const nextAim = Boolean(data.aim);
          if (nextFire && !prevRemoteFireRef.current) {
            remoteInputRef.current.firePulse = true;
          }
          prevRemoteFireRef.current = nextFire;
          remoteInputRef.current.fire = nextFire;
          remoteInputRef.current.aim = nextAim;

          if (nextFire) {
            if (remoteFireReleaseTimerRef.current) {
              window.clearTimeout(remoteFireReleaseTimerRef.current);
              remoteFireReleaseTimerRef.current = null;
            }
            remoteFireMinUntilRef.current = performance.now() + 140;
            setRemoteFiring((prev) => (prev ? prev : true));
          } else {
            const remaining = remoteFireMinUntilRef.current - performance.now();
            if (remaining > 10) {
              if (!remoteFireReleaseTimerRef.current) {
                remoteFireReleaseTimerRef.current = window.setTimeout(() => {
                  remoteFireReleaseTimerRef.current = null;
                  if (!remoteInputRef.current.fire) {
                    setRemoteFiring(false);
                  }
                }, remaining);
              }
            } else {
              setRemoteFiring(false);
            }
          }

          remoteInputRef.current.dragUp = Boolean(data.dragUp);
          setRemoteAiming((prev) => (prev === nextAim ? prev : nextAim));
          remoteInputRef.current.steer = Number(data.steer) || 0;
          remoteInputRef.current.moveX = Number(data.moveX) || 0;
          remoteInputRef.current.moveY = Number(data.moveY) || 0;
          remoteInputRef.current.lookX = Number(data.lookX) || 0;
          remoteInputRef.current.lookY = Number(data.lookY) || 0;
          if (typeof data.lookDeltaX === "number" && Number.isFinite(data.lookDeltaX)) {
            const clampedDX = Math.max(-0.5, Math.min(0.5, data.lookDeltaX));
            remoteInputRef.current.lookDeltaX = (remoteInputRef.current.lookDeltaX || 0) + clampedDX;
          }
          if (typeof data.lookDeltaY === "number" && Number.isFinite(data.lookDeltaY)) {
            const clampedDY = Math.max(-0.5, Math.min(0.5, data.lookDeltaY));
            remoteInputRef.current.lookDeltaY = (remoteInputRef.current.lookDeltaY || 0) + clampedDY;
          }
        });
        socket.on("controller:action", (action) => {
          const actions = socketActionsRef.current;
          if (action === "syncState") actions.emitTelemetry?.();
          if (action === "camera") actions.cycleCamera?.();
          if (action === "reset") remoteInputRef.current.reset = true;
          if (action === "toggleVehicle") actions.toggleVehicle?.();
          if (action === "switchWeapon") actions.switchWeapon?.();
          if (action === "reloadWeapon") actions.reloadWeapon?.();
          if (action === "heal") actions.heal?.();
          if (action === "ejectAircraft") actions.ejectAircraft?.();
          if (action === "playAgain") actions.playAgain?.();
          if (typeof action === "string" && action.startsWith("selectWeapon:")) {
            actions.selectWeapon?.(action.split(":")[1]);
          }
          if (typeof action === "string" && action.startsWith("emote:")) {
            actions.playEmote?.(action.split(":")[1]);
          }
        });
        socket.on("controller:settings", (settings) => {
          if (settings.steerHudSide) setSteerHudSide(settings.steerHudSide);
          if (settings.scenePreset) setScenePreset(settings.scenePreset);
          if (settings.mapPreset) setMapPreset(settings.mapPreset);
        });
        socket.on("controller:disconnected", () => {
          setPhoneLinked(false);
          setControllerCount(0);
          socketActionsRef.current.clearRemoteInput?.();
        });
      },
    });
    return () => {
      if (remoteFireReleaseTimerRef.current) {
        window.clearTimeout(remoteFireReleaseTimerRef.current);
        remoteFireReleaseTimerRef.current = null;
      }
      cleanupSocket();
      socketRef.current = null;
      setLobbySocket(null);
      setPhoneLinked(false);
      setControllerCount(0);
    };
  }, [playerSession.pairToken, playerSession.playerId]);

  // Phase 1: Real-time Authoritative Multiplayer Player State Synchronization (~25Hz)
  useEffect(() => {
    if (screenMode !== "game") return undefined;

    const syncInterval = setInterval(() => {
      const socket = socketRef.current;
      const char = characterRef.current;
      if (!socket?.connected || !char) return;

      const matchId = activeMatchIdRef.current;
      if (!matchId) return;

      socket.emit("player:state", {
        matchId,
        playerId: playerSession.playerId,
        position: {
          x: char.position.x,
          y: char.position.y,
          z: char.position.z,
        },
        rotation: {
          yaw: char.rotation.y,
          pitch: cameraPitchRef.current || 0,
        },
        velocity: {
          x: physicsStateRef.current?.vx || 0,
          z: physicsStateRef.current?.vy || 0,
        },
        animation: playerModeRef.current === "driving" ? "drivingSeat" : charAnimationRef.current,
        weaponId: weaponIdRef.current,
        aiming: isAimingRef.current,
        firing: isFiringRef.current,
        vehicleMode: playerModeRef.current,
        hp: playerHpRef.current,
        armor: armorRef.current,
      });
    }, 40);

    return () => clearInterval(syncInterval);
  }, [screenMode, playerSession.playerId]);

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
  }, []);

  const handleCollidersReady = useCallback(() => {
    setCollidersVersion((v) => v + 1);
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
  const networkUrl = getNetworkControllerUrl(lanIp, playerSession.pairToken);

  const handlePlayerNameChange = useCallback((nextName) => {
    setSessionPlayerName(nextName);
    setPlayerSession((prev) => ({ ...prev, playerName: nextName }));
  }, []);

  const handleLaunchQuickSolo = useCallback(() => {
    setActiveMatchManifest(null);
    handlePlayAgain();
    setScreenMode("game");
  }, [handlePlayAgain]);

  const handleReturnToLobby = useCallback(() => {
    if (
      roomState &&
      roomState.hostPlayerId === playerSession.playerId &&
      socketRef.current?.connected
    ) {
      socketRef.current.emit("room:return-lobby", {
        playerId: playerSession.playerId,
      });
    }
    setActiveMatchManifest(null);
    setScreenMode("lobby");
  }, [roomState, playerSession.playerId]);

  const roomSummaryText = activeMatchManifest
    ? `${activeMatchManifest.inviteCode} · ${activeMatchManifest.counts.total} SLOTS (${activeMatchManifest.config.mode.toUpperCase()})`
    : roomState
      ? `${roomState.inviteCode} · ${roomState.slots.totalOccupied} SLOTS`
      : "";
  const isLoopbackUrl =
    typeof window !== "undefined" &&
    isLoopbackHost(window.location.hostname) &&
    !lanIp;
  const copyNetworkUrl = useCallback(() => {
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard
      .writeText(networkUrl)
      .catch((error) => console.error("Unable to copy controller URL:", error));
  }, [networkUrl]);

  const handleUseMedkit = useCallback(() => {
    setInventory((prev) => {
      if (prev.medkits <= 0) return prev;
      return { ...prev, medkits: prev.medkits - 1 };
    });
    setPlayerHp((prev) => Math.min(100, prev + 75));
  }, []);

  return (
    <main className="game-shell">
      {screenMode === "lobby" ? (
        <CustomRoomLobby
          socket={lobbySocket}
          relayStatus={relayStatus}
          session={playerSession}
          onPlayerNameChange={handlePlayerNameChange}
          room={roomState}
          onRoomSync={setRoomState}
          countdownSec={countdownSec}
          lobbyError={lobbyError}
          onReportError={setLobbyError}
          onClearError={() => setLobbyError("")}
          initialInviteCode={initialInviteCode}
          lanIp={lanIp}
          phoneLinked={phoneLinked}
          controllerCount={controllerCount}
          onOpenQr={() => setQrModalOpen(true)}
          onLaunchQuickSolo={handleLaunchQuickSolo}
        />
      ) : (
        <>
          <Canvas
            shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[-30, 50, 12]}
          fov={50}
          near={0.5}
          far={600}
        />
        <Suspense fallback={null}>
          <OpenWorldMap
            collidersRef={collidersRef}
            mapKey={mapPreset}
            onCollidersReady={handleCollidersReady}
          />
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
            visible={matchStatus !== "DROPPING" || aircraftPhase === "falling"}
            weaponId={playerMode === "onFoot" ? weaponId : "fist"}
            aiming={isAiming}
            firing={isFiring || isPunching}
            aimPitch={cameraPitchRef.current}
            onAnimationFinished={handleCharacterAnimationFinished}
            onAnimationProgress={handleAnimationProgress}
          />
          <RemotePlayers
            remoteHumansList={remoteHumansList}
            remotePlayersDataRef={remotePlayersDataRef}
            localTeamId={myTeamId}
          />
          <CombatManager
            enabled={playerMode === "onFoot" && matchStatus === "IN_PROGRESS"}
            characterRef={characterRef}
            collidersRef={collidersRef}
            weaponId={weaponId}
            firing={isFiring || isPunching}
            canFire={weaponId === "fist" ? true : (isArmed && !reloading && currentAmmo.mag > 0)}
            remoteInputRef={remoteInputRef}
            dragFireUp={dragFireUpRef.current}
            dragUpRatio={dragUpRatioRef.current}
            resetToken={resetToken}
            collidersReadyVersion={collidersVersion}
            onShotEvaluated={handleShotEvaluated}
            onPlayerDamaged={handlePlayerDamaged}
            onBotEliminated={handleBotEliminated}
            onAllBotsEliminated={handleAllBotsEliminated}
            onAliveCountChange={setAliveCount}
            onAimAssistChange={setAimAssistState}
            onBotsPositionUpdate={handleBotsPositionUpdate}
          />
          <ZoneManager
            matchStatus={matchStatus}
            matchElapsed={survivalSeconds}
            playerPos={characterRef.current?.position}
            onZoneDamage={handleZoneDamage}
            enabled={true}
          />
          <LootManager
            collidersRef={collidersRef}
            characterRef={characterRef}
            interactPressed={interactPressed}
            matchStatus={matchStatus}
            resetToken={resetToken}
            collidersReadyVersion={collidersVersion}
            onLootPickup={handleLootPickup}
          />
          <AircraftDrop
            active={matchStatus === "DROPPING"}
            ejectToken={aircraftEjectToken}
            characterRef={characterRef}
            collidersRef={collidersRef}
            onLanded={handleAircraftLanded}
            onPhaseChange={setAircraftPhase}
            remoteInputRef={remoteInputRef}
          />
        </Suspense>
        <VehicleOccupantSync
          carRef={carRef}
          characterRef={characterRef}
          playerMode={playerMode}
          doorProgressRef={doorProgressRef}
          enabled={matchStatus !== "DROPPING"}
        />
        <CarController
          carRef={carRef}
          wheelAssembliesRef={wheelAssembliesRef}
          collidersRef={collidersRef}
          enabled={playerMode === "driving" && matchStatus === "IN_PROGRESS"}
          onTelemetryChange={handleTelemetryChange}
          onCollision={handleCollision}
          physicsStateRef={physicsStateRef}
          remoteInputRef={remoteInputRef}
        />
        <CharacterController
          characterRef={characterRef}
          carRef={carRef}
          collidersRef={collidersRef}
          enabled={playerMode === "onFoot" && matchStatus === "IN_PROGRESS"}
          emoteActive={emoteActive}
          combatStanceActive={isAiming || isFiring}
          cameraYawRef={cameraYawRef}
          remoteInputRef={remoteInputRef}
          onAnimationChange={setCharAnimation}
          onEmote={(key) => {
            const emote = EMOTES.find((item) => item.key === key);
            if (emote) playEmote(emote.id);
          }}
        />

        <FollowCamera
          enabled={matchStatus !== "DROPPING"}
          targetRef={isCharacterMode ? characterRef : carRef}
          physicsStateRef={physicsStateRef}
          remoteInputRef={remoteInputRef}
          cameraMode={cameraMode}
          isCharacterMode={isCharacterMode}
          isArmed={isArmed}
          isAiming={isAiming}
          orbitYawRef={cameraYawRef}
          orbitPitchRef={cameraPitchRef}
          aimAssistLocked={aimAssistState.locked}
        />
      </Canvas>

      {/* Single-root 3D-to-2D projected overlays (bot tags, damage popups, loot prompts) */}
      <WorldHtmlLayer />

      {/* Free Fire Custom Battle Royale HUD */}
      <FreeFireHUD
        playerMode={playerMode}
        matchStatus={matchStatus}
        aircraftPhase={aircraftPhase}
        kills={kills}
        aliveCount={aliveCount}
        weaponId={weaponId}
        inventory={inventory}
        medkitCount={inventory.medkits}
        ammoState={ammoState}
        reloading={reloading}
        playerHp={playerHp}
        armor={armor}
        helmet={helmet}
        vestLevel={vestLevel}
        helmetLevel={helmetLevel}
        hitMarker={hitMarker}
        killFeed={killFeed}
        killBanner={killBanner}
        matchElapsed={survivalSeconds}
        cameraYaw={cameraYawRef.current}
        characterPos={characterRef.current?.position}
        isAiming={isAiming}
        isFiring={isFiring || isPunching}
        nearCar={nearCar}
        speedKmh={speedKmh}
        aimAssistLocked={aimAssistState.locked}
        isHeadshotLocked={aimAssistState.headshot}
        enemies={enemiesList}
        carPos={currentCarPos}
        onSwitchWeapon={switchWeapon}
        onReloadWeapon={reloadWeapon}
        onToggleVehicle={toggleVehicle}
        onSelectWeapon={(id) => {
          setReloading(false);
          setWeaponId(id);
        }}
        onHeal={() => handleUseMedkit()}
        onAimToggle={() => setMouseAiming((prev) => !prev)}
        onFireStart={() => setMouseFiring(true)}
        onFireEnd={() => setMouseFiring(false)}
        onFireDrag={handleFireDrag}
        onJump={() => {
          remoteInputRef.current.jump = true;
          if (jumpTimerRef.current) window.clearTimeout(jumpTimerRef.current);
          jumpTimerRef.current = window.setTimeout(() => {
            jumpTimerRef.current = null;
            remoteInputRef.current.jump = false;
          }, 120);
        }}
        onCrouch={() => {
          remoteInputRef.current.crouch = !remoteInputRef.current.crouch;
        }}
        onSprint={() => {
          remoteInputRef.current.sprint = !remoteInputRef.current.sprint;
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenQr={() => setQrModalOpen(true)}
        onCycleCamera={cycleCamera}
        onResetVehicle={() => {
          remoteInputRef.current.reset = true;
        }}
        onToggleInventory={() => setIsInventoryOpen((prev) => !prev)}
        onEjectAircraft={() => setAircraftEjectToken((t) => t + 1)}
        onReturnToLobby={handleReturnToLobby}
        roomSummaryText={roomSummaryText}
        editCustomHud={editCustomHud}
        onToggleCustomHud={setEditCustomHud}
      />

      {/* Free Fire Backpack / Inventory Modal */}
      <InventoryUI
        isOpen={isInventoryOpen}
        inventory={inventory}
        ammoState={ammoState}
        weaponId={weaponId}
        onClose={() => setIsInventoryOpen(false)}
        onEquipWeapon={handleEquipWeapon}
        onDropItem={handleDropItem}
        onUseMedkit={() => {
          if (inventory.medkits > 0 && playerHp < 100) {
            handleUseMedkit();
          }
        }}
      />

      {/* Screen Damage Vignette (Blue Zone Damage) */}
      {zoneDamageFlash && <div className="ff-zone-damage-overlay" />}

      {/* Free Fire BOOYAH! Victory & Defeat Modal */}
      <FreeFireVictoryModal
        status={matchStatus}
        kills={kills}
        damageDealt={damageDealt}
        survivalSeconds={survivalSeconds}
        headshots={headshots}
        shotsFired={shotsFired}
        rank={finalRank}
        totalPlayers={7}
        onPlayAgain={handlePlayAgain}
        onDismiss={() => setMatchStatus("IN_PROGRESS")}
        onReturnToLobby={handleReturnToLobby}
      />

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

      {playerMode === "onFoot" && matchStatus === "IN_PROGRESS" && (
        <section className="character-emote-bar-compact">
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
        </section>
      )}

      {matchStatus === "IN_PROGRESS" && (interactionMessage || isTransitioning) && (
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

      {modelError && <div className="error-banner">{modelError}</div>}
      {matchStatus !== "DROPPING" && (
        <div className="corner-status">
          <span
            className={phoneLinked ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"}
          />
          {playerMode === "driving"
            ? `DRIVING M4 · ${Math.round(speedKmh)} KM/H`
            : playerMode === "onFoot"
              ? `COMBAT READY · ${currentWeapon.name}`
              : playerMode.toUpperCase()}
        </div>
      )}
      <Loader containerStyles={{ background: "rgba(9,13,20,.92)" }} />
        </>
      )}

      <QrConnectModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        networkUrl={networkUrl}
        onCopyUrl={copyNetworkUrl}
        relayStatus={relayStatus}
        isLoopbackUrl={isLoopbackUrl}
        pairToken={playerSession.pairToken}
      />
      <GameSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        steerHudSide={steerHudSide}
        onSteerHudSideChange={setSteerHudSide}
        scenePreset={scenePreset}
        onScenePresetChange={setScenePreset}
        mapPreset={mapPreset}
        onMapPresetChange={setMapPreset}
        onOpenCustomHud={() => setEditCustomHud(true)}
      />
    </main>
  );
}
