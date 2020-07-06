import React, { FC, useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import tinycolor, { ColorFormats } from "tinycolor2";

import { HueSlider } from "./HueSlider";
import { SaturationBrightnessPanel } from "./SaturationBrightnessPanel";
import { HueSaturationBrightnessInput } from "./HueSaturationBrightnessInput";

const StyledDiv = styled.div`
  width: 100%;
`;
const StyledSaturationBrightnessPanel = styled(SaturationBrightnessPanel)`
  margin-bottom: 16px;
  user-select: none;
`;
const StyledHueSlider = styled(HueSlider)`
  margin-bottom: 12px;
`;

export interface HueSaturationBrightnessPanelProps {
  /** optional CSS class name */
  className?: string;
  /** color value */
  color?: tinycolor.Instance;
  /** called when color gets updated */
  onColorUpdate?(color: tinycolor.Instance): void;
}

export const HueSaturationBrightnessPanel: FC<HueSaturationBrightnessPanelProps> = ({
  className,
  color,
  onColorUpdate,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hsv, setHsv] = useState<ColorFormats.HSV>(
    (color && color.toHsv()) || {
      h: 0,
      s: 0,
      v: 0,
    }
  );

  useEffect(() => {
    if (!color || tinycolor.equals(hsv, color)) {
      return;
    }
    setHsv(color.toHsv());
  }, [color]);

  const handleHsvUpdate = useCallback(
    (hsv: ColorFormats.HSV) => {
      const color = tinycolor.fromRatio(hsv);
      onColorUpdate && onColorUpdate(color);
    },
    [onColorUpdate]
  );
  const handleHueUpdate = useCallback(
    (h: number) => hsv.h !== h && handleHsvUpdate({ ...hsv, h }),
    [hsv, handleHsvUpdate]
  );
  const handleSaturationUpdate = useCallback(
    (s: number) => hsv.s !== s && handleHsvUpdate({ ...hsv, s }),
    [hsv, handleHsvUpdate]
  );
  const handleBrightnessUpdate = useCallback(
    (v: number) => hsv.v !== v && handleHsvUpdate({ ...hsv, v }),
    [hsv, handleHsvUpdate]
  );
  const handleSaturationBrightnessUpdate = useCallback(
    (s: number, v: number) => {
      const val = {
        ...hsv,
        s: typeof s === "number" && !isNaN(s) ? s : hsv.s,
        v: typeof v === "number" && !isNaN(v) ? v : hsv.v,
      };
      (hsv.s !== s || hsv.v !== v) && handleHsvUpdate(val);
    },
    [hsv, handleHsvUpdate]
  );

  return (
    <StyledDiv className={"color-panel " + (className || "")} ref={ref}>
      <StyledSaturationBrightnessPanel
        hsv={hsv}
        onColorUpdate={handleSaturationBrightnessUpdate}
      />
      <StyledHueSlider
        hue={hsv.h}
        onHueChange={handleHueUpdate}
        styles={{
          track: {
            height: "20px",
            borderRadius: "2px",
          },
          thumb: {
            width: "24px",
            height: "24px",
            borderWidth: "8px",
          },
        }}
      />
      <HueSaturationBrightnessInput
        hsv={hsv}
        onHueUpdate={handleHueUpdate}
        onSaturationUpdate={handleSaturationUpdate}
        onBrightnessUpdate={handleBrightnessUpdate}
      />
    </StyledDiv>
  );
};
