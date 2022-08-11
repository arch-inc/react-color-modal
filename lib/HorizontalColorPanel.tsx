import React, { FC, useCallback, useEffect, useState, useMemo } from "react";
import tinycolor, { ColorInputWithoutInstance } from "tinycolor2";
import styled from "styled-components";

import { TinyColorInstance } from "./TinyColorInstance";
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
  margin-right: 20px;
  display: flex;
  align-items: start;
  & .hsb-panel > div {
    margin-bottom: 0;
    height: 256px;
  }
`;

const RightDiv = styled.div`
  min-width: 256px;
  flex-grow: 1;
`;

const StyledPanel = styled(Panel)`
  display: flexbox;
  flex-wrap: nowrap;
  min-width: 564px;
`;

const StyledRaisedPanel = styled(RaisedPanel)`
  display: flexbox;
  flex-wrap: nowrap;
`;

export interface HorizontalColorPanelProps {
  /** optional CSS class name */
  className?: string;
  /** whether this panel looks raised or not */
  raised?: boolean;
  /** color value */
  color?: TinyColorInstance;
  /** called when color gets updated */
  onColorUpdate?(color: TinyColorInstance): void;
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
