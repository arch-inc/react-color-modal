import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import tinycolor, { ColorInputWithoutInstance } from "tinycolor2";

import { TinyColorInstance } from "./TinyColorInstance";
import { Hr } from "./Hr";
import { HueSaturationBrightnessPanel } from "./HueSaturationBrightnessPanel";
import { RedGreenBluePanel } from "./RedGreenBluePanel";

export interface BasicColorPanelProps {
  /** optional CSS class name */
  className?: string;
  /** color value */
  color?: TinyColorInstance;
  /** called when color gets updated */
  onColorUpdate?(color: TinyColorInstance): void;
}

export const BasicColorPanel: FC<BasicColorPanelProps> = ({
  className,
  color,
  onColorUpdate,
}) => {
  const [hue, setHue] = useState(color?.toHsl().h || 0);
  const [currentColor, setCurrentColor] = useState<TinyColorInstance>(color);

  useEffect(() => {
    if (!color) {
      return;
    }
    setCurrentColor(color);
  }, [color]);

  useEffect(() => {
    if (currentColor?.toHsv().s !== 0) {
      setHue(currentColor.toHsv().h);
    }
  }, [currentColor]);

  const handleColorUpdate = useCallback(
    (colorData: ColorInputWithoutInstance) => {
      if (typeof colorData === "object" && "h" in colorData) {
        setHue(colorData.h);
      }

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
          ? { ...currentColor.toHsv(), h: hue }
          : {
              h: hue,
              s: 0,
              v: 0,
            },
      [currentColor, hue]
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
