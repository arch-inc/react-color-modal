import styled from "styled-components";

export const InputGroups = styled.div`
  display: flex;
  & > .input.group {
    padding: 0.5em 0.5em 0.5em 0;
  }
  & > .input.group > label {
    padding-right: 0.3em;
    font-weight: bold;
  }
  & > .input.group > label > .range {
    font-weight: normal;
    color: rgba(34, 36, 38, 0.4);
  }
`;
