import { useCallback, MouseEventHandler, TouchEventHandler } from "react";

import { Size } from "./utils";

interface EventHandlers<E extends HTMLElement> {
  onMouseDown: MouseEventHandler<E>;
  onTouchStart: TouchEventHandler<E>;
}

export interface CursorPosition {
  x: number;
  y: number;
}

export function useSaturationBrightnessEventHandler<E extends HTMLElement>(
  el: E,
  elSize: Size,
  onUpdate: (saturation: number, brightness: number) => void
): EventHandlers<E> {
  const handleCursorPositionUpdate = useCallback(
    ({ x, y }: CursorPosition) => {
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const cursorPosition = { x: x - rect.left, y: y - rect.top };
      const saturation = elSize
        ? Math.max(0, Math.min(1, cursorPosition.x / elSize.width))
        : 0;
      const brightness = elSize
        ? Math.max(0, Math.min(1, 1 - cursorPosition.y / elSize.height))
        : 1;
      onUpdate(saturation, brightness);
    },
    [el, elSize, onUpdate]
  );

  const handleMouseMove = useCallback(
    (ev: MouseEvent | React.MouseEvent) => {
      const { buttons } = ev;
      if (buttons !== 1) {
        return;
      }
      handleCursorPositionUpdate({ x: ev.clientX, y: ev.clientY });
    },
    [handleCursorPositionUpdate]
  );

  const handleMouseDown = useCallback(
    (ev: MouseEvent | React.MouseEvent) => {
      handleMouseMove(ev);
      const handleMouseUp = (ev: MouseEvent) => {
        handleMouseMove(ev);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove]
  );

  const handleTouchMove = useCallback(
    (ev: TouchEvent | React.TouchEvent) => {
      const { targetTouches } = ev;
      if (targetTouches.length <= 0) {
        return;
      }
      ev.preventDefault();
      handleCursorPositionUpdate({
        x: targetTouches[0].clientX,
        y: targetTouches[0].clientY,
      });
    },
    [handleCursorPositionUpdate]
  );

  const handleTouchStart = useCallback(
    (ev: TouchEvent | React.TouchEvent) => {
      handleTouchMove(ev);
      const handleTouchEnd = (ev: TouchEvent) => {
        handleTouchMove(ev);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    },
    [handleTouchMove]
  );

  return {
    onMouseDown: handleMouseDown,
    onTouchStart: handleTouchStart,
  };
}
