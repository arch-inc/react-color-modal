import { FC, useState } from "react";
import { ColorPanel } from "./ColorPanel";

export const Body: FC = () => {
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
      `}</style>
      <div className="panel-wrapper">
        <ColorPanel />
      </div>
    </div>
  );
};
