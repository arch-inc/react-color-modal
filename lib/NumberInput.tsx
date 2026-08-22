import { FC, useCallback, ChangeEvent, useMemo } from "react";
import { Input } from "./Input";
import { SliderStyles } from "./SliderStyles";

export interface NumberInputProps {
  /** optional CSS class name */
  className?: string;
  /** minimum value */
  min?: number;
  /** maximum value */
  max?: number;
  /** whether this input is disabled or not */
  disabled?: boolean;
  /** current value */
  value: number;
  /** called when value changes */
  onValueChange: (value: number) => void;
  /** CSS style values for the seekbar */
  styles?: SliderStyles;
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
    [min],
  );
  const maximum = useMemo(
    () => (typeof max === "number" && !isNaN(max) ? max : 100),
    [max],
  );

  const handleValueChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) =>
      onValueChange(ev.target.valueAsNumber),
    [onValueChange],
  );

  return (
    <Input
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
