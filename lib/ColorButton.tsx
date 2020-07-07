import React, { FC } from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";

const StyledButton = styled.button`
  /* size */
  display: inline-block;
  min-height: 1em;
  margin: 0 0.25em 0 0;
  padding: 0.6875em 1.5em 0.6875em;
  outline: 0;
  border: 5px solid #e0e1e2;

  /* text */
  vertical-align: baseline;
  line-height: 1em;
  text-align: center;
  text-decoration: none;
  font-weight: 700;

  /* color */
  border-radius: 0.25rem;
  box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34, 36, 38, 0.15) inset;
  background-color: #e0e1e2;
  color: rgba(0, 0, 0, 0.6);

  /* interaction */
  user-select: none;
  cursor: pointer;

  & :hover {
    background-color: #babbbc;
    color: rgba(0, 0, 0, 0.8);
  }
`;

export interface ColorButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  /** optional CSS class name */
  className?: string;
  /** color value */
  borderColor?: tinycolor.Instance;
}

export const ColorButton: FC<ColorButtonProps> = (props) => {
  const { className, borderColor, children } = props;

  const props_ = { ...props } as any;
  delete props_.className;
  delete props_.borderColor;
  delete props_.children;

  return (
    <StyledButton
      className={"color-button " + (className || "")}
      style={{
        borderColor: borderColor ? borderColor.toHexString() : "#e0e1e2",
      }}
      {...props_}
    >
      {children}
    </StyledButton>
  );
};
