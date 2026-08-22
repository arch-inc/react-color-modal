import {
  CSSProperties,
  FC,
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useRef,
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

  const updateFromClientX = useCallback(
    (element: HTMLDivElement, clientX: number) => {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0) return;
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + ratio * (max - min);
      const next = clamp(min + Math.round((raw - min) / step) * step, min, max);
      onChange?.(next);
    },
    [max, min, onChange, step],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled || (event.pointerType === "mouse" && event.button !== 0)) {
        return;
      }
      event.preventDefault();
      activePointer.current = event.pointerId;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      onDragStart?.();
      updateFromClientX(event.currentTarget, event.clientX);
    },
    [disabled, onDragStart, updateFromClientX],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (activePointer.current !== event.pointerId) return;
      event.preventDefault();
      updateFromClientX(event.currentTarget, event.clientX);
    },
    [updateFromClientX],
  );

  const finishPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (activePointer.current !== event.pointerId) return;
      updateFromClientX(event.currentTarget, event.clientX);
      activePointer.current = null;
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      onDragEnd?.();
    },
    [onDragEnd, updateFromClientX],
  );

  const cancelPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (activePointer.current !== event.pointerId) return;
      activePointer.current = null;
      onDragEnd?.();
    },
    [onDragEnd],
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
      onChange?.(clamp(next, min, max));
    },
    [disabled, max, min, onChange, step, value],
  );

  const position = normalize(value, min, max);
  return (
    <div
      aria-disabled={disabled}
      aria-label={ariaLabel}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={clamp(value, min, max)}
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
