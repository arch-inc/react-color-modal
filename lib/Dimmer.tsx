import { FC, forwardRef, HTMLAttributes } from "react";

import { classNames } from "./classNames";

export const DimmerDiv = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={classNames("rcm-dimmer", className)} {...props} />
));
DimmerDiv.displayName = "DimmerDiv";

export interface DimmerProps extends HTMLAttributes<HTMLDivElement> {
  background?: string;
}

export const Dimmer: FC<DimmerProps> = (props) => {
  const { background, style, ...rest } = props;
  return <DimmerDiv style={{ ...style, background }} {...rest} />;
};
