import React from "react";
import {
  StyledCheckbox,
  HiddenCheckbox,
  CheckboxContainer,
} from "./MultiSelect.styles";

const MultiSelect = ({
  className,
  val,
  style_tag_val,
  checked,
  handleCheckboxChange,
}) => {
  return (
    <CheckboxContainer className={className}>
      <HiddenCheckbox checked={checked} onChange={handleCheckboxChange} />
      <StyledCheckbox checked={checked}>{val || style_tag_val}</StyledCheckbox>
    </CheckboxContainer>
  );
};

export default MultiSelect;
