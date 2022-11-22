import React from "react";
import { useSelector } from "react-redux";
import { css } from "styled-components";
import InputAntd from "components/InputAntd/InputAntd";
import {
  StyledFullNameContainer,
  StyledFullNameSpan,
} from "theme/StyledComponents";
import { setError } from "features/error/errorSlice";

export const fullNameFieldCheck = (
  { firstname, middlename, lastname },
  dispatch
) => {
  if (firstname || middlename || lastname)
    dispatch(setError({ nameFieldError: null }));
  else {
    dispatch(setError({ nameFieldError: "Name is required!" }));
    return;
  }
};

const FullName = ({
  defaultValue = { firstName: "", middleName: "", lastName: "" },
}) => {
  const errorObj = useSelector((state) => state.error.errorObj);
  const { firstName, middleName, lastName } = defaultValue;

  return (
    <>
      <StyledFullNameContainer>
        <StyledFullNameSpan>Full Name (F/M/L): </StyledFullNameSpan>
        <InputAntd
          label="First Name"
          placeholder="Enter First Name"
          inputWidth="150px"
          hideLabel={true}
          required={false}
          externalcssinput={css`
            margin-right: 10px;
            margin-left: 10px;
          `}
          defaultValue={firstName}
        />{" "}
        <StyledFullNameSpan>/</StyledFullNameSpan>
        <InputAntd
          label="Middle Name"
          placeholder="Enter Middle Name"
          inputWidth="150px"
          hideLabel={true}
          required={false}
          externalcssinput={css`
            margin-right: 10px;
            margin-left: 10px;
          `}
          defaultValue={middleName}
        />{" "}
        <StyledFullNameSpan>/</StyledFullNameSpan>
        <InputAntd
          label="Last Name"
          placeholder="Enter Last Name"
          inputWidth="150px"
          hideLabel={true}
          required={false}
          externalcssinput={css`
            margin-left: 10px;
          `}
          defaultValue={lastName}
        />
      </StyledFullNameContainer>
      {errorObj?.nameFieldError && (
        <div
          style={{ marginTop: -20, textAlign: "center" }}
          className="ant-form-item-explain ant-form-item-explain-error"
        >
          {errorObj.nameFieldError}
        </div>
      )}
    </>
  );
};

export default FullName;
