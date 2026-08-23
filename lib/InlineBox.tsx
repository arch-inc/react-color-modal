import { forwardRef, HTMLAttributes } from "react";

import { classNames } from "./classNames";

export const InlineBox = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={classNames("rcm-inline-box", className)}
    {...props}
  />
));
InlineBox.displayName = "InlineBox";
