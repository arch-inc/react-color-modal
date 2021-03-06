import React, { FC, useCallback, useEffect, useState, useMemo } from "react";
import tinycolor, { ColorInputWithoutInstance } from "tinycolor2";
import styled from "styled-components";

import { ColorTextFormat, ColorTextFormats } from "./ColorTextFormats";
import { ColorInput } from "./ColorInput";
import { InlineBox } from "./InlineBox";
import { Hr } from "./Hr";
import { Panel, RaisedPanel } from "./Panel";
import { HueSaturationBrightnessPanel } from "./HueSaturationBrightnessPanel";
import { RedGreenBluePanel } from "./RedGreenBluePanel";

const StyledInlineBox = styled(InlineBox)`
  margin-right: 0.5em;
`;

const LeftDiv = styled.div`
  width: 256px;
  flex-grow: 0;
  padding-right: 20px;
  display: flex;
  align-items: center;
`;

const RightDiv = styled.div`
  min-width: 256px;
  flex-grow: 1;
`;

const StyledPanel = styled(Panel)`
  display: flexbox;
  flex-wrap: wrap;
`;

const StyledRaisedPanel = styled(RaisedPanel)`
  display: flexbox;
  flex-wrap: wrap;
`;

export interface HorizontalColorPanelProps {
  /** optional CSS class name */
  className?: string;
  /** whether this panel looks raised or not */
  raised?: boolean;
  /** color value */
  color?: tinycolor.Instance;
  /** called when color gets updated */
  onColorUpdate?(color: tinycolor.Instance): void;
}

export const HorizontalColorPanel: FC<HorizontalColorPanelProps> = ({
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

  const handleRawColorUpdate = useCallback(
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

  const Wrapper = useMemo(() => (raised ? StyledRaisedPanel : StyledPanel), [
    raised,
  ]);

  return (
    <Wrapper className={"horizontal-color-panel " + (className || "")}>
      <LeftDiv className="left">
        <HueSaturationBrightnessPanel
          hideSlider={true}
          hideInput={true}
          hsv={hsv}
          onColorUpdate={handleRawColorUpdate}
        />
      </LeftDiv>
      <RightDiv className="right">
        <HueSaturationBrightnessPanel
          hidePanel={true}
          hsv={hsv}
          onColorUpdate={handleRawColorUpdate}
        />
        <Hr />
        <RedGreenBluePanel rgb={rgb} onColorUpdate={handleRawColorUpdate} />
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
      </RightDiv>
    </Wrapper>
  );
};
