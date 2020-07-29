import React, { FC } from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  position: absolute;
  pointer-events: none;
`;

const StyledSpan = styled.span`
  position: relative;
  z-index: 5;
  display: block;
  top: -12px;
  left: -12px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: 3px solid #fff;
  box-sizing: border-box;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
`;

export interface CursorProps {
  className?: string;
  x: number;
  y: number;
}

export const Cursor: FC<CursorProps> = ({ className, x, y }) => (
  <StyledDiv
    className={"cursor " + (className || "")}
    style={{ top: `${y * 100}%`, left: `${x * 100}%` }}
  >
    <StyledSpan />
  </StyledDiv>
);
