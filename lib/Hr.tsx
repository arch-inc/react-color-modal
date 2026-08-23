import { forwardRef, HTMLAttributes } from "react";

import { classNames } from "./classNames";

export const Hr = forwardRef<HTMLHRElement, HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={classNames("rcm-hr", className)} {...props} />
  ),
);
Hr.displayName = "Hr";
