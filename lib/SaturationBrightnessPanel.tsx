import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import tinycolor, { ColorFormats } from "tinycolor2";

import { classNames } from "./classNames";
import { Cursor } from "./Cursor";
import { useSaturationBrightnessEventHandler } from "./SaturationBrightnessEventHandler";

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
    <div
      className={classNames("rcm-sb-panel", "sb-panel", className)}
      style={{ backgroundColor: hueColor }}
      ref={ref}
      {...props}
    >
      <Cursor x={preview.s} y={1 - preview.v} />
      <div className="saturation"></div>
      <div className="brightness"></div>
    </div>
  );
};
