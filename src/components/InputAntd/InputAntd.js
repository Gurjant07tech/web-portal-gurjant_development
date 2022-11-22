import React from "react";
import { Form, Input } from "antd";
import styled from "styled-components";
import styleConstants from "theme/styleConstants";
import InputPhone from "components/InputPhone/InputPhone";
import "./InputAntd.custom.css";
import { useDispatch, useSelector } from "react-redux";
import { saveFormData } from "features/formData/formDataSlice";
import { saveEnrollParticipantFormData } from "features/enrollParticipant/enrollParticipantSlice";

const StyledInput = styled(Input)`
  width: ${({ inputWidth }) => inputWidth};
  ${({ externalcssinput }) => externalcssinput}
  @media (max-width: 768px) {
    min-width: 100%;
    width: 100%;
  }
`;

const StyledInputTextArea = styled(Input.TextArea)`
  width: ${({ inputWidth }) => inputWidth};
`;

const InputAntd = ({
  label,
  placeholder,
  helpText,
  textArea,
  required,
  inputWidth = styleConstants.FORM_INPUT_WIDTH,
  PrefixComponent,
  type,
  className,
  defaultValue,
  hideLabel,
  externalcssinput,
  countryCode,
  value,
  formSource = "enrollParticipant",
}) => {
  const dispatch = useDispatch();
  const fieldName = label && label.replace(/\s+/g, "").replace('*', '').toLowerCase();
  const formData = useSelector((state) => state.formData.formDataObj);
  const { enrollParticipantFormData } = useSelector(
    (state) => state.enrollParticipant
  );

  
  const wizardErrorObj = useSelector((state) => state.enrollWizardData.wizardErrorObj);

  const handleChange = (event) => {
    const { value } = event.target;
    if (formSource === "enrollParticipant") {
      dispatch(
        saveEnrollParticipantFormData({
          ...enrollParticipantFormData,
          [fieldName]: value,
        })
      );
    } else {
      dispatch(
        saveFormData({
          ...formData,
          [fieldName]: value,
        })
      );
    }
  };

  return (
    <><Form.Item
      label={!hideLabel && label}
      name={label.replace(/\s+/g, "").replace('*', '').toLowerCase()}
      help={helpText}
      initialValue={defaultValue}
      value={value}
      rules={[
        {
          required,
          message: `Please input your ${label}!`
        },
      ]}
    >
      {textArea ? (
        <StyledInputTextArea inputWidth={inputWidth} />
      ) : type === "phone" ? (
        <InputPhone
          inputWidth={inputWidth}
          countryCode={countryCode}
          required
          style={{border: wizardErrorObj[label.replace(/\s+/g, "").replace('*', '').toLowerCase()] && '1px solid red'}}
          mobilePhone={value} />
      ) : (
        <StyledInput
          className={className}
          style={{border: formSource !== 'login' && wizardErrorObj && wizardErrorObj[label.replace(/\s+/g, "").replace('*', '').toLowerCase()] && '1px solid red'}}
          placeholder={placeholder}
          inputWidth={inputWidth}
          onChange={handleChange}
          prefix={PrefixComponent && (
            <PrefixComponent className="site-form-item-icon" />
          )}
          defaultValue={value}
          value={value}
          required
          externalcssinput={externalcssinput}
          type={type} />
      )}
    </Form.Item><p style={{color: formSource !== 'login' && (wizardErrorObj && wizardErrorObj[label.replace(/\s+/g, "").replace('*', '').toLowerCase()] && 'red')}}>{(wizardErrorObj && wizardErrorObj[label.replace(/\s+/g, "").replace('*', '').toLowerCase()]) || ''}</p></>
  );
};

export default InputAntd;
