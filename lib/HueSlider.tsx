import React, { FC, useMemo, useState, useEffect, useCallback } from "react";
import InputSlider from "react-input-slider";
import styled from "styled-components";
import { SliderStyles } from "./SliderStyles";

const StyledDiv = styled.div`
  width: 100%;
  & > div {
    width: 100%;
  }
`;

const hueGradation =
  "linear-gradient(to right, #ff0000 0%, #ff9900 10%, #cdff00 20%, #35ff00 30%, #00ff66 40%, #00fffd 50%, #0066ff 60%, #3200ff 70%, #cd00ff 80%, #ff0099 90%, #ff0000 100%)";

export interface HueSliderProps {
  /** optional CSS class name */
  className?: string;
  /** whether this slider is disabled or not */
  disabled?: boolean;
  /** current value of the hue slider */
  hue: number;
  /** called when the current value is updated */
  onHueChange?: (position: number) => void;
  /** called when drag starts */
  onHueChangeStart?: () => void;
  /** called when drag ends */
  onHueChangeEnd?: () => void;
  /** CSS style values for the slider */
  styles?: SliderStyles;
}

export const HueSlider: FC<HueSliderProps> = ({
  className,
  disabled,
  hue,
  onHueChangeStart,
  onHueChange,
  onHueChangeEnd,
  styles = {},
}) => {
  const [currentHue, setCurrentHue] = useState<number>(hue || 0);
  const [isDragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    if (isDragging || hue === currentHue) {
      return;
    }
    setCurrentHue(hue);
  }, [hue, isDragging]);

  const handleDragStart = useCallback(() => {
    onHueChangeStart && onHueChangeStart();
    setDragging(true);
  }, [onHueChangeStart]);

  const handleDragEnd = useCallback(() => {
    onHueChangeEnd && onHueChangeEnd();
    setDragging(false);
  }, [onHueChangeEnd]);

  const handleChange = useCallback(
    ({ x }) => {
      onHueChange && onHueChange(x);
      setCurrentHue(x);
    },
    [onHueChange]
  );

  const computedStyles = useMemo(() => {
    return {
      track: Object.assign(
        {
          backgroundImage: hueGradation,
        },
        styles.track
      ),
      active: Object.assign(
        {
          backgroundColor: "transparent",
        },
        styles.active
      ),
      thumb: Object.assign(
        {
          backgroundColor: "transparent",
          border: "6px solid #fff",
          boxShadow: "0 1px 1px rgba(0,0,0,.5)",
        },
        styles.thumb
      ),
      disabled: styles.disabled,
    };
  }, [styles]);

  return (
    <StyledDiv className={"hue-slider " + (className || "")}>
      <InputSlider
        disabled={disabled}
        axis="x"
        x={currentHue}
        xmin={0}
        xmax={360}
        styles={computedStyles}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onChange={handleChange}
      />
    </StyledDiv>
  );
};
