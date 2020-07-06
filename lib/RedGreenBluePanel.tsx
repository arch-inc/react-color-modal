import React, { FC, useCallback } from "react";
import styled from "styled-components";
import { ColorFormats } from "tinycolor2";

import { throttle } from "./utils";
import { InputWithSlider } from "./InputWithSlider";

const StyledSpan = styled.span`
  font-weight: normal;
  color: rgba(34, 36, 38, 0.4);
`;
const StyledInputWithSlider = styled(InputWithSlider)`
  margin-top: 0.5em;
  &:last-child {
    margin-bottom: 0.5em;
  }
`;

/** trigger events at 60 fps at maximum */
const wait = 1000 / 60;

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
    <div className={"rgb-input-panel " + (className || "")}>
      <StyledInputWithSlider
        disabled={disabled}
        label={
          <>
            R <StyledSpan>[0-255]</StyledSpan>
          </>
        }
        value={r}
        min={0}
        max={255}
        onValueChange={handleRedChange}
      />
      <StyledInputWithSlider
        disabled={disabled}
        label={
          <>
            G <StyledSpan>[0-255]</StyledSpan>
          </>
        }
        value={g}
        min={0}
        max={255}
        onValueChange={handleGreenChange}
      />
      <StyledInputWithSlider
        disabled={disabled}
        label={
          <>
            B <StyledSpan>[0-255]</StyledSpan>
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
