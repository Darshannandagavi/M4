import React, { useCallback, useRef } from "react";
import "./FreeFireHUD.css";

export default function CustomHudElement({
  id,
  editMode = false,
  selected = false,
  cfg = { x: 50, y: 50, size: 100, opacity: 100 },
  onSelect,
  onMove,
  children,
  className = "",
  style = {},
}) {
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, startElemX: 0, startElemY: 0 });

  const handlePointerDown = useCallback(
    (e) => {
      if (!editMode) return;
      e.stopPropagation();
      e.preventDefault();

      onSelect?.(id);
      isDraggingRef.current = true;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      dragStartRef.current = {
        x: clientX,
        y: clientY,
        startElemX: cfg.x,
        startElemY: cfg.y,
      };

      const handleMove = (moveEvt) => {
        if (!isDraggingRef.current) return;
        moveEvt.preventDefault();
        const curX = moveEvt.touches ? moveEvt.touches[0].clientX : moveEvt.clientX;
        const curY = moveEvt.touches ? moveEvt.touches[0].clientY : moveEvt.clientY;

        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;

        const deltaXPercent = ((curX - dragStartRef.current.x) / w) * 100;
        const deltaYPercent = ((curY - dragStartRef.current.y) / h) * 100;

        const clampedX = Math.max(3, Math.min(97, Math.round((dragStartRef.current.startElemX + deltaXPercent) * 10) / 10));
        const clampedY = Math.max(3, Math.min(97, Math.round((dragStartRef.current.startElemY + deltaYPercent) * 10) / 10));

        onMove?.(id, { x: clampedX, y: clampedY });
      };

      const handleUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleUp);
        window.removeEventListener("touchcancel", handleUp);
      };

      window.addEventListener("pointermove", handleMove, { passive: false });
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
      window.addEventListener("touchcancel", handleUp);
    },
    [editMode, id, cfg.x, cfg.y, onSelect, onMove],
  );

  const scale = (cfg?.size || 100) / 100;
  const opacity = (cfg?.opacity || 100) / 100;

  const rootStyle = {
    position: "absolute",
    left: `${cfg.x}%`,
    top: `${cfg.y}%`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    pointerEvents: "auto",
    touchAction: editMode ? "none" : undefined,
    userSelect: "none",
    ...style,
  };

  return (
    <div
      className={`ffh-custom-elem-wrapper ${editMode ? "in-edit-mode" : ""} ${
        selected ? "is-selected" : ""
      } ${className}`}
      style={rootStyle}
      onPointerDown={editMode ? handlePointerDown : undefined}
      onTouchStart={editMode ? handlePointerDown : undefined}
      onMouseDown={editMode ? handlePointerDown : undefined}
      data-hudelem-id={id}
    >
      {/* Free Fire Yellow Glowing Selection Ring */}
      {editMode && selected && (
        <div className="ffh-hud-selection-ring" aria-hidden="true" />
      )}

      {/* Edit Mode Tap Target Overlay (stops underlying button firing in edit mode) */}
      {editMode && <div className="ffh-hud-edit-hitbox" />}

      {children}
    </div>
  );
}

