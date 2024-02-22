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
import { InlineBox } from "./InlineBox";
import { Panel, RaisedPanel } from "./Panel";
import { TinyColorInstance } from "./TinyColorInstance";

const StyledInlineBox = styled(InlineBox)`
  margin-right: 0.5em;
`;

const P = styled.p`
  margin: 0;
  padding: 0;
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
    setCurrentColor(color);
  }, [color]);

  const handleClick = useCallback(() => {
    setFormat(
      ColorTextFormats[
        (ColorTextFormats.indexOf(format) + 1) % ColorTextFormats.length
      ]
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
    [onColorUpdate]
  );

  const Wrapper = useMemo(() => (raised ? RaisedPanel : Panel), [raised]);

  return (
    <Wrapper className={"color-panel " + (className || "")}>
      <BasicColorPanel color={color} onColorUpdate={handleColorUpdate} />
      <Hr />
      <P>
        <StyledInlineBox
          style={{ backgroundColor: color.toHexString() }}
          onClick={handleClick}
        />
        <ColorInput
          color={color}
          format={format}
          onColorUpdate={handleColorUpdate}
        />
        {children}
      </P>
    </Wrapper>
  );
};
