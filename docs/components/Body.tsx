import { FC, useState } from "react";
import { ColorPanel } from "./ColorPanel";

export const Body: FC = () => {
  const [color, setColor] = useState<tinycolor.Instance>(null);

  return (
    <div className="demo body">
      <style jsx>{`
        .panel-wrapper {
          max-width: 480px;
          background: #fff;
          margin: 10px auto;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
        }
        p {
          margin-top: 1em;
        }
        span {
          display: inline-block;
          width: 1em;
          height: 1em;
          margin-bottom: -0.1em;
          border: 1px solid rgba(34, 36, 38, 0.15);
        }
      `}</style>
      <div className="panel-wrapper">
        <ColorPanel onColorUpdate={setColor} />
        {color && (
          <p>
            Selected color:{" "}
            <span style={{ backgroundColor: color.toHexString() }} />{" "}
            <code>{color.toHexString()}</code>
          </p>
        )}
      </div>
    </div>
  );
};
