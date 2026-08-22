import {
  CSSProperties,
  FC,
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { SliderStyles } from "./SliderStyles";

const baseTrackStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: 10,
  backgroundColor: "#ddd",
  borderRadius: 5,
  boxSizing: "border-box",
  touchAction: "none",
  userSelect: "none",
};

const baseActiveStyle: CSSProperties = {
  position: "absolute",
  inset: "0 auto 0 0",
  backgroundColor: "#5e72e4",
  borderRadius: "inherit",
  pointerEvents: "none",
};

const baseThumbStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  width: 18,
  height: 18,
  backgroundColor: "#fff",
  borderRadius: "50%",
  boxShadow: "0 1px 1px rgba(0,0,0,.5)",
  boxSizing: "border-box",
  pointerEvents: "none",
  transform: "translate(-50%, -50%)",
};

interface RangeSliderProps {
  disabled?: boolean;
  value: number;
  min: number;
  max: number;
  step?: number;
  ariaLabel: string;
  styles?: SliderStyles;
  onChange?(value: number): void;
  onDragStart?(): void;
  onDragEnd?(): void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalize(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((clamp(value, min, max) - min) / (max - min)) * 100;
}

const EXTERNAL_UPDATE_INTERVAL_MS = 40;

export const RangeSlider: FC<RangeSliderProps> = ({
  disabled = false,
  value,
  min,
  max,
  step = 1,
  ariaLabel,
  styles = {},
  onChange,
  onDragStart,
  onDragEnd,
}) => {
  const activePointer = useRef<number | null>(null);
  const dragRect = useRef<DOMRect | null>(null);
  const pendingClientX = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);
  const lastExternalUpdate = useRef(0);
  const onChangeRef = useRef(onChange);
  const [previewValue, setPreviewValue] = useState(value);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (activePointer.current === null) setPreviewValue(value);
  }, [value]);

  const cancelScheduledUpdate = useCallback(() => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    pendingClientX.current = null;
  }, []);

  useEffect(() => cancelScheduledUpdate, [cancelScheduledUpdate]);

  const updateFromClientX = useCallback(
    (element: HTMLDivElement, clientX: number) => {
      const rect = dragRect.current ?? element.getBoundingClientRect();
      if (rect.width <= 0) return null;
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + ratio * (max - min);
      return clamp(min + Math.round((raw - min) / step) * step, min, max);
    },
    [max, min, step],
  );

  const applyFromClientX = useCallback(
    (element: HTMLDivElement, clientX: number, propagate: boolean) => {
      const next = updateFromClientX(element, clientX);
      if (next === null) return;
      setPreviewValue(next);
      if (propagate) onChangeRef.current?.(next);
    },
    [updateFromClientX],
  );

  const scheduleFromClientX = useCallback(
    (element: HTMLDivElement, clientX: number) => {
      pendingClientX.current = clientX;
      if (animationFrame.current !== null) return;
      animationFrame.current = requestAnimationFrame((timestamp) => {
        animationFrame.current = null;
        const pending = pendingClientX.current;
        pendingClientX.current = null;
        if (pending === null) return;
        const propagate =
          timestamp - lastExternalUpdate.current >=
          EXTERNAL_UPDATE_INTERVAL_MS;
        if (propagate) lastExternalUpdate.current = timestamp;
        applyFromClientX(element, pending, propagate);
      });
    },
    [applyFromClientX],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled || (event.pointerType === "mouse" && event.button !== 0)) {
        return;
      }
      event.preventDefault();
      activePointer.current = event.pointerId;
      dragRect.current = event.currentTarget.getBoundingClientRect();
      lastExternalUpdate.current = performance.now();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      onDragStart?.();
      applyFromClientX(event.currentTarget, event.clientX, true);
    },
    [applyFromClientX, disabled, onDragStart],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (activePointer.current !== event.pointerId) return;
      event.preventDefault();
      const samples = event.nativeEvent.getCoalescedEvents?.();
      const latest = samples?.[samples.length - 1] ?? event.nativeEvent;
      scheduleFromClientX(event.currentTarget, latest.clientX);
    },
    [scheduleFromClientX],
  );

  const finishPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (activePointer.current !== event.pointerId) return;
      cancelScheduledUpdate();
      applyFromClientX(event.currentTarget, event.clientX, true);
      activePointer.current = null;
      dragRect.current = null;
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      onDragEnd?.();
    },
    [applyFromClientX, cancelScheduledUpdate, onDragEnd],
  );

  const cancelPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (activePointer.current !== event.pointerId) return;
      cancelScheduledUpdate();
      activePointer.current = null;
      dragRect.current = null;
      setPreviewValue(value);
      onDragEnd?.();
    },
    [cancelScheduledUpdate, onDragEnd, value],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      let next: number | undefined;
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowDown":
          next = value - step;
          break;
        case "ArrowRight":
        case "ArrowUp":
          next = value + step;
          break;
        case "Home":
          next = min;
          break;
        case "End":
          next = max;
          break;
      }
      if (next === undefined) return;
      event.preventDefault();
      const clamped = clamp(next, min, max);
      setPreviewValue(clamped);
      onChangeRef.current?.(clamped);
    },
    [disabled, max, min, step, value],
  );

  const position = normalize(previewValue, min, max);
  return (
    <div
      aria-disabled={disabled}
      aria-label={ariaLabel}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={clamp(previewValue, min, max)}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      style={{
        ...baseTrackStyle,
        ...styles.track,
        ...(disabled ? { opacity: 0.5, ...styles.disabled } : null),
      }}
      onKeyDown={handleKeyDown}
      onPointerCancel={cancelPointer}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
    >
      <div
        style={{ ...baseActiveStyle, ...styles.active, width: `${position}%` }}
      />
      <div
        style={{ ...baseThumbStyle, ...styles.thumb, left: `${position}%` }}
      />
    </div>
  );
};
