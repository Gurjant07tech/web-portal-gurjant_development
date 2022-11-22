import { Form, Alert, Checkbox, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { StyledAppContainer, StyledButton } from "theme/StyledComponents";
import InputAntd from "components/InputAntd/InputAntd";
import authenticateUser from "api/auth";
import styleConstants from "theme/styleConstants";
import styled, { css } from "styled-components";
import Logo from "assets/logo.png";
import { useState } from "react";
import { setAgenciesDropDown } from "api/agencies";

export const StyledForm = styled(Form)`
  border: 1px solid #e5e5e5;
  padding: 75px 65px;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
    max-width: 100%;
    min-width: 100%;
    border: none;
  }
`;

export const StyledForgotPasswordLink = styled.a`
  float: left;
  margin-top: 5rem;
  color: #0557a2;
  font-weight: 600;
`;

const Login = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const errorObj = useSelector((state) => state.error.errorObj);
  const [showEmail, setShowEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordField, setPasswordField] = useState(true);

  const formData = useSelector((state) => state.formData.formDataObj);

  const handleLogin = () => {
    const { username, password } = formData;
    const authToken = "Basic " + window.btoa(username + ":" + password);
    authenticateUser.authenticate(authToken, dispatch).then(() => {
      setAgenciesDropDown(authToken, dispatch);
      history.push(props.location.state || "/caseload");
    });
  };

  return (
    <StyledAppContainer
      externalCss={css`
        height: 90vh;
        margin: 0 auto;
      `}
      maxWidth="500px"
    >
      <img
        style={{ cursor: "pointer", margin: "1rem auto" }}
        width="250"
        src={Logo}
        alt="Trac Solutions"
      />
      <h1 style={{ textAlign: "center" }}>Sign In</h1>
      {errorObj?.loginFailed && (
        <Alert
          closable
          message="Login failed. Invalid username or password."
          type="error"
          showIcon
          style={{ width: styleConstants.FORM_INPUT_WIDTH, marginBottom: 20 }}
        />
      )}
      <StyledForm
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
      >
        {showEmail && (
          <InputAntd
            label="Username"
            placeholder="Email"
            inputWidth="365px"
            hideLabel={true}
            externalcssinput={css`
              border-radius: 6px;
              min-height: 50px;
            `}
            required={true}
            formSource="login"
          />
        )}
        {showPassword && (
          <InputAntd
            label="Password"
            placeholder="Password"
            type={isPasswordField ? "password" : "text"}
            inputWidth="365px"
            hideLabel={true}
            externalcssinput={css`
              border-radius: 6px;
              min-height: 50px;
            `}
            required={true}
            formSource="login"
          />
        )}

        {showEmail && (
          <StyledButton
            type="primary"
            htmlType="button"
            size="large"
            externalCss={css`
              min-width: 100px;
              float: right;
              margin-top: 5rem;
              padding: 5px;
            `}
            onClick={() => {
              setShowEmail(false);
              setShowPassword(true);
            }}
          >
            Next
          </StyledButton>
        )}
        {showPassword && (
          <>
            <Checkbox onChange={() => setPasswordField(!isPasswordField)}>
              Show Password
            </Checkbox>
            <Row>
              <Col md={24}>
                <a href="/">Forgot Password?</a>
              </Col>
              <Col md={24}>
                <StyledButton
                  type="primary"
                  htmlType="submit"
                  size="large"
                  externalCss={css`
                    float: right;
                    margin-top: 5rem;
                    min-width: 100px;
                    padding: 5px;
                  `}
                >
                  Next
                </StyledButton>
              </Col>
            </Row>
          </>
        )}
      </StyledForm>
    </StyledAppContainer>
  );
};

export default Login;
