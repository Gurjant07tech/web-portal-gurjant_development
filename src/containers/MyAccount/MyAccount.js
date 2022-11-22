import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "antd";
import { StyledAppContainer } from "theme/StyledComponents";
import UserPermission from "domain/MyAccount/UserPermission/UserPermission";
import UserPreference from "domain/MyAccount/UserPreference/UserPreference";
import UserIdentity from "domain/MyAccount/UserIdentity/UserIdentity";
import { postWebsiteUserData } from "api/myAccount";
import { fullNameFieldCheck } from "components/FullName/FullName";

const MyAccount = () => {
  const dispatch = useDispatch();
  const { userData, authToken } = useSelector((state) => state.login);
  const { fullName } = userData;

  const onFinish = (values) => {
    console.log("Success:", values);
    fullNameFieldCheck({ ...values }, dispatch);
    postWebsiteUserData(values, authToken, dispatch);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    fullNameFieldCheck({ ...errorInfo.values }, dispatch);
  };

  return (
    <StyledAppContainer>
      <h1>Website User</h1>
      <h3>Edit: ACTIVE Agency Administrator: {fullName}</h3>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <UserIdentity />
        <UserPreference />
        <UserPermission />
        <div>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button type="secondary" style={{ marginLeft: 20 }}>
            Cancel
          </Button>
        </div>
      </Form>
    </StyledAppContainer>
  );
};

export default MyAccount;
