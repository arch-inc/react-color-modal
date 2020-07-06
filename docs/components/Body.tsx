import React, { FC, useState } from "react";
import tinycolor from "tinycolor2";

import { ColorPanel, HorizontalColorPanel, Panel, ColorInput } from "../../";

export const Body: FC = () => {
  const [color, setColor] = useState<tinycolor.Instance>(tinycolor("#008c8c"));

  return (
    <div className="demo body">
      <style jsx>{`
        .demo.body > section {
          margin: 2em 0;
        }
        .demo.body > section > p {
          text-align: center;
        }
        .demo.body > section > p > code {
          font-weight: bold;
        }
        .demo.body > section:last-child {
          margin-bottom: 0;
        }
        .demo.body > section :global(> div) {
          margin: auto;
        }
        .demo.body > section :global(> div) {
          max-width: 480px !important;
        }
        .demo.body > section :global(> div.horizontal-color-panel) {
          max-width: 720px !important;
        }
      `}</style>
      <section>
        <p>
          <code>ColorPanel</code>
        </p>
        <ColorPanel color={color} onColorUpdate={setColor} />
      </section>
      <section>
        <p>
          <code>HorizontalColorPanel</code>
        </p>
        <HorizontalColorPanel color={color} onColorUpdate={setColor} />
      </section>
      <section>
        <p>
          <code>ColorInput</code>
        </p>
        <Panel>
          Selected color: <ColorInput color={color} onColorUpdate={setColor} />
        </Panel>
      </section>
    </div>
  );
};
