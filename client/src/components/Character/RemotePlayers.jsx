import React, { memo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CharacterModel from "./CharacterModel";
import WorldHtml from "../UI/WorldHtml";

const RemotePlayerPuppet = memo(function RemotePlayerPuppet({
  playerInfo,
  remotePlayersDataRef,
  isTeammate = false,
}) {
  const groupRef = useRef(null);
  const targetPosRef = useRef(new THREE.Vector3(0, 1, 0));
  const targetYawRef = useRef(0);
  const currentYawRef = useRef(0);

  const [puppetAnim, setPuppetAnim] = useState("idle");
  const [puppetWeapon, setPuppetWeapon] = useState("fist");
  const [puppetAim, setPuppetAim] = useState(false);
  const [puppetFire, setPuppetFire] = useState(false);
  const [puppetAimPitch, setPuppetAimPitch] = useState(0);
  const [hpPercent, setHpPercent] = useState(100);
  const [isAlive, setIsAlive] = useState(true);

  const prevAnimRef = useRef("idle");
  const prevWeaponRef = useRef("fist");
  const prevAimRef = useRef(false);
  const prevFireRef = useRef(false);
  const prevHpRef = useRef(100);
  const prevAliveRef = useRef(true);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;

    const data = remotePlayersDataRef?.current?.get(playerInfo.id);
    if (data) {
      if (Array.isArray(data.pos)) {
        targetPosRef.current.set(data.pos[0], data.pos[1], data.pos[2]);
      }
      if (Array.isArray(data.rot)) {
        targetYawRef.current = data.rot[0];
      }

      // Check discrete stance and animation changes without re-rendering every frame
      const nextAnim = !data.alive
        ? "knockedOut"
        : data.veh === "driving"
        ? "drivingSeat"
        : data.anim || "idle";
      if (nextAnim !== prevAnimRef.current) {
        prevAnimRef.current = nextAnim;
        setPuppetAnim(nextAnim);
      }

      const nextWep = data.veh === "driving" ? "fist" : data.wep || "fist";
      if (nextWep !== prevWeaponRef.current) {
        prevWeaponRef.current = nextWep;
        setPuppetWeapon(nextWep);
      }

      const nextAim = Boolean(data.aim);
      if (nextAim !== prevAimRef.current) {
        prevAimRef.current = nextAim;
        setPuppetAim(nextAim);
      }

      const nextFire = Boolean(data.fire);
      if (nextFire !== prevFireRef.current) {
        prevFireRef.current = nextFire;
        setPuppetFire(nextFire);
      }

      const nextPitch = data.rot ? data.rot[1] : 0;
      setPuppetAimPitch(nextPitch);

      const nextHp = Math.max(0, Math.min(100, data.hp ?? 100));
      if (Math.abs(nextHp - prevHpRef.current) >= 1) {
        prevHpRef.current = nextHp;
        setHpPercent(nextHp);
      }

      const nextAlive = data.alive !== false && nextHp > 0;
      if (nextAlive !== prevAliveRef.current) {
        prevAliveRef.current = nextAlive;
        setIsAlive(nextAlive);
      }
    }

    const dt = Math.min(rawDelta, 0.05);

    // Smooth position interpolation (lerp)
    group.position.lerp(targetPosRef.current, 1 - Math.exp(-22 * dt));

    // Smooth angle interpolation without wrap-around snapping
    const currentYaw = currentYawRef.current;
    const targetYaw = targetYawRef.current;
    let diff = targetYaw - currentYaw;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    const nextYaw = currentYaw + diff * (1 - Math.exp(-24 * dt));
    currentYawRef.current = nextYaw;
    group.rotation.y = nextYaw;
  });

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      {/* 3D Character Model with Server-Synchronized Animations and Weapon Stance */}
      <CharacterModel
        animation={puppetAnim}
        visible={true}
        weaponId={puppetWeapon}
        aiming={puppetAim}
        firing={puppetFire}
        aimPitch={puppetAimPitch}
        bodyColor={isTeammate ? "#00ff88" : null}
      />

      {/* High-performance single-root 3D-to-2D projected overhead nametag & health bar */}
      <WorldHtml position={[0, 2.15, 0]} center distanceFactor={16}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "110px",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {/* Player Name and Team Tag */}
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.5px",
              color: !isAlive ? "#888888" : isTeammate ? "#00ffc2" : "#ff3355",
              textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)",
              whiteSpace: "nowrap",
              marginBottom: "3px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isTeammate && (
              <span
                style={{
                  background: "#00c853",
                  color: "#000",
                  padding: "1px 4px",
                  borderRadius: "3px",
                  fontSize: "9px",
                  fontWeight: 900,
                }}
              >
                TEAM
              </span>
            )}
            {playerInfo.name || "Player"}
          </div>

          {/* Health Bar */}
          {isAlive ? (
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "3px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              <div
                style={{
                  width: `${hpPercent}%`,
                  height: "100%",
                  backgroundColor: isTeammate
                    ? hpPercent > 35
                      ? "#00ff88"
                      : "#ffaa00"
                    : hpPercent > 35
                    ? "#ff2a4b"
                    : "#ff1122",
                  transition: "width 0.15s ease-out",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                fontSize: "9px",
                color: "#ff3333",
                fontWeight: 900,
                letterSpacing: "0.8px",
                textShadow: "0 1px 3px #000",
              }}
            >
              ELIMINATED
            </div>
          )}
        </div>
      </WorldHtml>
    </group>
  );
});

export default function RemotePlayers({
  remoteHumansList = [],
  remotePlayersDataRef = null,
  localTeamId = null,
}) {
  return (
    <group name="REMOTE_HUMAN_PLAYERS_GROUP">
      {remoteHumansList.map((player) => {
        const isTeammate =
          localTeamId != null &&
          player.teamId != null &&
          player.teamId === localTeamId;

        return (
          <RemotePlayerPuppet
            key={player.id}
            playerInfo={player}
            remotePlayersDataRef={remotePlayersDataRef}
            isTeammate={isTeammate}
          />
        );
      })}
    </group>
  );
}
