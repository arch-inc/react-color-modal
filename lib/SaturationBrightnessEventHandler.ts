import {
  MutableRefObject,
  PointerEventHandler,
  useCallback,
  useEffect,
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
  const dragRect = useRef<DOMRect | null>(null);
  const pendingPosition = useRef<CursorPosition | null>(null);
  const animationFrame = useRef<number | null>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const cancelScheduledUpdate = useCallback(() => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    pendingPosition.current = null;
  }, []);

  useEffect(() => cancelScheduledUpdate, [cancelScheduledUpdate]);

  const handleCursorPositionUpdate = useCallback(
    ({ x, y }: CursorPosition) => {
      const el = ref.current;
      if (!el) {
        return;
      }
      const next = calculateSaturationBrightness(
        { x, y },
        dragRect.current ?? el.getBoundingClientRect(),
      );
      onUpdateRef.current(next.x, next.y);
    },
    [ref],
  );

  const scheduleCursorPositionUpdate = useCallback(
    (position: CursorPosition) => {
      pendingPosition.current = position;
      if (animationFrame.current !== null) return;
      animationFrame.current = requestAnimationFrame(() => {
        animationFrame.current = null;
        const pending = pendingPosition.current;
        pendingPosition.current = null;
        if (pending) handleCursorPositionUpdate(pending);
      });
    },
    [handleCursorPositionUpdate],
  );

  const handlePointerDown: PointerEventHandler<E> = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      activePointer.current = event.pointerId;
      dragRect.current = event.currentTarget.getBoundingClientRect();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      handleCursorPositionUpdate({ x: event.clientX, y: event.clientY });
    },
    [handleCursorPositionUpdate],
  );

  const handlePointerMove: PointerEventHandler<E> = useCallback(
    (event) => {
      if (activePointer.current !== event.pointerId) return;
      event.preventDefault();
      const samples = event.nativeEvent.getCoalescedEvents?.();
      const latest = samples?.[samples.length - 1] ?? event.nativeEvent;
      scheduleCursorPositionUpdate({ x: latest.clientX, y: latest.clientY });
    },
    [scheduleCursorPositionUpdate],
  );

  const handlePointerEnd: PointerEventHandler<E> = useCallback(
    (event) => {
      if (activePointer.current !== event.pointerId) return;
      cancelScheduledUpdate();
      handleCursorPositionUpdate({ x: event.clientX, y: event.clientY });
      activePointer.current = null;
      dragRect.current = null;
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [cancelScheduledUpdate, handleCursorPositionUpdate],
  );

  const handlePointerCancel: PointerEventHandler<E> = useCallback(
    (event) => {
      if (activePointer.current !== event.pointerId) return;
      cancelScheduledUpdate();
      activePointer.current = null;
      dragRect.current = null;
    },
    [cancelScheduledUpdate],
  );

  return {
    onPointerCancel: handlePointerCancel,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerEnd,
  };
}
