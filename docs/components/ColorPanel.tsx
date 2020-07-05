import React, {
  FC,
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";

import { HueSlider } from "./HueSlider";
import { BrightnessSaturationPanel } from "./BrightnessSaturationPanel";
import { Size } from "./utils";

const Panel = styled.div`
  margin-bottom: 5px;
  user-select: none;
`;

export interface ColorPanelProps {
  width?: string;
  onColorUpdate?(color: tinycolor.Instance): void;
}

interface CursorPosition {
  x: number;
  y: number;
}

export const ColorPanel: FC<ColorPanelProps> = ({ width, onColorUpdate }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hue, setHue] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
  });
  const [panelSize, setPanelSize] = useState<Size>(null);

  const updateCursorPosition = useCallback(
    ({ x, y }: CursorPosition) => {
      if (!ref.current) {
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      setCursorPosition({
        x: x - rect.left,
        y: y - rect.top,
      });
    },
    [ref.current]
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

  const handleHueChange = useCallback((h) => {
    setHue(h);
  }, []);

  const brightness = useMemo(
    () =>
      Math.max(
        0,
        Math.min(1, 1 - (panelSize ? cursorPosition.y / panelSize.height : 0))
      ),
    [panelSize, cursorPosition]
  );
  const saturation = useMemo(
    () =>
      Math.max(
        0,
        Math.min(1, panelSize ? cursorPosition.x / panelSize.width : 0)
      ),
    [panelSize, cursorPosition]
  );

  useEffect(() => {
    const color = tinycolor.fromRatio({
      h: hue / 360,
      s: saturation,
      v: brightness,
    });
    onColorUpdate && onColorUpdate(color);
  }, [brightness, saturation, hue, onColorUpdate]);

  return (
    <div
      className="color-panel"
      style={{
        width: width || "100%",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      ref={ref}
    >
      <Panel>
        <BrightnessSaturationPanel
          brightness={brightness}
          saturation={saturation}
          hue={hue}
          onSizeUpdate={setPanelSize}
        />
      </Panel>
      <HueSlider hue={hue} onHueChange={handleHueChange} />
    </div>
  );
};
