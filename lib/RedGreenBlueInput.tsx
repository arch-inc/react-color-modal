import { FC, useCallback } from "react";
import { ColorFormats } from "tinycolor2";

import { InputGroups } from "./InputGroups";
import { NumberInput } from "./NumberInput";

export interface RedGreenBlueInputProps {
  /** optional CSS class name */
  className?: string;
  /** whether this input is disabled or not */
  disabled?: boolean;
  /** color value */
  rgb: ColorFormats.RGB;
  /** called when color gets updated */
  onColorUpdate(rgb: ColorFormats.RGB): void;
}

export const RedGreenBlueInput: FC<RedGreenBlueInputProps> = ({
  className,
  disabled,
  rgb,
  onColorUpdate,
}) => {
  const handleRedChange = useCallback(
    (r: number) => {
      onColorUpdate({ ...rgb, r });
    },
    [rgb, onColorUpdate],
  );
  const handleGreenChange = useCallback(
    (g: number) => {
      onColorUpdate({ ...rgb, g });
    },
    [rgb, onColorUpdate],
  );
  const handleBlueChange = useCallback(
    (b: number) => {
      onColorUpdate({ ...rgb, b });
    },
    [rgb, onColorUpdate],
  );
  const { r, g, b } = rgb;

  return (
    <InputGroups className={"rgb-input " + (className || "")}>
      <div className="input group">
        <label>
          R <span className="range">[0-255]</span>
        </label>
        <NumberInput
          disabled={disabled}
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
          disabled={disabled}
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
          disabled={disabled}
          min={0}
          max={255}
          value={b}
          onValueChange={handleBlueChange}
        />
      </div>
    </InputGroups>
  );
};
