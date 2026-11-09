import React, { useCallback, useState } from "react";

export default function HoldButton({
  className,
  activeClassName,
  onChange,
  children,
}) {
  const [pressed, setPressed] = useState(false);

  const activate = useCallback(
    (e) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      setPressed((prev) => {
        if (!prev) {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(12);
          }
          onChange(true);
        }
        return true;
      });
    },
    [onChange],
  );

  const deactivate = useCallback(
    (e) => {
      if (e && e.cancelable) e.preventDefault();
      setPressed((prev) => {
        if (prev) onChange(false);
        return false;
      });
    },
    [onChange],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${className} ${pressed ? activeClassName : ""}`}
      onTouchStart={activate}
      onTouchEnd={deactivate}
      onTouchCancel={deactivate}
      onMouseDown={activate}
      onMouseUp={deactivate}
      onMouseLeave={deactivate}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
