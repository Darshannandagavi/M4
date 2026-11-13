import React, { useCallback, useEffect, useRef, useState } from "react";
import { findTouchById } from "./TapButton";

export default function HoldButton({
  className = "",
  activeClassName = "",
  onChange,
  children,
}) {
  const [pressed, setPressed] = useState(false);
  const pressedRef = useRef(false);
  const activeTouchIdRef = useRef(null);
  const mouseActiveRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setHoldActive = useCallback((next) => {
    if (pressedRef.current === next) return;
    pressedRef.current = next;
    setPressed(next);
    if (next && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(12);
    }
    onChangeRef.current?.(next);
  }, []);

  useEffect(() => {
    const release = () => {
      if (activeTouchIdRef.current !== null || mouseActiveRef.current) {
        activeTouchIdRef.current = null;
        mouseActiveRef.current = false;
        setHoldActive(false);
      }
    };
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("blur", release);
      release();
    };
  }, [setHoldActive]);

  const handleTouchStart = useCallback(
    (e) => {
      e.stopPropagation();
      if (activeTouchIdRef.current !== null) return;
      const t = e.changedTouches?.[0];
      if (t) {
        activeTouchIdRef.current = t.identifier;
      }
      setHoldActive(true);
    },
    [setHoldActive],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      e.stopPropagation();
      const id = activeTouchIdRef.current;
      if (id === null) return;
      const ended = findTouchById(e.changedTouches, id);
      const stillDown = findTouchById(e.touches, id);
      if (!ended && stillDown) return;
      if (e.cancelable) e.preventDefault();
      activeTouchIdRef.current = null;
      if (!mouseActiveRef.current) {
        setHoldActive(false);
      }
    },
    [setHoldActive],
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (activeTouchIdRef.current !== null) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      mouseActiveRef.current = true;
      setHoldActive(true);
    },
    [setHoldActive],
  );

  const handleMouseUp = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (!mouseActiveRef.current) return;
      mouseActiveRef.current = false;
      if (activeTouchIdRef.current === null) {
        setHoldActive(false);
      }
    },
    [setHoldActive],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      style={{ touchAction: "none" }}
      className={`${className} ${pressed ? activeClassName : ""}`.trim()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
