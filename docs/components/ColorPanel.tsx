import React, { FC, useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";

import { HueSlider } from "./HueSlider";
import { SaturationBrightnessPanel } from "./SaturationBrightnessPanel";

const Panel = styled.div`
  margin-bottom: 5px;
  user-select: none;
`;

export interface ColorPanelProps {
  width?: string;
  onColorUpdate?(color: tinycolor.Instance): void;
}

export const ColorPanel: FC<ColorPanelProps> = ({ width, onColorUpdate }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(0);

  const handleHueUpdate = useCallback((h: number) => {
    setHue(h);
  }, []);

  const handleSaturationBrightnessUpdate = useCallback(
    (s: number, b: number) => {
      setSaturation(s);
      setBrightness(b);
    },
    []
  );

  useEffect(() => {
    const color = tinycolor.fromRatio({
      h: hue / 360,
      s: saturation,
      v: brightness,
    });
    onColorUpdate && onColorUpdate(color);
  }, [hue, saturation, brightness, onColorUpdate]);

  return (
    <div
      className="color-panel"
      style={{
        width: width || "100%",
      }}
      ref={ref}
    >
      <Panel>
        <SaturationBrightnessPanel
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          onUpdate={handleSaturationBrightnessUpdate}
        />
      </Panel>
      <HueSlider hue={hue} onHueChange={handleHueUpdate} />
    </div>
  );
};
