import { FC } from "react";

import { classNames } from "./classNames";

export interface CursorProps {
  className?: string;
  x: number;
  y: number;
}

export const Cursor: FC<CursorProps> = ({ className, x, y }) => (
  <div
    className={classNames("rcm-cursor", "cursor", className)}
    style={{ top: `${y * 100}%`, left: `${x * 100}%` }}
  >
    <span className="rcm-cursor-ring" />
  </div>
);
