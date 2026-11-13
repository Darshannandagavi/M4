import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MAP_PRESETS } from "../../config/gameConstants";
import { getRoomInviteUrl } from "../../utils/network";
import Icons from "../UI/Icons";
import "./CustomRoomLobby.css";

function extractInviteCode(rawInput) {
  const trimmed = (rawInput || "").trim();
  if (!trimmed) return "";
  if (trimmed.includes("room=")) {
    try {
      const parsed = new URL(
        trimmed.startsWith("http") ? trimmed : `https://dummy.local/${trimmed.replace(/^\/+/, "")}`,
      );
      const param = parsed.searchParams.get("room");
      if (param) return param.trim().toUpperCase();
    } catch {}
    const match = trimmed.match(/[?&]room=([a-zA-Z0-9_-]+)/i);
    if (match?.[1]) return match[1].toUpperCase();
  }
  return trimmed.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export default function CustomRoomLobby({
  socket,
  relayStatus,
  session,
  onPlayerNameChange,
  room,
  onRoomSync,
  countdownSec,
  lobbyError,
  onReportError,
  onClearError,
  initialInviteCode,
  lanIp,
  phoneLinked,
  controllerCount,
  onOpenQr,
  onLaunchQuickSolo,
}) {
  const [nameDraft, setNameDraft] = useState(session.playerName || "Survivor");
  const [joinInput, setJoinInput] = useState(initialInviteCode || "");
  const [invitedPreview, setInvitedPreview] = useState(null);
  const [openRooms, setOpenRooms] = useState([]);
  const [busyAction, setBusyAction] = useState("");
  const [copyToast, setCopyToast] = useState("");

  // Creation draft config
  const [createConfig, setCreateConfig] = useState({
    mapId: "bermuda",
    mode: "solo",
    maxPlayers: 50,
    botsEnabled: true,
    autoFillBots: true,
    botCount: 49,
    botDifficulty: "normal",
    countdownSec: 5,
  });

  useEffect(() => {
    setNameDraft(session.playerName || "Survivor");
  }, [session.playerName]);

  useEffect(() => {
    if (initialInviteCode) {
      setJoinInput(initialInviteCode);
    }
  }, [initialInviteCode]);

  // Fetch invited room preview or active waiting rooms when in lobby hub
  useEffect(() => {
    if (room) return undefined;
    let cancelled = false;

    const loadRooms = async () => {
      try {
        const res = await fetch("/api/rooms", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && Array.isArray(data?.rooms)) {
            setOpenRooms(data.rooms);
          }
        }
      } catch {}

      if (initialInviteCode) {
        try {
          const res = await fetch(`/api/rooms/${encodeURIComponent(initialInviteCode)}`, {
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            if (!cancelled && data?.ok && data.room) {
              setInvitedPreview(data.room);
            }
          }
        } catch {}
      }
    };

    loadRooms();
    const poll = window.setInterval(loadRooms, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, [room, initialInviteCode]);

  const showCopyToast = useCallback((msg) => {
    setCopyToast(msg);
    window.setTimeout(() => setCopyToast(""), 2000);
  }, []);

  const emitRoomAction = useCallback(
    (event, payload = {}) =>
      new Promise((resolve) => {
        if (!socket || !socket.connected) {
          const offlineRes = {
            ok: false,
            error: "OFFLINE",
            message: "Multiplayer server is not connected yet.",
          };
          onReportError?.(offlineRes.message);
          resolve(offlineRes);
          return;
        }
        socket.emit(
          event,
          {
            playerId: session.playerId,
            playerName: nameDraft.trim() || session.playerName,
            ...payload,
          },
          (res) => {
            const finalRes = res || { ok: false, message: "No server response." };
            if (!finalRes.ok && finalRes.message) {
              onReportError?.(finalRes.message);
            } else if (finalRes.ok) {
              if (event === "room:leave") {
                onRoomSync?.(null);
              } else if (finalRes.room) {
                onRoomSync?.(finalRes.room);
              }
            }
            resolve(finalRes);
          },
        );
      }),
    [socket, session.playerId, session.playerName, nameDraft, onReportError, onRoomSync],
  );

  const handleSaveName = useCallback(() => {
    const cleaned = nameDraft.trim() || session.playerName || "Survivor";
    setNameDraft(cleaned);
    onPlayerNameChange?.(cleaned);
    if (socket?.connected) {
      socket.emit("auth:identify", {
        playerId: session.playerId,
        playerName: cleaned,
        pairToken: session.pairToken,
      });
    }
  }, [nameDraft, session.playerId, session.playerName, session.pairToken, onPlayerNameChange, socket]);

  const handleCreateRoom = useCallback(async () => {
    onClearError?.();
    handleSaveName();
    setBusyAction("create");
    await emitRoomAction("room:create", { config: createConfig });
    setBusyAction("");
  }, [onClearError, handleSaveName, emitRoomAction, createConfig]);

  const handleJoinCode = useCallback(
    async (explicitCode = null) => {
      onClearError?.();
      handleSaveName();
      const code = extractInviteCode(explicitCode ?? joinInput);
      if (!code) return;
      setBusyAction("join");
      await emitRoomAction("room:join", { inviteCode: code });
      setBusyAction("");
    },
    [onClearError, handleSaveName, joinInput, emitRoomAction],
  );

  const myPlayer = useMemo(() => {
    if (!room) return null;
    return room.players.find((p) => p.playerId === session.playerId) || null;
  }, [room, session.playerId]);

  const isHost = Boolean(room && room.hostPlayerId === session.playerId);

  const inviteUrl = useMemo(() => {
    if (!room?.inviteCode) return "";
    return getRoomInviteUrl(room.inviteCode, lanIp);
  }, [room?.inviteCode, lanIp]);

  const copyText = useCallback(
    async (text, label) => {
      if (!text) return;
      try {
        await navigator.clipboard?.writeText(text);
        showCopyToast(`${label} copied`);
      } catch {
        showCopyToast(`${label}: ${text}`);
      }
    },
    [showCopyToast],
  );

  const handleConfigPatch = useCallback(
    async (patch) => {
      if (!isHost) return;
      onClearError?.();
      await emitRoomAction("room:config", { patch });
    },
    [isHost, onClearError, emitRoomAction],
  );

  const unreadyGuestCount = useMemo(() => {
    if (!room) return 0;
    return room.players.filter(
      (p) => p.connected && p.playerId !== room.hostPlayerId && !p.ready,
    ).length;
  }, [room]);

  const botSampleCount = Math.min(room?.botSummary?.count || 0, 12);

  return (
    <div className="ff-lobby-root" data-testid="custom-room-lobby">
      <div className="ff-lobby-shell">
        <header className="ff-lobby-topbar">
          <div className="ff-lobby-brand">
            <div className="ff-lobby-logo">FF</div>
            <div>
              <h1 className="ff-lobby-title">Battle Royale 50 · Custom Lobby</h1>
              <p className="ff-lobby-subtitle">
                50-Participant Custom Rooms · Friends &amp; AI Bots · Scoped Phone Pairing
              </p>
            </div>
          </div>

          <div className="ff-lobby-top-actions">
            <span
              className={`ff-pill-status ${
                relayStatus === "connected" ? "online" : "offline"
              }`}
              data-testid="relay-status-pill"
            >
              <span className="ff-dot" />
              SERVER: {relayStatus === "connected" ? "ONLINE" : relayStatus.toUpperCase()}
            </span>

            <button
              type="button"
              className="ff-btn ff-btn-ghost"
              onClick={onOpenQr}
              data-testid="lobby-qr-btn"
            >
              <Icons.QRCode />
              <span>
                {phoneLinked
                  ? `PHONE SYNCED (${controllerCount})`
                  : "PAIR PHONE QR"}
              </span>
            </button>

            <button
              type="button"
              className="ff-btn ff-btn-ghost"
              onClick={onLaunchQuickSolo}
              data-testid="quick-solo-btn"
            >
              QUICK SOLO (OFFLINE)
            </button>
          </div>
        </header>

        {lobbyError && (
          <div className="ff-alert error" role="alert" data-testid="lobby-error-banner">
            <span>{lobbyError}</span>
            <button
              type="button"
              className="ff-btn ff-btn-sm ff-btn-ghost"
              onClick={onClearError}
            >
              DISMISS
            </button>
          </div>
        )}

        {copyToast && (
          <div className="ff-alert info" data-testid="copy-toast">
            <span>{copyToast}</span>
          </div>
        )}

        {!room && invitedPreview && (
          <div className="ff-alert invite" data-testid="invite-preview-banner">
            <div>
              <strong>Room Invite Detected: {invitedPreview.inviteCode}</strong>
              {" · "}
              {MAP_PRESETS[invitedPreview.config?.mapId]?.label || invitedPreview.config?.mapId}
              {" · "}
              {(invitedPreview.config?.mode || "solo").toUpperCase()}
              {" · "}
              {invitedPreview.slots?.realPlayers}/{invitedPreview.slots?.configuredMax} Humans
            </div>
            <button
              type="button"
              className="ff-btn ff-btn-accent"
              disabled={relayStatus !== "connected" || busyAction === "join"}
              onClick={() => handleJoinCode(invitedPreview.inviteCode)}
              data-testid="join-invited-room-btn"
            >
              JOIN INVITED ROOM
            </button>
          </div>
        )}

        {!room ? (
          <div className="ff-lobby-grid-entry">
            {/* Create Room Panel */}
            <section className="ff-card">
              <div className="ff-card-header">
                <h2 className="ff-card-title">Create 50-Player Custom Room</h2>
                <span className="ff-badge host">HOST MODE</span>
              </div>

              <div className="ff-field">
                <label htmlFor="ff-callsign">Your Survivor Callsign</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    id="ff-callsign"
                    data-testid="callsign-input"
                    className="ff-input"
                    maxLength={20}
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onBlur={handleSaveName}
                    placeholder="Enter callsign"
                  />
                  <button
                    type="button"
                    className="ff-btn ff-btn-ghost"
                    onClick={handleSaveName}
                  >
                    SAVE
                  </button>
                </div>
              </div>

              <div className="ff-field-grid">
                <div className="ff-field">
                  <label htmlFor="create-map">Map Selection</label>
                  <select
                    id="create-map"
                    className="ff-select"
                    value={createConfig.mapId}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, mapId: e.target.value }))
                    }
                  >
                    {Object.entries(MAP_PRESETS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ff-field">
                  <label htmlFor="create-mode">Match Mode</label>
                  <select
                    id="create-mode"
                    className="ff-select"
                    value={createConfig.mode}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, mode: e.target.value }))
                    }
                  >
                    <option value="solo">SOLO (1/Team)</option>
                    <option value="duo">DUO (2/Team)</option>
                    <option value="squad">SQUAD (4/Team)</option>
                  </select>
                </div>

                <div className="ff-field">
                  <label htmlFor="create-max">Max Match Capacity (2 - 50)</label>
                  <input
                    id="create-max"
                    type="number"
                    min={2}
                    max={50}
                    className="ff-input"
                    value={createConfig.maxPlayers}
                    onChange={(e) =>
                      setCreateConfig((c) => ({
                        ...c,
                        maxPlayers: Math.max(2, Math.min(50, Number(e.target.value) || 50)),
                      }))
                    }
                  />
                </div>

                <div className="ff-field">
                  <label htmlFor="create-diff">AI Bot Difficulty</label>
                  <select
                    id="create-diff"
                    className="ff-select"
                    value={createConfig.botDifficulty}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, botDifficulty: e.target.value }))
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>
              </div>

              <div className="ff-field-grid">
                <label className="ff-toggle-row">
                  <span>Enable AI Bots</span>
                  <input
                    type="checkbox"
                    checked={createConfig.botsEnabled}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, botsEnabled: e.target.checked }))
                    }
                  />
                </label>

                <label className="ff-toggle-row">
                  <span>Auto-Fill Empty Slots</span>
                  <input
                    type="checkbox"
                    disabled={!createConfig.botsEnabled}
                    checked={createConfig.autoFillBots}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, autoFillBots: e.target.checked }))
                    }
                  />
                </label>
              </div>

              <button
                type="button"
                className="ff-btn ff-btn-accent"
                disabled={relayStatus !== "connected" || busyAction === "create"}
                onClick={handleCreateRoom}
                data-testid="create-room-btn"
              >
                {busyAction === "create"
                  ? "CREATING ROOM..."
                  : "CREATE CUSTOM ROOM (50 SLOTS)"}
              </button>
            </section>

            {/* Join Room + Open Rooms Panel */}
            <section className="ff-card">
              <div className="ff-card-header">
                <h2 className="ff-card-title">Join By Invite Code Or Link</h2>
                <span className="ff-badge team">FRIEND INVITE</span>
              </div>

              <div className="ff-field">
                <label htmlFor="join-code-input">6-Char Invite Code or Full Invite URL</label>
                <input
                  id="join-code-input"
                  data-testid="join-code-input"
                  className="ff-input"
                  placeholder="e.g. X7K9P2 or http://.../?room=X7K9P2"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleJoinCode();
                  }}
                />
              </div>

              <button
                type="button"
                className="ff-btn ff-btn-ready"
                disabled={
                  relayStatus !== "connected" ||
                  busyAction === "join" ||
                  !extractInviteCode(joinInput)
                }
                onClick={() => handleJoinCode()}
                data-testid="join-room-btn"
              >
                {busyAction === "join" ? "JOINING..." : "JOIN CUSTOM ROOM"}
              </button>

              <div className="ff-card-header" style={{ marginTop: "6px" }}>
                <h3 className="ff-card-title">Active Custom Rooms</h3>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {openRooms.length} ACTIVE
                </span>
              </div>

              {openRooms.length === 0 ? (
                <div style={{ fontSize: "12px", color: "#94a3b8", padding: "6px 0" }}>
                  No active custom rooms yet. Create one to get an invite code and link!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {openRooms.map((r) => (
                    <div key={r.roomId} className="ff-open-room-row">
                      <div>
                        <strong style={{ color: "#fbbf24" }}>{r.inviteCode}</strong>
                        {" · "}
                        <span>{MAP_PRESETS[r.mapId]?.label || r.mapId}</span>
                        {" · "}
                        <span>{(r.mode || "solo").toUpperCase()}</span>
                        {" · "}
                        <span style={{ color: "#94a3b8" }}>
                          {r.slots.realPlayers}H + {r.slots.bots}B / {r.slots.configuredMax}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="ff-btn ff-btn-sm ff-btn-accent"
                        disabled={r.status !== "LOBBY" || relayStatus !== "connected"}
                        onClick={() => handleJoinCode(r.inviteCode)}
                      >
                        {r.status === "LOBBY" ? "JOIN" : r.status}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <>
            {/* Room Identity & Share Banner */}
            <section className="ff-code-banner">
              <div>
                <div style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.08em" }}>
                  ROOM ID: <strong style={{ color: "#e2e8f0" }}>{room.roomId}</strong>
                  {" · "}
                  STATUS: <strong data-testid="room-status-text">{room.status}</strong>
                  {" · "}
                  MAP:{" "}
                  <strong>{MAP_PRESETS[room.config.mapId]?.label || room.config.mapId}</strong>
                  {" · "}
                  MODE: <strong>{room.config.mode.toUpperCase()}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: 700 }}>
                    INVITE CODE:
                  </span>
                  <span className="ff-invite-code-value" data-testid="room-invite-code">
                    {room.inviteCode}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <button
                  type="button"
                  className="ff-btn ff-btn-ghost"
                  onClick={() => copyText(room.inviteCode, "Invite Code")}
                  data-testid="copy-code-btn"
                >
                  COPY CODE
                </button>
                <button
                  type="button"
                  className="ff-btn ff-btn-accent"
                  onClick={() => copyText(inviteUrl, "Invite Link")}
                  data-testid="copy-link-btn"
                >
                  COPY INVITE LINK
                </button>
                <button
                  type="button"
                  className="ff-btn ff-btn-danger"
                  onClick={() => emitRoomAction("room:leave")}
                  data-testid="leave-room-btn"
                >
                  LEAVE ROOM
                </button>
              </div>
            </section>

            {/* Countdown Banner */}
            {room.status === "COUNTDOWN" && (
              <section className="ff-countdown-banner" data-testid="countdown-banner">
                <div>
                  <strong style={{ fontSize: "16px", letterSpacing: "0.06em" }}>
                    MATCH DEPLOYING IN {countdownSec ?? room.countdownRemaining}s
                  </strong>
                  <div style={{ fontSize: "12px", color: "#ffedd5" }}>
                    Locking {room.slots.realPlayers} real player(s) and {room.slots.bots} AI bot(s)
                    into the Bermuda Flight manifest...
                  </div>
                </div>
                {isHost && (
                  <button
                    type="button"
                    className="ff-btn ff-btn-danger"
                    onClick={() => emitRoomAction("room:cancel-countdown")}
                    data-testid="cancel-countdown-btn"
                  >
                    CANCEL COUNTDOWN
                  </button>
                )}
              </section>
            )}

            {/* 50-Slot Capacity Telemetry */}
            <section className="ff-slot-meter" data-testid="slot-telemetry">
              <div className="ff-slot-stats">
                <div className="ff-stat-box">
                  <div className="ff-stat-label">REAL HUMANS</div>
                  <div className="ff-stat-val" style={{ color: "#fbbf24" }} data-testid="count-humans">
                    {room.slots.realPlayers}
                  </div>
                </div>
                <div className="ff-stat-box">
                  <div className="ff-stat-label">AI BOT SLOTS (BOTS)</div>
                  <div className="ff-stat-val" style={{ color: "#38bdf8" }} data-testid="count-bots">
                    {room.slots.bots}
                  </div>
                </div>
                <div className="ff-stat-box">
                  <div className="ff-stat-label">OPEN SLOTS</div>
                  <div className="ff-stat-val" style={{ color: "#94a3b8" }} data-testid="count-available">
                    {room.slots.availableSlots}
                  </div>
                </div>
                <div className="ff-stat-box">
                  <div className="ff-stat-label">MATCH CAPACITY</div>
                  <div className="ff-stat-val" data-testid="count-capacity">
                    {room.slots.totalOccupied} / {room.slots.configuredMax}
                  </div>
                </div>
              </div>

              <div className="ff-progress-track" aria-label="50-slot allocation">
                <div
                  className="ff-progress-humans"
                  style={{
                    width: `${(room.slots.realPlayers / room.slots.configuredMax) * 100}%`,
                  }}
                />
                <div
                  className="ff-progress-bots"
                  style={{
                    width: `${(room.slots.bots / room.slots.configuredMax) * 100}%`,
                  }}
                />
              </div>
            </section>

            {/* Main Lobby Split: Roster Left, Host Config Right */}
            <div className="ff-lobby-grid-room">
              <section className="ff-card">
                <div className="ff-card-header">
                  <h2 className="ff-card-title">
                    Human Players ({room.slots.realPlayers})
                  </h2>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    YOU ARE {isHost ? "ROOM HOST" : "SQUAD MEMBER"}
                  </span>
                </div>

                <div className="ff-roster-list" data-testid="player-roster">
                  {room.players.map((player) => {
                    const isMe = player.playerId === session.playerId;
                    return (
                      <div
                        key={player.playerId}
                        className={`ff-player-row ${isMe ? "me" : ""}`}
                        data-testid={`roster-row-${player.playerId}`}
                      >
                        <div className="ff-player-main">
                          <span className="ff-slot-num">
                            #{String(player.slotIndex + 1).padStart(2, "0")}
                          </span>
                          {room.config.mode !== "solo" && (
                            <span className="ff-badge team">T{player.teamId}</span>
                          )}
                          <strong style={{ fontSize: "13px" }}>
                            {player.name}
                            {isMe ? " (YOU)" : ""}
                          </strong>
                          {player.isHost && <span className="ff-badge host">HOST</span>}
                          {!player.connected && (
                            <span className="ff-badge disconnected">RECONNECTING</span>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span
                            className={`ff-badge ${
                              player.ready ? "ready" : "not-ready"
                            }`}
                          >
                            {player.ready ? "READY" : "NOT READY"}
                          </span>

                          {isHost && !isMe && (
                            <>
                              <button
                                type="button"
                                className="ff-btn ff-btn-sm ff-btn-ghost"
                                onClick={() =>
                                  emitRoomAction("room:transfer-host", {
                                    targetPlayerId: player.playerId,
                                  })
                                }
                                title="Transfer Host Role"
                              >
                                HOST
                              </button>
                              <button
                                type="button"
                                className="ff-btn ff-btn-sm ff-btn-danger"
                                onClick={() =>
                                  emitRoomAction("room:kick", {
                                    targetPlayerId: player.playerId,
                                  })
                                }
                                title="Kick Player"
                              >
                                KICK
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Separated AI Bot Fill Panel (Never marked as human) */}
                <div className="ff-card-header" style={{ marginTop: "4px" }}>
                  <h3 className="ff-card-title" style={{ color: "#38bdf8" }}>
                    AI Bot Slots ({room.botSummary.count})
                  </h3>
                  <span className="ff-badge bot">AI BOTS · NON-HUMAN</span>
                </div>

                {room.botSummary.count === 0 ? (
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    AI bots disabled or 0 bot slots configured. Empty slots remain open for real
                    friends.
                  </div>
                ) : (
                  <div className="ff-bot-chips" data-testid="bot-slots-preview">
                    {Array.from({ length: botSampleCount }, (_, i) => (
                      <span key={i} className="ff-bot-chip">
                        [BOT] AI-{String(i + 1).padStart(2, "0")} ·{" "}
                        {room.botSummary.difficulty.toUpperCase()}
                      </span>
                    ))}
                    {room.botSummary.count > botSampleCount && (
                      <span className="ff-bot-chip">
                        +{room.botSummary.count - botSampleCount} MORE AI BOTS ON DROP
                      </span>
                    )}
                  </div>
                )}
              </section>

              {/* Host Match Settings */}
              <section className="ff-card">
                <div className="ff-card-header">
                  <h2 className="ff-card-title">Room Configuration</h2>
                  <span className={`ff-badge ${isHost ? "host" : "not-ready"}`}>
                    {isHost ? "HOST CONTROLS" : "VIEW ONLY"}
                  </span>
                </div>

                <div className="ff-field-grid">
                  <div className="ff-field">
                    <label htmlFor="room-cfg-max">Max Players (2 - 50)</label>
                    <input
                      id="room-cfg-max"
                      data-testid="cfg-max-players"
                      type="number"
                      min={2}
                      max={50}
                      disabled={!isHost || room.status !== "LOBBY"}
                      className="ff-input"
                      value={room.config.maxPlayers}
                      onChange={(e) =>
                        handleConfigPatch({
                          maxPlayers: Math.max(
                            2,
                            Math.min(50, Number(e.target.value) || 50),
                          ),
                        })
                      }
                    />
                  </div>

                  <div className="ff-field">
                    <label htmlFor="room-cfg-map">Battle Map</label>
                    <select
                      id="room-cfg-map"
                      data-testid="cfg-map"
                      disabled={!isHost || room.status !== "LOBBY"}
                      className="ff-select"
                      value={room.config.mapId}
                      onChange={(e) => handleConfigPatch({ mapId: e.target.value })}
                    >
                      {Object.entries(MAP_PRESETS).map(([key, item]) => (
                        <option key={key} value={key}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ff-field">
                    <label htmlFor="room-cfg-mode">Match Mode</label>
                    <select
                      id="room-cfg-mode"
                      data-testid="cfg-mode"
                      disabled={!isHost || room.status !== "LOBBY"}
                      className="ff-select"
                      value={room.config.mode}
                      onChange={(e) => handleConfigPatch({ mode: e.target.value })}
                    >
                      <option value="solo">SOLO</option>
                      <option value="duo">DUO</option>
                      <option value="squad">SQUAD</option>
                    </select>
                  </div>

                  <div className="ff-field">
                    <label htmlFor="room-cfg-countdown">Start Countdown (sec)</label>
                    <select
                      id="room-cfg-countdown"
                      data-testid="cfg-countdown"
                      disabled={!isHost || room.status !== "LOBBY"}
                      className="ff-select"
                      value={room.config.countdownSec}
                      onChange={(e) =>
                        handleConfigPatch({ countdownSec: Number(e.target.value) })
                      }
                    >
                      <option value={3}>3 Seconds</option>
                      <option value={5}>5 Seconds</option>
                      <option value={10}>10 Seconds</option>
                      <option value={15}>15 Seconds</option>
                    </select>
                  </div>
                </div>

                <div className="ff-field-grid">
                  <label className="ff-toggle-row">
                    <span>AI Bots Enabled</span>
                    <input
                      data-testid="cfg-bots-enabled"
                      type="checkbox"
                      disabled={!isHost || room.status !== "LOBBY"}
                      checked={room.config.botsEnabled}
                      onChange={(e) =>
                        handleConfigPatch({ botsEnabled: e.target.checked })
                      }
                    />
                  </label>

                  <label className="ff-toggle-row">
                    <span>Auto-Fill Slots w/ Bots</span>
                    <input
                      data-testid="cfg-auto-bots"
                      type="checkbox"
                      disabled={
                        !isHost || !room.config.botsEnabled || room.status !== "LOBBY"
                      }
                      checked={room.config.autoFillBots}
                      onChange={(e) =>
                        handleConfigPatch({ autoFillBots: e.target.checked })
                      }
                    />
                  </label>
                </div>

                <div className="ff-field-grid">
                  <div className="ff-field">
                    <label htmlFor="room-cfg-botcount">Manual Bot Count</label>
                    <input
                      id="room-cfg-botcount"
                      data-testid="cfg-bot-count"
                      type="number"
                      min={0}
                      max={Math.max(0, room.config.maxPlayers - 1)}
                      disabled={
                        !isHost ||
                        !room.config.botsEnabled ||
                        room.config.autoFillBots ||
                        room.status !== "LOBBY"
                      }
                      className="ff-input"
                      value={
                        room.config.autoFillBots
                          ? room.slots.bots
                          : room.config.botCount
                      }
                      onChange={(e) =>
                        handleConfigPatch({
                          botCount: Math.max(
                            0,
                            Math.min(
                              room.config.maxPlayers - 1,
                              Number(e.target.value) || 0,
                            ),
                          ),
                        })
                      }
                    />
                  </div>

                  <div className="ff-field">
                    <label htmlFor="room-cfg-botdiff">Bot Difficulty</label>
                    <select
                      id="room-cfg-botdiff"
                      data-testid="cfg-bot-difficulty"
                      disabled={
                        !isHost || !room.config.botsEnabled || room.status !== "LOBBY"
                      }
                      className="ff-select"
                      value={room.config.botDifficulty}
                      onChange={(e) =>
                        handleConfigPatch({ botDifficulty: e.target.value })
                      }
                    >
                      <option value="easy">Easy</option>
                      <option value="normal">Normal</option>
                      <option value="hard">Hard</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>

            {/* Action Dock */}
            <footer className="ff-lobby-footer">
              <div style={{ fontSize: "12px", color: "#cbd5e1" }}>
                {isHost
                  ? unreadyGuestCount > 0
                    ? `${unreadyGuestCount} player(s) not ready yet — wait for Ready or use Force Start.`
                    : `All connected humans ready! Ready to launch ${room.slots.totalOccupied}-slot match.`
                  : myPlayer?.ready
                    ? "You are READY — waiting for Host to start the match."
                    : "Click READY UP to signal the Room Host."}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {!isHost && (
                  <button
                    type="button"
                    className={`ff-btn ${
                      myPlayer?.ready ? "ff-btn-ghost" : "ff-btn-ready"
                    }`}
                    disabled={room.status !== "LOBBY"}
                    onClick={() =>
                      emitRoomAction("room:ready", { ready: !myPlayer?.ready })
                    }
                    data-testid="ready-toggle-btn"
                  >
                    {myPlayer?.ready ? "CANCEL READY" : "READY UP"}
                  </button>
                )}

                {isHost && (
                  <>
                    {unreadyGuestCount > 0 && room.status === "LOBBY" && (
                      <button
                        type="button"
                        className="ff-btn ff-btn-ghost"
                        onClick={() => emitRoomAction("room:start", { force: true })}
                        data-testid="force-start-btn"
                      >
                        FORCE START
                      </button>
                    )}
                    <button
                      type="button"
                      className="ff-btn ff-btn-accent"
                      disabled={room.status !== "LOBBY" || unreadyGuestCount > 0}
                      onClick={() => emitRoomAction("room:start", { force: false })}
                      data-testid="start-match-btn"
                    >
                      START MATCH ({room.slots.totalOccupied} SLOTS)
                    </button>
                  </>
                )}
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
