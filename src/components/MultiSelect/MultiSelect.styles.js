import styled from "styled-components";

export const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
export const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const StyledCheckbox = styled.div`
  font-family: "Libre Franklin";
  font-size: 20px;
  line-height: 18px;
  padding: 10px;
  border: 1px solid #fff;
  margin: 5px;
  cursor: pointer;
  color: ${(props) => (props.checked ? "rgb(34, 93, 165)" : "#fff")};
  background: ${(props) =>
    props.checked ? "#fff" : "background: rgb(34, 93, 165)"};
  user-select: none;
  transition: all 150ms;
  border-radius: 6px;
`;
