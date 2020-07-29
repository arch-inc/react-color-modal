import React, { FC, useState, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";

import { ColorTextFormat, ColorTextFormats } from "./ColorTextFormats";
import { Panel, RaisedPanel } from "./Panel";
import { Hr } from "./Hr";
import { BasicColorPanel } from "./BasicColorPanel";
import { InlineBox } from "./InlineBox";
import { ColorInput } from "./ColorInput";

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
  color?: tinycolor.Instance;
  /** called when color gets updated */
  onColorUpdate?(color: tinycolor.Instance): void;
}

export const ColorPanel: FC<ColorPanelProps> = ({
  className,
  raised,
  color,
  onColorUpdate,
  children,
}) => {
  const [currentColor, setCurrentColor] = useState<tinycolor.Instance>(color);
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
    (color: tinycolor.Instance) => {
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
