import { FC, useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";

import { useResize, Size } from "./utils";
import { Cursor } from "./Cursor";
import { useSaturationBrightnessEventHandler } from "./SaturationBrightnessEventHandler";

const StyledDiv = styled.div`
  position: relative;
  width: 100%;
  line-height: 0;
  z-index: 1;

  & > .saturation,
  & > .brightness {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  & > .saturation {
    z-index: 2;
    background-image: linear-gradient(to right, #ffffff 0%, transparent 100%);
  }
  & > .brightness {
    z-index: 3;
    background-image: linear-gradient(to bottom, transparent 0%, #000000 100%);
  }
`;

interface SaturationBrightnessPanelProps {
  /** optional CSS class name */
  className?: string;
  /** hue value */
  hue: number;
  /** saturation value */
  saturation: number;
  /** brightness value */
  brightness: number;
  /** called when saturation or brightness gets updated */
  onUpdate?(saturation: number, brightness: number): void;
}

export const SaturationBrightnessPanel: FC<SaturationBrightnessPanelProps> = ({
  className,
  brightness,
  saturation,
  hue,
  onUpdate,
}) => {
  const [measuredSize, ref] = useResize<HTMLDivElement>();
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const [s, b, props] = useSaturationBrightnessEventHandler(ref.current, size);

  useEffect(() => {
    setSize({ width: measuredSize.width, height: measuredSize.width });
  }, [measuredSize, ref.current]);

  useEffect(() => {
    onUpdate && onUpdate(s, b);
  }, [onUpdate, s, b]);

  const hueColor = useMemo(
    () =>
      tinycolor
        .fromRatio({
          h: hue / 360,
          s: 1,
          v: 1,
        })
        .toHexString(),
    [hue]
  );

  return (
    <StyledDiv
      className={"saturation-brightness-panel " + (className || "")}
      style={{ height: `${size.height}px`, backgroundColor: hueColor }}
      ref={ref}
      {...props}
    >
      <Cursor x={saturation} y={1 - brightness} />
      <div className="saturation"></div>
      <div className="brightness"></div>
    </StyledDiv>
  );
};
