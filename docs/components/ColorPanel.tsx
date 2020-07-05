import { FC, useState, useCallback } from "react";
import styled from "styled-components";

import { HueSlider } from "./HueSlider";
import { BrightnessSaturationPanel } from "./BrightnessSaturationPanel";

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
        <BrightnessSaturationPanel
          brightness={0.5}
          saturation={0.5}
          hue={hue}
        />
      </Panel>
      <HueSlider hue={hue} onHueChange={handleHueChange} />
    </div>
  );
};
