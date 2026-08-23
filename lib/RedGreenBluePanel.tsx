import { FC, useCallback } from "react";
import { ColorFormats } from "tinycolor2";

import { classNames } from "./classNames";
import { InputWithSlider } from "./InputWithSlider";

export interface RedGreenBluePanelProps {
  /** optional CSS class name */
  className?: string;
  /** whether this input is disabled or not */
  disabled?: boolean;
  /** color value */
  rgb: ColorFormats.RGB;
  /** called when color gets updated */
  onColorUpdate(rgb: ColorFormats.RGB): void;
}

export const RedGreenBluePanel: FC<RedGreenBluePanelProps> = ({
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
    <div className={classNames("rgb-panel", className)}>
      <InputWithSlider
        className="rcm-rgb-slider"
        disabled={disabled}
        label={
          <>
            R <span className="rcm-range">[0-255]</span>
          </>
        }
        value={r}
        min={0}
        max={255}
        onValueChange={handleRedChange}
      />
      <InputWithSlider
        className="rcm-rgb-slider"
        disabled={disabled}
        label={
          <>
            G <span className="rcm-range">[0-255]</span>
          </>
        }
        value={g}
        min={0}
        max={255}
        onValueChange={handleGreenChange}
      />
      <InputWithSlider
        className="rcm-rgb-slider"
        disabled={disabled}
        label={
          <>
            B <span className="rcm-range">[0-255]</span>
          </>
        }
        value={b}
        min={0}
        max={255}
        onValueChange={handleBlueChange}
      />
    </div>
  );
};
