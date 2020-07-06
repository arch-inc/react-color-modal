import React, { FC, useCallback, ChangeEvent, useMemo } from "react";
import { Interpolation } from "@emotion/serialize";
import styled from "styled-components";

const StyledInput = styled.input`
  padding: 0.3em;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 2px;
  font-size: 1.2em;

  & :focus {
    outline-color: rgba(34, 36, 38, 0.4);
  }
`;

export interface NumberInputProps {
  /** optional CSS class name */
  className?: string;
  /** current value */
  value: number;
  /** minimum value */
  min?: number;
  /** maximum value */
  max?: number;
  /** whether this input is disabled or not */
  disabled?: boolean;
  /** called when value changes */
  onValueChange: (value: number) => void;
  /** CSS style values for the seekbar */
  styles?: {
    track?: Interpolation;
    active?: Interpolation;
    thumb?: Interpolation;
    disabled?: Interpolation;
  };
}

export const NumberInput: FC<NumberInputProps> = ({
  className,
  value,
  min,
  max,
  disabled,
  onValueChange,
}) => {
  const minimum = useMemo(
    () => (typeof min === "number" && !isNaN(min) ? min : 0),
    [min]
  );
  const maximum = useMemo(
    () => (typeof max === "number" && !isNaN(max) ? max : 100),
    [max]
  );

  const handleValueChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) =>
      onValueChange(ev.target.valueAsNumber),
    []
  );

  return (
    <StyledInput
      className={"input number" + (className || "")}
      disabled={disabled}
      type="number"
      value={value}
      min={minimum}
      max={maximum}
      onChange={handleValueChange}
    />
  );
};
