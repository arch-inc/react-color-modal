import React, { FC, useState, useEffect, useCallback } from "react";
import tinycolor from "tinycolor2";

import { HueSaturationBrightnessPanel } from "./HueSaturationBrightnessPanel";

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

  return (
    <>
      <HueSaturationBrightnessPanel
        color={currentColor}
        onColorUpdate={handleColorUpdate}
      />
    </>
  );
};
