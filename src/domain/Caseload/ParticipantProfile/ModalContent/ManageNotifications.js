import { Collapse, Input, Row, Select, Col } from "antd";
import "./ModalContent.css";
import styled, { css } from "styled-components";
import { StyledButton } from "theme/StyledComponents";
import { useEffect, useState } from "react";
import apiHandler from "api";
import endpoint from "api/endpoint";
import { useSelector } from "react-redux";
import axios from "axios";
const { Option } = Select;
const { Panel } = Collapse;

export const StyledSelectLabel = styled.label`
  min-width: 110px !important;
  display: flex;
  justify-content: flex-end;
  margin-right: 10px !important;
  padding-top: 5px !important;
`;

export const StyledContactItem = styled.div`
  border-bottom: 1px solid #c4c4c4;
  width: 100%;
  padding: 10px 20px;
`;

const ManageNotifications = ({ agencyId, topicArn1, topicArn2 }) => {
  const [availableContacts, setAvailableContacts] = useState([]);
  const [alertGroups, setAlertGroups] = useState([]);
  const { authToken } = useSelector((state) => state.login);
  const [subscriptionsList, setSubscriptionsList] = useState([]);

  const populateAvailableContacts = () => {
    apiHandler({
      url: `${endpoint.AVAILABLE_CONTACTS}/${agencyId}`,
      authToken,
    }).then((result) => {
      setAvailableContacts(result.data);
    });
  };

  const populateAlertGroups = () => {
    agencyId && apiHandler({
      url: `${endpoint.AGENCY_ALERT_LIST}/${agencyId}`,
      authToken,
    }).then((result) => {
      setAlertGroups(result.data);
    });
  };

  const populateSubscriptions = () => {
    axios
      .all([
        topicArn1 &&
          apiHandler({
            url: endpoint.SUBSCRIPTIONS + "/" + agencyId + "/" + topicArn1,
            authToken,
          }),
        topicArn2 &&
          apiHandler({
            url: endpoint.SUBSCRIPTIONS + "/" + agencyId + "/" + topicArn2,
            authToken,
          }),
      ])
      .then(
        axios.spread((subscriptions1, subscriptions2) => {
          const final = [].concat(subscriptions1?.data, subscriptions2?.data);
          setSubscriptionsList(final);
        })
      );
  };

  useEffect(() => {
    populateAvailableContacts();
    populateAlertGroups();
    populateSubscriptions();
  }, []);

  return (
    <>
      <Row>
        <StyledSelectLabel style={{ minWidth: "120px" }}>
          Alert Group:
        </StyledSelectLabel>
        <Select placeholder="Please select alert group">
          {alertGroups?.map((obj) => {
            return <Option value={obj.id}>{obj.name}</Option>;
          })}
        </Select>
      </Row>
      <Row>
        <StyledSelectLabel style={{ minWidth: "120px" }}>
          Existing Contact:{" "}
        </StyledSelectLabel>
        <Select placeholder="Please select existing contact">
          {availableContacts?.map((obj) => {
            return <Option value={obj.id}>{obj.fullName}</Option>;
          })}
        </Select>
      </Row>
      <Collapse ghost defaultActiveKey={["1"]}>
        <Panel forceRender={true} header={"Add New Contact"} key="1">
          <Row>
            <StyledSelectLabel style={{ minWidth: "120px" }}>
              Full Name:{" "}
            </StyledSelectLabel>
            <Input placeholder="Last, first Middle" />
          </Row>
          <Row>
            <StyledSelectLabel style={{ minWidth: "120px" }}>
              Role:{" "}
            </StyledSelectLabel>
            <Input placeholder="Judge, Lawyer, Spouse etc" />
          </Row>
          <Row>
            <StyledSelectLabel style={{ minWidth: "120px" }}>
              Email:{" "}
            </StyledSelectLabel>
            <Input placeholder="Email" />
          </Row>
          <Row>
            <StyledSelectLabel style={{ minWidth: "120px" }}>
              Phone No:{" "}
            </StyledSelectLabel>
            <Input placeholder="XXXX-XXXX-XXXX" />
          </Row>
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <StyledButton
              externalCss={css`
                padding: 10px 20px;
                border-radius: 0;
              `}
            >
              Submit
            </StyledButton>
          </Row>
        </Panel>
      </Collapse>
      <Row>
        {subscriptionsList &&
          subscriptionsList?.map((obj) => {
            return (
              <StyledContactItem>
                <Col md={24}>{obj.endpoint}</Col>
              </StyledContactItem>
            );
          })}
      </Row>
    </>
  );
};

export default ManageNotifications;
