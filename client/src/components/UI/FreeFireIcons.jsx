import React from "react";

/* -------------------------------------------------------------------------- */
/*  Shared Military White Silhouette SVGs (Desktop + Mobile Free Fire HUD)    */
/* -------------------------------------------------------------------------- */

export function WeaponSilhouetteSvg({ weaponId, className = "" }) {
  switch (weaponId) {
    case "awm":
      return (
        <svg viewBox="0 0 120 40" className={className} fill="currentColor">
          <path d="M5 18h18v11H12l-7-4v-7zm18 1h48v-2h44v4H71v2H54l-2 9h-8l-1-9H23v-4zm23-9h22v4H46v-4zm-6 4h34v2H40v-2zM75 23l-3 10h-3l3-10h3z" />
        </svg>
      );
    case "mp40":
      return (
        <svg viewBox="0 0 100 40" className={className} fill="currentColor">
          <path d="M8 17h15v4H8v-4zm15-2h42v6h24v3H65v2H54v11h-7V25H34l-3 10h-7l2-11H23v-9z" />
        </svg>
      );
    case "deagle":
      return (
        <svg viewBox="0 0 70 40" className={className} fill="currentColor">
          <path d="M12 10h42v9H33l-4 15H17l4-15h-9v-9zm19 9h7v4h-7v-4z" />
        </svg>
      );
    case "fist":
      return (
        <svg viewBox="0 0 64 40" className={className} fill="currentColor">
          <path d="M20 12c0-2 2-4 4-4s4 2 4 4v5h2v-6c0-2 2-4 4-4s4 2 4 4v6h2v-4c0-2 2-3 4-3s4 1 4 3v12c0 6-5 10-12 10h-6c-6 0-10-4-10-10V12z" />
        </svg>
      );
    case "ak47":
    case "m4a1":
    default:
      return (
        <svg viewBox="0 0 116 40" className={className} fill="currentColor">
          <path d="M4 17l18-2v12L4 23v-6zm18-3h44l3 2h40v3H69v3H58c0 5-3 11-8 14l-6-2c4-3 6-7 6-12H36l-3 9h-7l2-9h-6V14zm26-5h14v3H48V9z" />
        </svg>
      );
  }
}

export function ScopeSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
    </svg>
  );
}

export function FireBulletSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 20V9c0-2.8 2.2-5 5-5s5 2.2 5 5v11H7zm2-11v9h6V9c0-1.7-1.3-3-3-3s-3 1.3-3 3zM5 21h14v1.5H5V21z" />
    </svg>
  );
}

export function JumpSoldierSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="14" cy="4.5" r="2.2" />
      <path d="M13 8l4 3.5-2 1.8-2.4-2L11 14l3.5 3-1 5h-2.2l.7-3.8L8.5 15 6 19.5l-1.9-1 3.4-6.2L10 9.5 7 9V7l6 1z" />
    </svg>
  );
}

export function CrouchSoldierSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="13" cy="5.5" r="2.2" />
      <path d="M11.5 9l4.5 2v2l-3-.8-1 3.3 4 1.5v4.5h-2.3v-3l-4.2-1.4-2.8 4.4H4.4l3.4-6.2 1.7-6.3h2z" />
    </svg>
  );
}

export function MedkitSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 4h6v2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4zm2 2h2V5h-2v1zm0 4v2H9v2h2v2h2v-2h2v-2h-2v-2h-2z" />
    </svg>
  );
}

export function BackpackSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 3h6a2 2 0 0 1 2 2v1.2A4.5 4.5 0 0 1 20 10.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8.5A4.5 4.5 0 0 1 7 6.2V5a2 2 0 0 1 2-2zm0 2v1h6V5H9zm-2 8v5h10v-5H7zm3 1.5h4v2h-4v-2z" />
    </svg>
  );
}

export function CarDriveSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 11l1.8-4.8A2 2 0 0 1 8.7 5h6.6a2 2 0 0 1 1.9 1.2L19 11h1a1.5 1.5 0 0 1 1.5 1.5V17h-2v1.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V17H7.5v1.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V17H2.5v-4.5A1.5 1.5 0 0 1 4 11h1zm2.2-4L6 10.5h12L16.8 7H7.2zM6.5 15a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm11 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" />
    </svg>
  );
}

export function ReloadSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" strokeLinecap="round" />
      <path d="M21 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HelmetSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3a8 8 0 0 0-8 8v4l2 2h3v-3H7v-3a5 5 0 0 1 10 0v3h-2v3h3l2-2v-4a8 8 0 0 0-8-8z" />
    </svg>
  );
}

export function VestSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h3l3 3 3-3h3v4l2 2v10H4V10l2-2V4zm3 7v6h6v-6H9z" />
    </svg>
  );
}

export function SpeakerSvg({ muted }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 4V5L7 9H3z" />
      {muted ? (
        <path d="M16 9l5 6m0-6l-5 6" stroke="currentColor" strokeWidth="2" />
      ) : (
        <path
          d="M16.5 8.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function MicSvg({ muted }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2z" />
      {muted && <path d="M4 4l16 16" stroke="#ef4444" strokeWidth="2.2" />}
    </svg>
  );
}

export function SprintSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="15" cy="4.5" r="2" />
      <path d="M10.5 8.5l4.2 1.2 2.8 2.8-1.4 1.4-2.2-2.2-2.2-.5-1.5 3.6 3.5 3.2-.8 5h-2l.5-3.8-3-2.5L6.5 21H4.3l2.6-5.8L9 10.5 6.8 10 8 8.5h2.5z" />
    </svg>
  );
}

export function EyeSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    </svg>
  );
}

export function AliveUserSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
    </svg>
  );
}

export function KillsSkullSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a8.5 8.5 0 0 0-8.5 8.5c0 3 1.6 5.6 4 7V21h9v-3.5c2.4-1.4 4-4 4-7A8.5 8.5 0 0 0 12 2zm-3 10.5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9 12.5zm6 0a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" />
    </svg>
  );
}

export function EmoteWaveSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.2" />
      <circle cx="15" cy="10" r="1.2" />
      <path d="M8.5 14.2a4.2 4.2 0 0 0 7 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HudExitSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function HudResetSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 2.5-6.2L2 9" />
      <polyline points="2 3 2 9 8 9" />
    </svg>
  );
}

export function HudSaveSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export function PresetCubeSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 16.5l-9 5.25-9-5.25V7.5L12 2.25l9 5.25v9zM12 4.15L5.2 8.1 12 12.05l6.8-3.95L12 4.15zM4.5 9.7v5.85l6.5 3.8v-5.85L4.5 9.7zm15 0l-6.5 3.8v5.85l6.5-3.8V9.7z" />
    </svg>
  );
}

export function HudLayoutSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}


