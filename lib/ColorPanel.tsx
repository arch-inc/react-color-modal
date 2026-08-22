import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";

import { BasicColorPanel } from "./BasicColorPanel";
import { ColorInput } from "./ColorInput";
import { ColorTextFormat, ColorTextFormats } from "./ColorTextFormats";
import { Hr } from "./Hr";
import { Panel, RaisedPanel } from "./Panel";
import { TinyColorInstance } from "./TinyColorInstance";

const Swatch = styled.button`
  margin-right: 0.5em;
  font: inherit;
  flex: 0 0 auto;
  width: var(--color-panel-control-height);
  height: 100%;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
  padding: 0;
  user-select: none;

  &:focus-visible {
    outline: 2px solid rgba(34, 36, 38, 0.55);
    outline-offset: 2px;
  }
`;

const Footer = styled.div`
  --color-panel-control-height: 2.208em;

  display: flex;
  align-items: stretch;
  height: var(--color-panel-control-height);
  margin: 0;
  padding: 0;
`;

const StyledColorInput = styled(ColorInput)`
  box-sizing: border-box;
  flex: 1 1 auto;
  height: 100%;
  min-width: 0;
`;

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
    <Wrapper className={"color-panel " + (className || "")}>
      <BasicColorPanel color={currentColor} onColorUpdate={handleColorUpdate} />
      <Hr />
      <Footer className="color-panel-footer" data-slot="footer">
        <Swatch
          aria-label="Change color text format"
          className="color-panel-swatch"
          data-slot="swatch"
          style={{ backgroundColor: currentColor?.toHexString() }}
          type="button"
          onClick={handleClick}
        />
        <StyledColorInput
          color={currentColor}
          format={format}
          onColorUpdate={handleColorUpdate}
        />
        {children}
      </Footer>
    </Wrapper>
  );
};
