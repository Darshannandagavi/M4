import React from "react";
import { MAX_WHEEL_ROTATION_DEG } from "../../config/gameConstants";

export default function SteeringWheelGraphic({ steerValue, activeGrab }) {
  const deg = Math.round(-steerValue * MAX_WHEEL_ROTATION_DEG);
  return (
    <svg
      className={activeGrab ? "mc-wheel-svg grabbing" : "mc-wheel-svg"}
      viewBox="0 0 160 160"
      style={{ transform: `rotate(${deg}deg)` }}
    >
      <defs>
        <linearGradient id="mRimGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#35455d" />
          <stop offset="50%" stopColor="#18202c" />
          <stop offset="100%" stopColor="#0d1219" />
        </linearGradient>
        <linearGradient id="mSpokeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fb4d0" />
          <stop offset="100%" stopColor="#405066" />
        </linearGradient>
      </defs>

      <circle
        cx="80"
        cy="80"
        r="66"
        fill="none"
        stroke="url(#mRimGrad)"
        strokeWidth="16"
      />
      <circle
        cx="80"
        cy="80"
        r="66"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />
      <path
        d="M 20 55 A 66 66 0 0 1 28 38"
        fill="none"
        stroke="#2d79ff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 140 55 A 66 66 0 0 0 132 38"
        fill="none"
        stroke="#2d79ff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 22 78 L 58 78 M 102 78 L 138 78 M 80 98 L 80 138"
        stroke="url(#mSpokeGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M 74 14 L 86 14"
        stroke="#ff2a5f"
        strokeWidth="16"
        strokeLinecap="butt"
      />
      <circle
        cx="80"
        cy="14"
        r="5"
        fill="#ffffff"
        opacity={activeGrab ? "0.95" : "0.4"}
      />
      <circle
        cx="80"
        cy="80"
        r="24"
        fill="#0b1018"
        stroke="#2d79ff"
        strokeWidth="3"
      />
      <text
        x="80"
        y="86"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="16"
        fontWeight="800"
        fontStyle="italic"
        fontFamily="Barlow Condensed, sans-serif"
      >
        M
      </text>
    </svg>
  );
}
