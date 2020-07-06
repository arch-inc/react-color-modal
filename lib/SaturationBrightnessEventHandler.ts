import {
  useCallback,
  useState,
  useMemo,
  MouseEventHandler,
  TouchEventHandler,
} from "react";

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
  elSize: Size
): [number, number, EventHandlers<E>] {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
  });

  const updateCursorPosition = useCallback(
    ({ x, y }: CursorPosition) => {
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      setCursorPosition({
        x: x - rect.left,
        y: y - rect.top,
      });
    },
    [el]
  );

  const handleMouseMove = useCallback(
    (ev: MouseEvent | React.MouseEvent) => {
      const { buttons } = ev;
      if (buttons !== 1) {
        return;
      }
      updateCursorPosition({ x: ev.clientX, y: ev.clientY });
    },
    [updateCursorPosition]
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
      updateCursorPosition({
        x: targetTouches[0].clientX,
        y: targetTouches[0].clientY,
      });
    },
    [updateCursorPosition]
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

  const saturation = useMemo(
    () =>
      elSize ? Math.max(0, Math.min(1, cursorPosition.x / elSize.width)) : 0,
    [elSize, cursorPosition]
  );
  const brightness = useMemo(
    () =>
      elSize
        ? Math.max(0, Math.min(1, 1 - cursorPosition.y / elSize.height))
        : 1,
    [elSize, cursorPosition]
  );

  return [
    saturation,
    brightness,
    {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
  ];
}
