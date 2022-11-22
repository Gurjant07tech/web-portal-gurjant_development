import React, { useState } from "react";
import { Select } from "antd";
import styled from "styled-components";

import { saveEnrollParticipantFormData } from "features/enrollParticipant/enrollParticipantSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

export const StyledSelect = styled(Select)`
  width: ${(props) => (props.width ? props.width : "450px")} !important;
  ${(props) => props.externalcssinput}
`;

export const StyledSelectLabel = styled.label`
  width: 200px;
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 36px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
`;

export const StyledRequiredSelectLabel = styled.label`
  width: 200px;
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 36px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;

  &::before{
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
`;

const SelectAntd = ({
  label,
  placeholder,
  optionsArr,
  defaultValue,
  width,
  hideLabel,
  externalcssinput,
  required
}) => {
  const dispatch = useDispatch();

  const fieldName = label && label.replace(/\s+/g, "").replace('*', '').toLowerCase();

  
  const { enrollParticipantFormData } = useSelector(
    (state) => state.enrollParticipant
  );

  const [selectedValue, setSelectedValue] = useState(enrollParticipantFormData[fieldName]);

  const wizardErrorObj = useSelector((state) => state.enrollWizardData.wizardErrorObj);

  const handleSelect = (title) => {
    dispatch(
      saveEnrollParticipantFormData({
        ...enrollParticipantFormData,
        [fieldName]: title,
      })
    );
    setSelectedValue(title);
  };


  return (
    <>
      {!hideLabel ? (required === true ? <StyledRequiredSelectLabel>{label}</StyledRequiredSelectLabel> : <StyledSelectLabel>{label}</StyledSelectLabel>
      ) : ''}
      <StyledSelect
        placeholder={placeholder}
        onChange={handleSelect}
        allowClear
        width={width}
        style={{border: wizardErrorObj && wizardErrorObj[label.replace(/\s+/g, "").replace('*', '').toLowerCase()] && '1px solid red'}}
        externalcssinput={externalcssinput}
        value={selectedValue || defaultValue}
        required={required}
      >
        {optionsArr?.map(({ name, id }) => (
          <Option value={id}>{name}</Option>
        ))}
      </StyledSelect>
      <p style={{color:(wizardErrorObj && wizardErrorObj[label.replace(/\s+/g, "").replace('*', '').toLowerCase()]) && 'red', marginTop: 10}}>{(wizardErrorObj && wizardErrorObj[label.replace(/\s+/g, "").replace('*', '').toLowerCase()]) || ''}</p>
    </>
  );
};

export default SelectAntd;
