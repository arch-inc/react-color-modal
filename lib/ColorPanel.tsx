import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import tinycolor from "tinycolor2";

import { BasicColorPanel } from "./BasicColorPanel";
import { classNames } from "./classNames";
import { ColorInput } from "./ColorInput";
import { ColorTextFormat, ColorTextFormats } from "./ColorTextFormats";
import { Hr } from "./Hr";
import { Panel, RaisedPanel } from "./Panel";
import { TinyColorInstance } from "./TinyColorInstance";

export interface ColorPanelProps {
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

export const ColorPanel: FC<ColorPanelProps> = ({
  className,
  raised,
  color,
  onColorUpdate,
  children,
}) => {
  const [currentColor, setCurrentColor] = useState<TinyColorInstance>(color);
  const [format, setFormat] = useState<ColorTextFormat>("hex6");

  useEffect(() => {
    if (!color) {
      return;
    }
    setCurrentColor((current) =>
      tinycolor.equals(color, current) ? current : color,
    );
  }, [color]);

  const handleClick = useCallback(() => {
    setFormat(
      (current) =>
        ColorTextFormats[
          (ColorTextFormats.indexOf(current) + 1) % ColorTextFormats.length
        ],
    );
  }, []);

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

  const Wrapper = useMemo(() => (raised ? RaisedPanel : Panel), [raised]);

  return (
    <Wrapper className={classNames("color-panel", className)}>
      <BasicColorPanel color={currentColor} onColorUpdate={handleColorUpdate} />
      <Hr />
      <div
        className="rcm-color-panel-footer color-panel-footer"
        data-slot="footer"
      >
        <button
          aria-label="Change color text format"
          className="rcm-color-panel-swatch color-panel-swatch"
          data-slot="swatch"
          style={{ backgroundColor: currentColor?.toHexString() }}
          type="button"
          onClick={handleClick}
        />
        <ColorInput
          className="rcm-color-panel-input"
          color={currentColor}
          format={format}
          onColorUpdate={handleColorUpdate}
        />
        {children}
      </div>
    </Wrapper>
  );
};
