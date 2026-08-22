import { FC, useCallback, useMemo } from "react";
import { ColorFormats } from "tinycolor2";

import { InputGroups } from "./InputGroups";
import { NumberInput } from "./NumberInput";
import styled from "styled-components";

const StyledNumberInput = styled(NumberInput)`
  width: 3.5em;
`;

export interface HueSaturationBrightnessInputProps {
  /** optional CSS class name */
  className?: string;
  /** color value */
  hsv: ColorFormats.HSV;
  /** called when hue value gets updated */
  onHueUpdate(hue: number): void;
  /** called when saturation value gets updated */
  onSaturationUpdate(saturation: number): void;
  /** called when brightness value gets updated */
  onBrightnessUpdate(brightness: number): void;
}

export const HueSaturationBrightnessInput: FC<
  HueSaturationBrightnessInputProps
> = ({
  className,
  hsv,
  onHueUpdate,
  onSaturationUpdate,
  onBrightnessUpdate,
}) => {
  const handleHueChange = useCallback(
    (h: number) => {
      onHueUpdate(h);
    },
    [onHueUpdate],
  );
  const handleSaturationChange = useCallback(
    (s: number) => {
      onSaturationUpdate(s * 0.01);
    },
    [onSaturationUpdate],
  );
  const handleBrightnessChange = useCallback(
    (b: number) => {
      onBrightnessUpdate(b * 0.01);
    },
    [onBrightnessUpdate],
  );
  const h = useMemo(() => Math.round(hsv.h), [hsv]);
  const s = useMemo(() => Math.round(hsv.s * 100), [hsv]);
  const b = useMemo(() => Math.round(hsv.v * 100), [hsv]);

  return (
    <InputGroups className={"hsb-input " + (className || "")}>
      <div className="input group">
        <label>
          H <span className="range">[0-360]</span>
        </label>
        <StyledNumberInput
          min={0}
          max={360}
          value={h}
          onValueChange={handleHueChange}
        />
      </div>
      <div className="input group">
        <label>
          S <span className="range">[0-100]</span>
        </label>
        <StyledNumberInput value={s} onValueChange={handleSaturationChange} />
      </div>
      <div className="input group">
        <label>
          B <span className="range">[0-100]</span>
        </label>
        <StyledNumberInput value={b} onValueChange={handleBrightnessChange} />
      </div>
    </InputGroups>
  );
};
