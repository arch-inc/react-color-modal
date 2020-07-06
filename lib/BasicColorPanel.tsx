import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import tinycolor, { ColorInputWithoutInstance } from "tinycolor2";

import { Hr } from "./Hr";
import { HueSaturationBrightnessPanel } from "./HueSaturationBrightnessPanel";
import { RedGreenBluePanel } from "./RedGreenBluePanel";

export interface BasicColorPanelProps {
  /** optional CSS class name */
  className?: string;
  /** color value */
  color?: tinycolor.Instance;
  /** called when color gets updated */
  onColorUpdate?(color: tinycolor.Instance): void;
}

export const BasicColorPanel: FC<BasicColorPanelProps> = ({
  className,
  color,
  onColorUpdate,
}) => {
  const [currentColor, setCurrentColor] = useState<tinycolor.Instance>(color);

  useEffect(() => {
    if (!color) {
      return;
    }
    setCurrentColor(color);
  }, [color]);

  const handleColorUpdate = useCallback(
    (colorData: ColorInputWithoutInstance) => {
      const col = tinycolor.fromRatio(colorData);
      if (!colorData || tinycolor.equals(col, currentColor)) {
        return;
      }
      setCurrentColor(col);
      onColorUpdate && onColorUpdate(col);
    },
    [onColorUpdate]
  );

  const hsv = useMemo(
      () =>
        currentColor
          ? currentColor.toHsv()
          : {
              h: 0,
              s: 0,
              v: 0,
            },
      [currentColor]
    ),
    rgb = useMemo(
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

  return (
    <div className={"basic-color-panel " + (className || "")}>
      <HueSaturationBrightnessPanel
        hsv={hsv}
        onColorUpdate={handleColorUpdate}
      />
      <Hr />
      <RedGreenBluePanel rgb={rgb} onColorUpdate={handleColorUpdate} />
    </div>
  );
};
