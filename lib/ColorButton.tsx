import { ButtonHTMLAttributes, FC } from "react";

import { classNames } from "./classNames";
import { TinyColorInstance } from "./TinyColorInstance";

export interface ColorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** optional CSS class name */
  className?: string;
  /** color value */
  borderColor?: TinyColorInstance;
}

export const ColorButton: FC<ColorButtonProps> = (props) => {
  const { className, borderColor, children, style, ...rest } = props;

  return (
    <button
      className={classNames("rcm-color-button", "color-button", className)}
      style={{
        ...style,
        borderColor: borderColor ? borderColor.toHexString() : "#e0e1e2",
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
