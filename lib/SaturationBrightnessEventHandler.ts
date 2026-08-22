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

const EXTERNAL_UPDATE_INTERVAL_MS = 40;

export interface SaturationBrightnessInteractionOptions {
  onPreview?(saturation: number, brightness: number): void;
  onInteractionStart?(): void;
  onInteractionEnd?(cancelled: boolean): void;
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
  options: SaturationBrightnessInteractionOptions = {},
): EventHandlers<E> {
  const activePointer = useRef<number | null>(null);
  const dragRect = useRef<DOMRect | null>(null);
  const pendingPosition = useRef<CursorPosition | null>(null);
  const animationFrame = useRef<number | null>(null);
  const lastExternalUpdate = useRef(0);
  const onUpdateRef = useRef(onUpdate);
  const optionsRef = useRef(options);
  onUpdateRef.current = onUpdate;
  optionsRef.current = options;

  const cancelScheduledUpdate = useCallback(() => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    pendingPosition.current = null;
  }, []);

  useEffect(() => cancelScheduledUpdate, [cancelScheduledUpdate]);

  const handleCursorPositionUpdate = useCallback(
    ({ x, y }: CursorPosition, propagate: boolean) => {
      const el = ref.current;
      if (!el) {
        return;
      }
      const next = calculateSaturationBrightness(
        { x, y },
        dragRect.current ?? el.getBoundingClientRect(),
      );
      optionsRef.current.onPreview?.(next.x, next.y);
      if (propagate) onUpdateRef.current(next.x, next.y);
    },
    [ref],
  );

  const scheduleCursorPositionUpdate = useCallback(
    (position: CursorPosition) => {
      pendingPosition.current = position;
      if (animationFrame.current !== null) return;
      animationFrame.current = requestAnimationFrame((timestamp) => {
        animationFrame.current = null;
        const pending = pendingPosition.current;
        pendingPosition.current = null;
        if (!pending) return;
        const propagate =
          timestamp - lastExternalUpdate.current >=
          EXTERNAL_UPDATE_INTERVAL_MS;
        if (propagate) lastExternalUpdate.current = timestamp;
        handleCursorPositionUpdate(pending, propagate);
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
      lastExternalUpdate.current = performance.now();
      optionsRef.current.onInteractionStart?.();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      handleCursorPositionUpdate(
        { x: event.clientX, y: event.clientY },
        true,
      );
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
      handleCursorPositionUpdate(
        { x: event.clientX, y: event.clientY },
        true,
      );
      activePointer.current = null;
      dragRect.current = null;
      optionsRef.current.onInteractionEnd?.(false);
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
      optionsRef.current.onInteractionEnd?.(true);
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
