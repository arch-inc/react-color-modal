import styled from "styled-components";

export const InputGroups = styled.div`
  display: flex;
  margin: 0.5em 0;
  & > .input.group {
    margin-right: 0.5em;
    flex-grow: 1;
  }
  & > .input.group:last-child {
    margin-right: 0;
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
