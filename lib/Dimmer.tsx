import React, { FC } from "react";
import styled from "styled-components";

export const DimmerDiv = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
`;

export interface DimmerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  background?: string;
}

export const Dimmer: FC<DimmerProps> = (props) => {
  const { background } = props;

  const props_ = { ...props } as any;
  delete props_.background;

  return <DimmerDiv style={{ background }} {...props_} />;
};
