import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import tinycolor, { ColorFormats } from "tinycolor2";

import { Cursor } from "./Cursor";
import { useSaturationBrightnessEventHandler } from "./SaturationBrightnessEventHandler";

const StyledDiv = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  line-height: 0;
  border-radius: 2px;
  user-select: none;
  touch-action: none;
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
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const hsvRef = useRef(hsv);
  hsvRef.current = hsv;
  const [preview, setPreview] = useState(() => ({ s: hsv.s, v: hsv.v }));

  useEffect(() => {
    if (dragging.current) return;
    setPreview((current) =>
      current.s === hsv.s && current.v === hsv.v
        ? current
        : { s: hsv.s, v: hsv.v },
    );
  }, [hsv.s, hsv.v]);

  const handlePreview = useCallback((s: number, v: number) => {
    setPreview((current) =>
      current.s === s && current.v === v ? current : { s, v },
    );
  }, []);
  const handleInteractionStart = useCallback(() => {
    dragging.current = true;
  }, []);
  const handleInteractionEnd = useCallback((cancelled: boolean) => {
    dragging.current = false;
    if (cancelled) {
      const current = hsvRef.current;
      setPreview({ s: current.s, v: current.v });
    }
  }, []);
  const props = useSaturationBrightnessEventHandler(ref, onColorUpdate, {
    onPreview: handlePreview,
    onInteractionStart: handleInteractionStart,
    onInteractionEnd: handleInteractionEnd,
  });

  const hueColor = useMemo(
    () =>
      tinycolor
        .fromRatio({
          h: hsv.h,
          s: 1.0,
          v: 1.0,
        })
        .toHexString(),
    [hsv.h],
  );

  return (
    <StyledDiv
      className={"sb-panel " + (className || "")}
      style={{ backgroundColor: hueColor }}
      ref={ref}
      {...props}
    >
      <Cursor x={preview.s} y={1 - preview.v} />
      <div className="saturation"></div>
      <div className="brightness"></div>
    </StyledDiv>
  );
};
