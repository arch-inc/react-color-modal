import React, { FC, useCallback, useRef } from "react";
import styled from "styled-components";
import { ColorFormats } from "tinycolor2";

import { throttle } from "./utils";
import { HueSlider } from "./HueSlider";
import { SaturationBrightnessPanel } from "./SaturationBrightnessPanel";
import { HueSaturationBrightnessInput } from "./HueSaturationBrightnessInput";

/** trigger events at 60 fps at maximum */
const wait = 1000 / 60;

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
  hsv?: ColorFormats.HSV;
  /** called when color gets updated */
  onColorUpdate?(hsv: ColorFormats.HSV): void;
}

export const HueSaturationBrightnessPanel: FC<HueSaturationBrightnessPanelProps> = ({
  className,
  hsv,
  onColorUpdate,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleHueUpdate = useCallback(
    throttle(
      (h: number) =>
        hsv.h !== h && onColorUpdate && onColorUpdate({ ...hsv, h }),
      wait
    ),
    [hsv, onColorUpdate]
  );
  const handleSaturationUpdate = useCallback(
    throttle(
      (s: number) =>
        hsv.s !== s && onColorUpdate && onColorUpdate({ ...hsv, s }),
      wait
    ),
    [hsv, onColorUpdate]
  );
  const handleBrightnessUpdate = useCallback(
    throttle(
      (v: number) =>
        hsv.v !== v && onColorUpdate && onColorUpdate({ ...hsv, v }),
      wait
    ),
    [hsv, onColorUpdate]
  );
  const handleSaturationBrightnessUpdate = useCallback(
    throttle((s: number, v: number) => {
      const val = {
        ...hsv,
        s: typeof s === "number" && !isNaN(s) ? s : hsv.s,
        v: typeof v === "number" && !isNaN(v) ? v : hsv.v,
      };
      (hsv.s !== s || hsv.v !== v) && onColorUpdate && onColorUpdate(val);
    }, wait),
    [hsv, onColorUpdate]
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
