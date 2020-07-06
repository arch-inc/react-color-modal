import React, { FC, useState } from "react";

import { Panel, ColorPanel, Hr, InlineBox, ColorInput } from "../../";

export const Body: FC = () => {
  const [color, setColor] = useState<tinycolor.Instance>(null);

  return (
    <div className="demo body">
      <style jsx>{`
        .demo.body :global(> .panel-wrapper) {
          max-width: 480px !important;
          margin: 2em auto 0 auto;
        }
        p {
          margin-top: 1em;
        }
        p > label {
          font-weight: bold;
          margin-right: 0.5em;
        }
        p :global(> span) {
          margin-right: 0.5em;
        }
      `}</style>
      <Panel className="panel-wrapper">
        <ColorPanel color={color} onColorUpdate={setColor} />
        {color && (
          <>
            <Hr />
            <p>
              <label>Selected color:</label>
              <InlineBox style={{ backgroundColor: color.toHexString() }} />
              <ColorInput color={color} onColorUpdate={setColor} />
            </p>
          </>
        )}
      </Panel>
    </div>
  );
};
