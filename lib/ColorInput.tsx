import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import tinycolor from "tinycolor2";

import { Input } from "./Input";
import { ColorTextFormat } from "./ColorTextFormats";

export interface ColorInputProps {
  /** optional CSS class name */
  className?: string;
  /** whether this input is disabled or not */
  disabled?: boolean;
  /** color value */
  color?: tinycolor.Instance;
  /** color text format */
  format?: ColorTextFormat;
  /** called when color gets updated */
  onColorUpdate?(color: tinycolor.Instance): void;
}

export const ColorInput: FC<ColorInputProps> = ({
  className,
  disabled,
  color,
  format = "hex6",
  onColorUpdate,
}) => {
  const [text, setText] = useState<string>(null);

  useEffect(() => {
    if (!color) {
      return;
    }
    setText(color.toString(format));
  }, [color, format]);

  const handleValueChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const { value } = ev.target;
      const col = tinycolor(value);
      if (col.isValid()) {
        onColorUpdate && onColorUpdate(col);
      }
      setText(value);
    },
    [onColorUpdate]
  );

  return (
    <Input
      className={"color-input " + (className || "")}
      disabled={disabled}
      value={text || ""}
      onChange={handleValueChange}
    />
  );
};
