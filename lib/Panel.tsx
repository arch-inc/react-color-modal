import styled from "styled-components";

export const PanelShadow = "0 1px 2px 0 rgba(34, 36, 38, 0.15)";
export const RaisedPanelShadow = "0 1px 7px 2px rgba(34, 36, 38, 0.15)";

export const BasePanel = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 7px;
  z-index: 101;
`;

export const Panel = styled(BasePanel)`
  box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
`;
export const RaisedPanel = styled(BasePanel)`
  box-shadow: 0 1px 7px 2px rgba(34, 36, 38, 0.15);
`;
