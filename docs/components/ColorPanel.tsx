import { FC, useState, useCallback } from "react";
import { HueSlider } from "./HueSlider";
import { BrightnessSaturationPanel } from "./BrightnessSaturationPanel";
import styled from "styled-components";

const Panel = styled.div`
  margin-bottom: 5px;
`;

export interface ColorPanelResultIface {
  color: string;
}

export interface ColorPanelProps {
  width?: string;
}

export const ColorPanel: FC<ColorPanelProps> = ({ width }) => {
  const [hue, setHue] = useState<number>(0);

  const handleHueChange = useCallback((h) => {
    setHue(h);
  }, []);

  return (
    <div
      className="color-panel"
      style={{
        width: width || "100%",
      }}
    >
      <Panel>
        <BrightnessSaturationPanel hue={hue} />
      </Panel>
      <HueSlider hue={hue} onHueChange={handleHueChange} />
    </div>
  );
};
