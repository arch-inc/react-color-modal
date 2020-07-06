import React, { FC, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";

import { ColorTextFormat, ColorTextFormats } from "./ColorTextFormats";
import { Panel } from "./Panel";
import { Hr } from "./Hr";
import { BasicColorPanel } from "./BasicColorPanel";
import { InlineBox } from "./InlineBox";
import { ColorInput } from "./ColorInput";

const StyledInlineBox = styled(InlineBox)`
  margin-right: 0.5em;
`;

export interface ColorPanelProps {
  /** optional CSS class name */
  className?: string;
  /** color value */
  color?: tinycolor.Instance;
  /** called when color gets updated */
  onColorUpdate?(color: tinycolor.Instance): void;
}

export const ColorPanel: FC<ColorPanelProps> = ({
  className,
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

  return (
    <Panel className={"color-panel " + (className || "")}>
      <BasicColorPanel color={color} onColorUpdate={handleColorUpdate} />
      <Hr />
      <p>
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
      </p>
    </Panel>
  );
};
