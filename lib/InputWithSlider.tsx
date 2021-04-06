import React, { FC, useCallback, useMemo, ReactNode } from "react";
import InputSlider from "react-input-slider";
import styled from "styled-components";

import { NumberInput } from "./NumberInput";
import { SliderStyles } from "./SliderStyles";

const StyledDiv = styled.div`
  display: flex;
  align-items: center;

  & > label {
    white-space: nowrap;
    font-weight: bold;
  }
  & > div {
    flex-grow: 1;
    margin: 0 16px;
  }
  & > input {
    width: 3.5em;
    flex-grow: 0;
  }
`;

interface IProps {
  /** optional CSS class name */
  className?: string;
  /** whether this input is disabled or not */
  disabled?: boolean;
  /** label text */
  label?: ReactNode;
  /** current value */
  value: number;
  /** possible minimum value */
  min?: number;
  /** possible maximum value */
  max?: number;
  /** called when the current value is updated */
  onValueChange?(value: number): void;
  /** CSS style values for the slider */
  styles?: SliderStyles;
}

export const InputWithSlider: FC<IProps> = ({
  className,
  disabled,
  label,
  value,
  min,
  max,
  onValueChange,
  styles = {},
}) => {
  const handleSliderChange = useCallback(
    ({ x }) => {
      onValueChange && onValueChange(x);
    },
    [onValueChange]
  );

  const minimum = useMemo(
    () => (typeof min === "number" && !isNaN(min) ? min : 0),
    [min]
  );
  const maximum = useMemo(
    () => (typeof max === "number" && !isNaN(max) ? max : 100),
    [max]
  );

  const computedStyles = useMemo(() => {
    return {
      track: Object.assign(
        {
          backgroundColor: "#ddd",
        },
        styles.track
      ),
      active: Object.assign(
        {
          backgroundColor: "#556",
        },
        styles.active
      ),
      thumb: Object.assign(
        {
          boxShadow: "0 1px 1px rgba(0,0,0,.5)",
        },
        styles.thumb
      ),
      disabled: styles.disabled,
    };
  }, [styles]);

  return (
    <StyledDiv className={"slider " + (className || "")}>
      {label && <label>{label}</label>}
      <InputSlider
        disabled={disabled}
        axis="x"
        x={value}
        xmin={minimum}
        xmax={maximum}
        styles={computedStyles}
        onChange={handleSliderChange}
      />
      <NumberInput
        disabled={disabled}
        value={value}
        min={minimum}
        max={maximum}
        onValueChange={onValueChange}
      />
    </StyledDiv>
  );
};
