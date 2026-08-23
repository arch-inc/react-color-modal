import { forwardRef, HTMLAttributes } from "react";

import { classNames } from "./classNames";

export const InputGroups = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames("rcm-input-groups", className)}
    {...props}
  />
));
InputGroups.displayName = "InputGroups";
