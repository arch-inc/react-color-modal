import React, { FC, useState } from "react";

import { Panel, ColorPanel, Hr } from "../../";

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
        label {
          font-weight: bold;
          margin-right: 0.5em;
        }
        span {
          display: inline-block;
          width: 1em;
          height: 1em;
          margin-bottom: -0.1em;
          border: 1px solid rgba(34, 36, 38, 0.15);
        }
      `}</style>
      <Panel className="panel-wrapper">
        <ColorPanel onColorUpdate={setColor} />
        {color && (
          <>
            <Hr />
            <p>
              <label>Selected color:</label>
              <span style={{ backgroundColor: color.toHexString() }} />{" "}
              <code>{color.toHexString()}</code>
            </p>
          </>
        )}
      </Panel>
    </div>
  );
};
