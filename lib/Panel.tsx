import { forwardRef, HTMLAttributes } from "react";

import { classNames } from "./classNames";

export const PanelShadow = "0 1px 2px 0 rgba(34, 36, 38, 0.15)";
export const RaisedPanelShadow = "0 1px 7px 2px rgba(34, 36, 38, 0.15)";

export const BasePanel = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames("rcm-base-panel", className)}
    {...props}
  />
));
BasePanel.displayName = "BasePanel";

export const Panel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <BasePanel
      ref={ref}
      className={classNames("rcm-panel", className)}
      {...props}
    />
  ),
);
Panel.displayName = "Panel";

export const RaisedPanel = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <BasePanel
    ref={ref}
    className={classNames("rcm-raised-panel", className)}
    {...props}
  />
));
RaisedPanel.displayName = "RaisedPanel";
