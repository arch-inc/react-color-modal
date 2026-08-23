import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import tinycolor, { ColorInputWithoutInstance } from "tinycolor2";

import { classNames } from "./classNames";
import { ColorInput } from "./ColorInput";
import { ColorTextFormat, ColorTextFormats } from "./ColorTextFormats";
import { Hr } from "./Hr";
import { HueSaturationBrightnessPanel } from "./HueSaturationBrightnessPanel";
import { InlineBox } from "./InlineBox";
import { Panel, RaisedPanel } from "./Panel";
import { RedGreenBluePanel } from "./RedGreenBluePanel";
import { TinyColorInstance } from "./TinyColorInstance";

export interface HorizontalColorPanelProps {
  /** optional CSS class name */
  className?: string;
  /** whether this panel looks raised or not */
  raised?: boolean;
  /** color value */
  color?: TinyColorInstance;
  /** called when color gets updated */
  onColorUpdate?(color: TinyColorInstance): void;
  /** optional child elements */
  children?: ReactNode;
}

export const HorizontalColorPanel: FC<HorizontalColorPanelProps> = ({
  className,
  raised,
  color,
  onColorUpdate,
  children,
}) => {
  const [hue, setHue] = useState(color?.toHsl().h || 0);
  const [currentColor, setCurrentColor] = useState<TinyColorInstance>(color);
  const [format, setFormat] = useState<ColorTextFormat>("hex6");

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

  const handleClick = useCallback(() => {
    setFormat(
      ColorTextFormats[
        (ColorTextFormats.indexOf(format) + 1) % ColorTextFormats.length
      ],
    );
  }, [format]);

  const handleColorUpdate = useCallback(
    (color: TinyColorInstance) => {
      if (!color || tinycolor.equals(color, currentColor)) {
        return;
      }
      setCurrentColor(color);
      onColorUpdate && onColorUpdate(color);
    },
    [currentColor, onColorUpdate],
  );

  const handleRawColorUpdate = useCallback(
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
    [currentColor, onColorUpdate],
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
      [currentColor, hue],
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
      [currentColor],
    );

  const Wrapper = useMemo(() => (raised ? RaisedPanel : Panel), [raised]);

  return (
    <Wrapper
      className={classNames(
        "rcm-horizontal-panel",
        "horizontal-color-panel",
        className,
      )}
    >
      <div className="rcm-horizontal-left left">
        <HueSaturationBrightnessPanel
          hideSlider={true}
          hideInput={true}
          hsv={hsv}
          onColorUpdate={handleRawColorUpdate}
        />
      </div>
      <div className="rcm-horizontal-right right">
        <HueSaturationBrightnessPanel
          hidePanel={true}
          hsv={hsv}
          onColorUpdate={handleRawColorUpdate}
        />
        <Hr />
        <RedGreenBluePanel rgb={rgb} onColorUpdate={handleRawColorUpdate} />
        <Hr />
        <p className="rcm-horizontal-color-row">
          <InlineBox
            className="rcm-horizontal-swatch"
            style={{ backgroundColor: currentColor?.toHexString() }}
            onClick={handleClick}
          />
          <ColorInput
            color={currentColor}
            format={format}
            onColorUpdate={handleColorUpdate}
          />
          {children}
        </p>
      </div>
    </Wrapper>
  );
};
