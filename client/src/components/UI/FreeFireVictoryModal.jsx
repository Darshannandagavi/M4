import React from "react";

export default function FreeFireVictoryModal({
  status = "IN_PROGRESS", // "DROPPING" | "IN_PROGRESS" | "VICTORY" | "DEFEAT"
  kills = 0,
  damageDealt = 0,
  survivalSeconds = 0,
  headshots = 0,
  shotsFired = 0,
  rank = 1,
  totalPlayers = 7,
  onPlayAgain,
  onDismiss,
  onReturnToLobby,
}) {
  if (status !== "VICTORY" && status !== "DEFEAT") return null;

  const isVictory = status === "VICTORY";

  // Format survival time MM:SS
  const mins = Math.floor(survivalSeconds / 60);
  const secs = Math.floor(survivalSeconds % 60);
  const timeFormatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  // Accuracy calculation
  const accuracy =
    shotsFired > 0
      ? Math.min(100, Math.round(((kills * 3 + headshots * 2) / Math.max(1, shotsFired)) * 100))
      : 0;

  return (
    <div className={`ff-modal-overlay ${isVictory ? "victory-theme" : "defeat-theme"}`}>
      <div className="ff-modal-backdrop" />

      <div className="ff-result-card animate-pop-in">
        {/* Top Flame Wings / Emblem */}
        <div className="ff-result-emblem-wrap">
          <div className="ff-emblem-halo" />
          {isVictory ? (
            <div className="ff-booyah-badge">
              <div className="ff-booyah-flames">🔥 🏆 🔥</div>
              <h1 className="ff-booyah-title">BOOYAH!</h1>
              <div className="ff-booyah-sub">VICTORY ROYALE</div>
            </div>
          ) : (
            <div className="ff-defeat-badge">
              <div className="ff-defeat-skull">☠️</div>
              <h1 className="ff-defeat-title">ELIMINATED</h1>
              <div className="ff-defeat-sub">BETTER LUCK NEXT TIME</div>
            </div>
          )}
        </div>

        {/* Rank Placement Pill */}
        <div className="ff-rank-pill">
          <span className="rank-label">FINAL PLACEMENT</span>
          <span className={`rank-value ${isVictory ? "first" : ""}`}>
            #{isVictory ? 1 : rank} <small>/ {totalPlayers}</small>
          </span>
        </div>

        {/* Match Statistics Grid */}
        <div className="ff-stats-grid">
          <div className="ff-stat-box">
            <span className="stat-icon">💀</span>
            <div className="stat-info">
              <span className="stat-title">KILLS</span>
              <span className="stat-val">{kills}</span>
            </div>
          </div>

          <div className="ff-stat-box">
            <span className="stat-icon">🎯</span>
            <div className="stat-info">
              <span className="stat-title">DAMAGE</span>
              <span className="stat-val">{damageDealt}</span>
            </div>
          </div>

          <div className="ff-stat-box">
            <span className="stat-icon">⏱️</span>
            <div className="stat-info">
              <span className="stat-title">SURVIVED</span>
              <span className="stat-val">{timeFormatted}</span>
            </div>
          </div>

          <div className="ff-stat-box">
            <span className="stat-icon">💥</span>
            <div className="stat-info">
              <span className="stat-title">HEADSHOTS</span>
              <span className="stat-val">{headshots}</span>
            </div>
          </div>

          <div className="ff-stat-box">
            <span className="stat-icon">⚡</span>
            <div className="stat-info">
              <span className="stat-title">ACCURACY</span>
              <span className="stat-val">{accuracy}%</span>
            </div>
          </div>
        </div>

        {/* Free Fire Action Buttons */}
        <div className="ff-modal-actions">
          <button
            type="button"
            className="ff-btn-primary booyah-btn"
            onClick={onPlayAgain}
          >
            <span className="btn-icon">🏆</span>
            <span>PLAY AGAIN</span>
          </button>

          {isVictory && onDismiss && (
            <button
              type="button"
              className="ff-btn-secondary"
              onClick={onDismiss}
            >
              <span>FREE ROAM / DRIVE</span>
            </button>
          )}

          {onReturnToLobby && (
            <button
              type="button"
              className="ff-btn-secondary"
              onClick={onReturnToLobby}
              data-testid="victory-return-lobby-btn"
            >
              <span>RETURN TO LOBBY</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

