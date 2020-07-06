import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import tinycolor from "tinycolor2";

import { Input } from "./Input";

export interface ColorInputProps {
  /** optional CSS class name */
  className?: string;
  /** whether this input is disabled or not */
  disabled?: boolean;
  /** color value */
  color?: tinycolor.Instance;
  /** called when color gets updated */
  onColorUpdate?(color: tinycolor.Instance): void;
}

export const ColorInput: FC<ColorInputProps> = ({
  className,
  disabled,
  color,
  onColorUpdate,
}) => {
  const [text, setText] = useState<string>(null);

  useEffect(() => {
    if (!color) {
      return;
    }
    setText(color.toHexString());
  }, [color]);

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
      className={className}
      disabled={disabled}
      value={text}
      onChange={handleValueChange}
    />
  );
};
