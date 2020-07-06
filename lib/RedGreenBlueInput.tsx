import React, { FC, useCallback, useMemo } from "react";
import { ColorFormats } from "tinycolor2";

import { InputGroups } from "./InputGroups";
import { NumberInput } from "./NumberInput";
import { throttle } from "./utils";

/** trigger events at 60 fps at maximum */
const wait = 1000 / 60;

export interface RedGreenBlueInputProps {
  /** optional CSS class name */
  className?: string;
  /** color value */
  rgb: ColorFormats.RGB;
  /** called when color gets updated */
  onColorUpdate(rgb: ColorFormats.RGB): void;
}

export const RedGreenBlueInput: FC<RedGreenBlueInputProps> = ({
  className,
  rgb,
  onColorUpdate,
}) => {
  const handleRedChange = useCallback(
    throttle((r: number) => {
      onColorUpdate({ ...rgb, r });
    }, wait),
    [rgb, onColorUpdate]
  );
  const handleGreenChange = useCallback(
    throttle((g: number) => {
      onColorUpdate({ ...rgb, g });
    }, wait),
    [rgb, onColorUpdate]
  );
  const handleBlueChange = useCallback(
    throttle((b: number) => {
      onColorUpdate({ ...rgb, b });
    }, wait),
    [rgb, onColorUpdate]
  );
  const { r, g, b } = rgb;

  return (
    <InputGroups className={"rgb-input " + (className || "")}>
      <div className="input group">
        <label>
          R <span className="range">[0-255]</span>
        </label>
        <NumberInput
          min={0}
          max={255}
          value={r}
          onValueChange={handleRedChange}
        />
      </div>
      <div className="input group">
        <label>
          G <span className="range">[0-255]</span>
        </label>
        <NumberInput
          min={0}
          max={255}
          value={g}
          onValueChange={handleGreenChange}
        />
      </div>
      <div className="input group">
        <label>
          B <span className="range">[0-255]</span>
        </label>
        <NumberInput
          min={0}
          max={255}
          value={b}
          onValueChange={handleBlueChange}
        />
      </div>
    </InputGroups>
  );
};
