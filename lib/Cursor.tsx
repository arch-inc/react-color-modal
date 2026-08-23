import { FC } from "react";

import { classNames } from "./classNames";

export interface CursorProps {
  className?: string;
  x: number;
  y: number;
}

const cursorRadius = "12px";

function insetPosition(ratio: number): string {
  const percentage = Number((ratio * 100).toFixed(4));
  return `clamp(${cursorRadius}, ${percentage}%, calc(100% - ${cursorRadius}))`;
}

export const Cursor: FC<CursorProps> = ({ className, x, y }) => (
  <div
    className={classNames("rcm-cursor", "cursor", className)}
    style={{ top: insetPosition(y), left: insetPosition(x) }}
  >
    <span className="rcm-cursor-ring" />
  </div>
);
