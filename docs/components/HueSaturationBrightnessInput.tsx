import React, { FC, useCallback, useMemo } from "react";

import { InputGroups } from "./InputGroups";
import { NumberInput } from "./NumberInput";
import { throttle } from "./utils";

/** trigger events at 60 fps at maximum */
const wait = 1000 / 60;

export interface HueSaturationBrightnessInputProps {
  /** optional CSS class name */
  className?: string;
  /** hue value */
  hue: number;
  /** saturation value */
  saturation: number;
  /** brightness value */
  brightness: number;
  /** called when hue value gets updated */
  onHueUpdate(hue: number): void;
  /** called when saturation value gets updated */
  onSaturationUpdate(saturation: number): void;
  /** called when brightness value gets updated */
  onBrightnessUpdate(brightness: number): void;
}

export const HueSaturationBrightnessInput: FC<HueSaturationBrightnessInputProps> = ({
  className,
  hue,
  saturation,
  brightness,
  onHueUpdate,
  onSaturationUpdate,
  onBrightnessUpdate,
}) => {
  const handleHueChange = useCallback(throttle(onHueUpdate, wait), [
    onHueUpdate,
  ]);
  const handleSaturationChange = useCallback(
    throttle((s: number) => {
      onSaturationUpdate(s * 0.01);
    }, wait),
    [onSaturationUpdate]
  );
  const handleBrightnessChange = useCallback(
    throttle((b: number) => {
      onBrightnessUpdate(b * 0.01);
    }, wait),
    [onBrightnessUpdate]
  );
  const s = useMemo(() => Math.round(saturation * 100), [saturation]);
  const b = useMemo(() => Math.round(brightness * 100), [brightness]);

  return (
    <InputGroups className={"hsb-input " + (className || "")}>
      <div className="input group">
        <label>
          H <span className="range">[0-360]</span>
        </label>
        <NumberInput
          min={0}
          max={360}
          value={hue}
          onValueChange={handleHueChange}
        />
      </div>
      <div className="input group">
        <label>
          S <span className="range">[0-100]</span>
        </label>
        <NumberInput value={s} onValueChange={handleSaturationChange} />
      </div>
      <div className="input group">
        <label>
          B <span className="range">[0-100]</span>
        </label>
        <NumberInput value={b} onValueChange={handleBrightnessChange} />
      </div>
    </InputGroups>
  );
};
