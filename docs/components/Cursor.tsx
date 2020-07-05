import { FC } from "react";
import styled from "styled-components";

const CursorWrapper = styled.div`
  position: absolute;
  pointer-events: none;
`;

const CursorContent = styled.span`
  position: relative;
  z-index: 5;
  display: block;
  top: -10px;
  left: -10px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 3px solid #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
`;

interface CursorProps {
  x: number;
  y: number;
}

export const Cursor: FC<CursorProps> = ({ x, y }) => (
  <CursorWrapper style={{ top: `${y * 100}%`, left: `${x * 100}%` }}>
    <CursorContent />
  </CursorWrapper>
);
