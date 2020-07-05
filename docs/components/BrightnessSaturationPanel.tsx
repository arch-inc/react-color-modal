import { FC, MutableRefObject, useEffect, useState, useMemo } from "react";
import tinycolor from "tinycolor2";

import { useResize } from "./utils";
import styled from "styled-components";

const Panel = styled.div`
  position: relative;
  width: 100%;
  line-height: 0;
  z-index: 1;
  & > .brightness,
  & > .saturation {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  & > .brightness {
    z-index: 3;
    background-image: linear-gradient(to bottom, transparent 0%, #000000 100%);
  }
  & > .saturation {
    z-index: 2;
    background-image: linear-gradient(to right, #ffffff 0%, transparent 100%);
  }
`;

interface BrightnessSaturationPanelProps {
  hue: number;
}

export const BrightnessSaturationPanel: FC<BrightnessSaturationPanelProps> = ({
  hue,
}) => {
  const [size, ref] = useResize();
  const [height, setHeight] = useState<string>("0px");

  useEffect(() => {
    setHeight(`${size.width}px`);
  }, [size]);

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
    <Panel
      className="panel"
      style={{ height: height, backgroundColor: hueColor }}
      ref={ref as MutableRefObject<HTMLDivElement>}
    >
      <div className="brightness"></div>
      <div className="saturation"></div>
    </Panel>
  );
};
