import styled from "styled-components";

export const Input = styled.input`
  padding: 0.3em;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 2px;
  font-size: 1.2em;

  & :focus {
    outline-color: rgba(34, 36, 38, 0.4);
  }
`;
