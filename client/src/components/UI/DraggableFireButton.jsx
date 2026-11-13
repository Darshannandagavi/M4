import React, { useCallback, useEffect, useRef, useState } from "react";
import { FireBulletSvg } from "./FreeFireIcons";

/**
 * Draggable Fire Button (Free Fire Drag Headshot mechanic)
 *
 * When touched / clicked:
 * - Immediately triggers onFireStart()
 * - Dragging finger/cursor moves the inner bullet nub with tactile visual feedback.
 * - Dragging UPWARD (deltaY < 0) engages the Free Fire Drag Headshot mechanic:
 *   lifts camera pitch upward and triggers headshot target acquisition.
 * - On release, smoothly springs back to center and triggers onFireEnd().
 */
export default function DraggableFireButton({
  className = "",
  isFiring = false,
  editMode = false,
  disabled = false,
  onFireStart,
  onFireEnd,
  onFireDrag,
  children,
}) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragUpActive, setDragUpActive] = useState(false);

  const startPosRef = useRef(null);
  const pointerIdRef = useRef(null);
  const isDraggingRef = useRef(false);

  const MAX_RADIUS = 28;

  const handlePointerDown = useCallback(
    (e) => {
      if (editMode || disabled) return;
      if (pointerIdRef.current !== null) return;
      e.stopPropagation();

      pointerIdRef.current = e.pointerId ?? (e.touches ? e.touches[0]?.identifier : 1);
      const clientX =
        (typeof e.clientX === "number" ? e.clientX : undefined) ??
        (typeof e.pageX === "number" ? e.pageX : undefined) ??
        e.touches?.[0]?.clientX ??
        0;
      const clientY =
        (typeof e.clientY === "number" ? e.clientY : undefined) ??
        (typeof e.pageY === "number" ? e.pageY : undefined) ??
        e.touches?.[0]?.clientY ??
        0;

      startPosRef.current = { x: clientX, y: clientY };
      isDraggingRef.current = true;
      setIsDragging(true);

      onFireStart?.();

      if (e.currentTarget?.setPointerCapture && e.pointerId) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
      }
    },
    [editMode, disabled, onFireStart],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDraggingRef.current || !startPosRef.current) return;
      e.stopPropagation();

      const clientX =
        (typeof e.clientX === "number" ? e.clientX : undefined) ??
        (typeof e.pageX === "number" ? e.pageX : undefined) ??
        e.touches?.[0]?.clientX ??
        0;
      const clientY =
        (typeof e.clientY === "number" ? e.clientY : undefined) ??
        (typeof e.pageY === "number" ? e.pageY : undefined) ??
        e.touches?.[0]?.clientY ??
        0;

      const rawDx = clientX - startPosRef.current.x;
      const rawDy = clientY - startPosRef.current.y;

      const dist = Math.hypot(rawDx, rawDy);
      const clampedDist = Math.min(MAX_RADIUS, dist);
      const angle = Math.atan2(rawDy, rawDx);

      const vx = Math.cos(angle) * clampedDist;
      const vy = Math.sin(angle) * clampedDist;

      setDragOffset({ x: vx, y: vy });

      // Upward drag in screen space means rawDy < 0 (negative Y)
      const isUp = rawDy < -6;
      setDragUpActive(isUp);

      const dragUpRatio = isUp ? Math.min(1, Math.abs(rawDy) / 50) : 0;

      onFireDrag?.({
        deltaX: rawDx,
        deltaY: rawDy,
        dragUpRatio,
        dragUpActive: isUp,
      });
    },
    [onFireDrag],
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (!isDraggingRef.current) return;
      e?.stopPropagation?.();

      isDraggingRef.current = false;
      startPosRef.current = null;
      pointerIdRef.current = null;

      setIsDragging(false);
      setDragUpActive(false);
      setDragOffset({ x: 0, y: 0 });

      onFireEnd?.();
      onFireDrag?.({
        deltaX: 0,
        deltaY: 0,
        dragUpRatio: 0,
        dragUpActive: false,
      });
    },
    [onFireEnd, onFireDrag],
  );

  useEffect(() => {
    const cancel = () => {
      if (isDraggingRef.current) {
        handlePointerUp();
      }
    };
    window.addEventListener("blur", cancel);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("blur", cancel);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [handlePointerUp]);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`ffh-btn-fire-draggable ${isFiring || isDragging ? "active" : ""} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      title="Fire Button (Drag UP for Headshot)"
    >
      {/* Upward Drag-Headshot Flare Indicator */}
      <div className={`ffh-drag-up-arrow ${dragUpActive ? "active" : ""}`}>
        <svg className="ffh-drag-arrow-svg" viewBox="0 0 24 24">
          <path d="M12 4l-7 7h4v9h6v-9h4z" />
        </svg>
        <span className="ffh-drag-label">DRAG</span>
      </div>

      {/* Floating draggable bullet nub */}
      <div
        className={`ffh-drag-nub ${!isDragging ? "spring-back" : ""}`}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
        }}
      >
        {children || <FireBulletSvg />}
      </div>
    </div>
  );
}
