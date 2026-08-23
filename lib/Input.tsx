import { forwardRef, InputHTMLAttributes } from "react";

import { classNames } from "./classNames";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={classNames("rcm-input", className)} {...props} />
));
Input.displayName = "Input";
