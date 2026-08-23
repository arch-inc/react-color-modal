import { FC, useCallback, useMemo, ReactNode } from "react";

import { classNames } from "./classNames";
import { NumberInput } from "./NumberInput";
import { RangeSlider } from "./RangeSlider";
import { SliderStyles } from "./SliderStyles";

export interface InputWithSliderProps {
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

export const InputWithSlider: FC<InputWithSliderProps> = ({
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
    (nextValue: number) => {
      onValueChange && onValueChange(nextValue);
    },
    [onValueChange],
  );

  const minimum = useMemo(
    () => (typeof min === "number" && !isNaN(min) ? min : 0),
    [min],
  );
  const maximum = useMemo(
    () => (typeof max === "number" && !isNaN(max) ? max : 100),
    [max],
  );

  const computedStyles = useMemo(() => {
    return {
      track: Object.assign(
        {
          backgroundColor: "#ddd",
        },
        styles.track,
      ),
      active: Object.assign(
        {
          backgroundColor: "#556",
        },
        styles.active,
      ),
      thumb: Object.assign(
        {
          boxShadow: "0 1px 1px rgba(0,0,0,.5)",
        },
        styles.thumb,
      ),
      disabled: styles.disabled,
    };
  }, [styles]);

  return (
    <div className={classNames("rcm-input-with-slider", "slider", className)}>
      {label && <label>{label}</label>}
      <RangeSlider
        ariaLabel={typeof label === "string" ? label : "Value"}
        disabled={disabled}
        value={value}
        min={minimum}
        max={maximum}
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
    </div>
  );
};
