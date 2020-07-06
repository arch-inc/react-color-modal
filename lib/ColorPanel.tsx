import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import tinycolor, { ColorFormats } from "tinycolor2";

import { HueSaturationBrightnessPanel } from "./HueSaturationBrightnessPanel";
import { RedGreenBlueInput } from "./RedGreenBlueInput";

export interface ColorPanelProps {
  /** optional CSS class name */
  className?: string;
  /** color value */
  color?: tinycolor.Instance;
  /** called when color gets updated */
  onColorUpdate?(color: tinycolor.Instance): void;
}

export const ColorPanel: FC<ColorPanelProps> = ({ color, onColorUpdate }) => {
  const [currentColor, setCurrentColor] = useState<tinycolor.Instance>(color);

  useEffect(() => {
    if (!color) {
      return;
    }
    setCurrentColor(color);
  }, [color]);

  const handleColorUpdate = useCallback(
    (c: tinycolor.Instance) => {
      if (!c || tinycolor.equals(c, currentColor)) {
        return;
      }
      setCurrentColor(c);
      onColorUpdate && onColorUpdate(c);
    },
    [currentColor, onColorUpdate]
  );

  const rgb = useMemo(
    () =>
      currentColor
        ? currentColor.toRgb()
        : {
            r: 0,
            g: 0,
            b: 0,
          },
    [currentColor]
  );

  const handleRgbUpdate = useCallback((rgb: ColorFormats.RGB) => {
    const color = tinycolor.fromRatio(rgb);
    if (!rgb || tinycolor.equals(color, currentColor)) {
      return;
    }
    setCurrentColor(color);
    onColorUpdate && onColorUpdate(color);
  }, []);

  return (
    <>
      <HueSaturationBrightnessPanel
        color={currentColor}
        onColorUpdate={handleColorUpdate}
      />
      <RedGreenBlueInput rgb={rgb} onColorUpdate={handleRgbUpdate} />
    </>
  );
};
