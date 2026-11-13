import React, { useCallback, useRef, useState } from "react";

/**
 * Looks up a Touch object by its unique `identifier` in a TouchList or array.
 */
export function findTouchById(touchList, id) {
  if (!touchList || id === null || id === undefined) return null;
  for (let i = 0; i < touchList.length; i += 1) {
    if (touchList[i].identifier === id) return touchList[i];
  }
  return null;
}

/**
 * Reliable multi-touch & fast-tap button for mobile controllers.
 * Avoids dropped synthetic `click` events inside touch-action/rotated stages.
 */
export default function TapButton({
  className = "",
  activeClassName = "active",
  onTrigger,
  onClick,
  disabled = false,
  tapRadiusPx = 56,
  children,
  ...rest
}) {
  const [touchPressed, setTouchPressed] = useState(false);
  const startTouchRef = useRef(null);
  const lastTouchTriggerTsRef = useRef(0);

  const handler = onTrigger || onClick;

  const handleTouchStart = useCallback(
    (e) => {
      e.stopPropagation();
      if (disabled) return;
      if (startTouchRef.current !== null) return;
      const t = e.changedTouches?.[0];
      if (!t) return;
      startTouchRef.current = {
        id: t.identifier,
        x: t.clientX,
        y: t.clientY,
      };
      setTouchPressed(true);
    },
    [disabled],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      e.stopPropagation();
      const start = startTouchRef.current;
      if (!start) return;
      const t = findTouchById(e.changedTouches, start.id);
      if (!t) return;

      startTouchRef.current = null;
      setTouchPressed(false);
      if (disabled) return;

      const dist = Math.hypot(t.clientX - start.x, t.clientY - start.y);
      if (dist <= tapRadiusPx) {
        if (e.cancelable) e.preventDefault();
        lastTouchTriggerTsRef.current = Date.now();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(10);
        }
        handler?.(e);
      }
    },
    [disabled, tapRadiusPx, handler],
  );

  const handleTouchCancel = useCallback((e) => {
    e.stopPropagation();
    const start = startTouchRef.current;
    if (!start) return;
    if (
      findTouchById(e.changedTouches, start.id) ||
      !findTouchById(e.touches, start.id)
    ) {
      startTouchRef.current = null;
      setTouchPressed(false);
    }
  }, []);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (disabled) return;
      if (Date.now() - lastTouchTriggerTsRef.current < 450) {
        return;
      }
      handler?.(e);
    },
    [disabled, handler],
  );

  const mergedClassName = touchPressed
    ? `${className} ${activeClassName}`.trim()
    : className;

  return (
    <button
      type="button"
      className={mergedClassName}
      disabled={disabled}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      {...rest}
    >
      {children}
    </button>
  );
}

