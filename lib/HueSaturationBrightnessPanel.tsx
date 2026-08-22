import { FC, useCallback } from "react";
import styled from "styled-components";
import { ColorFormats } from "tinycolor2";

import { HueSlider } from "./HueSlider";
import { SaturationBrightnessPanel } from "./SaturationBrightnessPanel";
import { HueSaturationBrightnessInput } from "./HueSaturationBrightnessInput";

const StyledDiv = styled.div`
  width: 100%;
`;
const StyledSaturationBrightnessPanel = styled(SaturationBrightnessPanel)`
  margin-bottom: 16px;
`;
const StyledHueSlider = styled(HueSlider)`
  margin-bottom: 12px;
`;

export interface HueSaturationBrightnessPanelProps {
  /** optional CSS class name */
  className?: string;
  /** hide panel */
  hidePanel?: boolean;
  /** hide slider */
  hideSlider?: boolean;
  /** hide text input */
  hideInput?: boolean;
  /** color value */
  hsv?: ColorFormats.HSV;
  /** called when color gets updated */
  onColorUpdate?(hsv: ColorFormats.HSV): void;
}

export const HueSaturationBrightnessPanel: FC<
  HueSaturationBrightnessPanelProps
> = ({ className, hidePanel, hideSlider, hideInput, hsv, onColorUpdate }) => {
  const handleHueUpdate = useCallback(
    (h: number) => hsv.h !== h && onColorUpdate && onColorUpdate({ ...hsv, h }),
    [hsv, onColorUpdate],
  );
  const handleSaturationUpdate = useCallback(
    (s: number) => hsv.s !== s && onColorUpdate && onColorUpdate({ ...hsv, s }),
    [hsv, onColorUpdate],
  );
  const handleBrightnessUpdate = useCallback(
    (v: number) => hsv.v !== v && onColorUpdate && onColorUpdate({ ...hsv, v }),
    [hsv, onColorUpdate],
  );
  const handleSaturationBrightnessUpdate = useCallback(
    (s: number, v: number) => {
      const val = {
        ...hsv,
        s: typeof s === "number" && !isNaN(s) ? s : hsv.s,
        v: typeof v === "number" && !isNaN(v) ? v : hsv.v,
      };
      (hsv.s !== s || hsv.v !== v) && onColorUpdate && onColorUpdate(val);
    },
    [hsv, onColorUpdate],
  );

  return (
    <StyledDiv className={"hsb-panel " + (className || "")}>
      {!hidePanel && (
        <StyledSaturationBrightnessPanel
          hsv={hsv}
          onColorUpdate={handleSaturationBrightnessUpdate}
        />
      )}
      {!hideSlider && (
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
      )}
      {!hideInput && (
        <HueSaturationBrightnessInput
          hsv={hsv}
          onHueUpdate={handleHueUpdate}
          onSaturationUpdate={handleSaturationUpdate}
          onBrightnessUpdate={handleBrightnessUpdate}
        />
      )}
    </StyledDiv>
  );
};
