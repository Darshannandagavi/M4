import React from "react";

export default function SportSpeedometer({ telemetry }) {
  const speed = Math.max(
    0,
    Math.min(320, Math.round(Math.abs(telemetry.speed || 0))),
  );
  const gear = telemetry.gear || "N";
  const rpmRatio = Math.max(0, Math.min(1, (telemetry.rpm || 850) / 7500));
  const needleAngle = -135 + (speed / 320) * 270;

  return (
    <section className="sport-speedometer" aria-label="Vehicle speedometer">
      <svg className="sport-speedometer-dial" viewBox="0 0 240 190" role="img">
        <defs>
          <linearGradient id="speedArc" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8edf2" stopOpacity=".42" />
            <stop offset="72%" stopColor="#e8edf2" stopOpacity=".82" />
            <stop offset="100%" stopColor="#ff315b" />
          </linearGradient>
          <filter id="needleGlow">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 33 }, (_, i) => {
          const angle = ((-135 + (i / 32) * 270) * Math.PI) / 180;
          const major = i % 4 === 0;
          const inner = major ? 75 : 81;
          const outer = 88;
          return (
            <line
              key={i}
              x1={120 + Math.cos(angle) * inner}
              y1={111 + Math.sin(angle) * inner}
              x2={120 + Math.cos(angle) * outer}
              y2={111 + Math.sin(angle) * outer}
              stroke={i > 27 ? "#ff315b" : "rgba(235,242,250,.65)"}
              strokeWidth={major ? 1.5 : 0.8}
            />
          );
        })}

        {Array.from({ length: 9 }, (_, i) => {
          const angle = ((-135 + (i / 8) * 270) * Math.PI) / 180;
          return (
            <text
              key={i}
              x={120 + Math.cos(angle) * 65}
              y={114 + Math.sin(angle) * 65}
              textAnchor="middle"
              className="speedometer-tick-label"
            >
              {i * 40}
            </text>
          );
        })}

        <g
          transform={`rotate(${needleAngle} 120 111)`}
          filter="url(#needleGlow)"
        >
          <path
            d="M120 111 L120 31"
            stroke="#f6f8fb"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <circle cx="120" cy="111" r="3.6" fill="#f6f8fb" />
        </g>

        <circle
          cx="120"
          cy="111"
          r="12.5"
          fill="#0b1d17"
          stroke="#38d889"
          strokeWidth="1.5"
        />
        <text x="120" y="116" textAnchor="middle" className="speedometer-gear">
          {gear}
        </text>
        <text
          x="120"
          y="165"
          textAnchor="middle"
          className="speedometer-number"
        >
          {speed}
        </text>
        <text x="120" y="179" textAnchor="middle" className="speedometer-unit">
          KM/H
        </text>
        <path
          d="M 166 35 A 90 90 0 0 1 208 105"
          fill="none"
          stroke="#ff315b"
          strokeWidth={2 + rpmRatio * 1.8}
          opacity={rpmRatio > 0.82 ? 1 : 0.45}
        />
      </svg>
      <div className="speedometer-rpm">
        <span>RPM</span>
        <span>{Math.round(telemetry.rpm || 850).toLocaleString("en-IN")}</span>
      </div>
    </section>
  );
}
