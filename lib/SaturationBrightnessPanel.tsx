import React, { FC, useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import tinycolor, { ColorFormats } from "tinycolor2";

import { useResize, Size } from "./utils";
import { Cursor } from "./Cursor";
import { useSaturationBrightnessEventHandler } from "./SaturationBrightnessEventHandler";

const StyledDiv = styled.div`
  position: relative;
  width: 100%;
  line-height: 0;
  border-radius: 2px;
  user-select: none;
  z-index: 1;

  & > .saturation,
  & > .brightness {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 2px;
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

export interface SaturationBrightnessPanelProps {
  /** optional CSS class name */
  className?: string;
  /** color value */
  hsv: ColorFormats.HSV;
  /** called when saturation or brightness gets updated */
  onColorUpdate?(saturation: number, brightness: number): void;
}

export const SaturationBrightnessPanel: FC<SaturationBrightnessPanelProps> = ({
  className,
  hsv,
  onColorUpdate,
}) => {
  const [measuredSize, ref] = useResize<HTMLDivElement>();
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    setSize({ width: measuredSize.width, height: measuredSize.width });
  }, [measuredSize, ref.current]);

  const props = useSaturationBrightnessEventHandler(
    ref.current,
    size,
    onColorUpdate
  );

  const hueColor = useMemo(
    () =>
      tinycolor
        .fromRatio({
          h: hsv.h,
          s: 1.0,
          v: 1.0,
        })
        .toHexString(),
    [hsv.h]
  );

  return (
    <StyledDiv
      className={"sb-panel " + (className || "")}
      style={{ height: `${size.height}px`, backgroundColor: hueColor }}
      ref={ref}
      {...props}
    >
      <Cursor x={hsv.s} y={1 - hsv.v} />
      <div className="saturation"></div>
      <div className="brightness"></div>
    </StyledDiv>
  );
};
