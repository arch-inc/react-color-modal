import React, { FC, useState } from "react";
import tinycolor from "tinycolor2";

import { ColorPanel } from "../../";

export const Body: FC = () => {
  const [color, setColor] = useState<tinycolor.Instance>(tinycolor("#008c8c"));

  return (
    <div className="demo body">
      <style jsx>{`
        .demo.body :global(> .color-panel) {
          max-width: 480px !important;
          margin: 2em auto 0 auto;
        }
      `}</style>
      <ColorPanel color={color} onColorUpdate={setColor} />
    </div>
  );
};
