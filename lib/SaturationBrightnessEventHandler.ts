import {
  MutableRefObject,
  PointerEventHandler,
  useCallback,
  useRef,
} from "react";

interface EventHandlers<E extends HTMLElement> {
  onPointerCancel: PointerEventHandler<E>;
  onPointerDown: PointerEventHandler<E>;
  onPointerMove: PointerEventHandler<E>;
  onPointerUp: PointerEventHandler<E>;
}

export interface CursorPosition {
  x: number;
  y: number;
}

export function calculateSaturationBrightness(
  position: CursorPosition,
  rect: Pick<DOMRect, "left" | "top" | "width" | "height">,
): CursorPosition {
  if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 1 };
  return {
    x: Math.max(0, Math.min(1, (position.x - rect.left) / rect.width)),
    y: Math.max(0, Math.min(1, 1 - (position.y - rect.top) / rect.height)),
  };
}

export function useSaturationBrightnessEventHandler<E extends HTMLElement>(
  ref: MutableRefObject<E>,
  onUpdate: (saturation: number, brightness: number) => void,
): EventHandlers<E> {
  const activePointer = useRef<number | null>(null);
  const handleCursorPositionUpdate = useCallback(
    ({ x, y }: CursorPosition) => {
      const el = ref.current;
      if (!el) {
        return;
      }
      const next = calculateSaturationBrightness(
        { x, y },
        el.getBoundingClientRect(),
      );
      onUpdate(next.x, next.y);
    },
    [onUpdate, ref],
  );

  const handlePointerDown: PointerEventHandler<E> = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      activePointer.current = event.pointerId;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      handleCursorPositionUpdate({ x: event.clientX, y: event.clientY });
    },
    [handleCursorPositionUpdate],
  );

  const handlePointerMove: PointerEventHandler<E> = useCallback(
    (event) => {
      if (activePointer.current !== event.pointerId) return;
      event.preventDefault();
      handleCursorPositionUpdate({ x: event.clientX, y: event.clientY });
    },
    [handleCursorPositionUpdate],
  );

  const handlePointerEnd: PointerEventHandler<E> = useCallback(
    (event) => {
      if (activePointer.current !== event.pointerId) return;
      handleCursorPositionUpdate({ x: event.clientX, y: event.clientY });
      activePointer.current = null;
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [handleCursorPositionUpdate],
  );

  const handlePointerCancel: PointerEventHandler<E> = useCallback((event) => {
    if (activePointer.current !== event.pointerId) return;
    activePointer.current = null;
  }, []);

  return {
    onPointerCancel: handlePointerCancel,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerEnd,
  };
}
