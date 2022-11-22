import { Button, Row, Select, Input, Col, Table, message } from "antd";
import apiHandler from "api";
import endpoint from "api/endpoint";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { StyledButton } from "theme/StyledComponents";
import AlertBoard from "containers/AlertBoard/AlertBoard";

const { Option } = Select;

export const StyledSelectLabel = styled.label`
  min-width: 110px !important;
  display: flex;
  justify-content: flex-start;
  margin-right: 10px !important;
  padding-top: 5px !important;
`;

const WizardStepTwo = () => {
  const [alertGroups, setAlertGroups] = useState([]);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedAlertGroup, setSelectedAlertGroup] = useState(alertGroups && alertGroups[0]?.id);
  const [selectedSubscription, setselectedSubscription] = useState(alertGroups && alertGroups[0]?.topicArn);
  const { authToken } = useSelector((state) => state.login);


  const [contactData, setContactData] = useState({});

  const [formErrors, setFormErrors] = useState({});

  const enrollParticipantData = useSelector(
    (state) => state.common.enrollParticipantData
  );

  const { editParticipantProfile } = useSelector(
    (state) => state.common
  );

  const { participantProfileData } = useSelector(
    (state) => state.participantProfileData
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  };

  const addNewContact = () => {
    let errrorObj = {};
    if(!contactData['firstName']){
      errrorObj['firstName'] = 'Please enter the first name';
    }
    else{
      errrorObj['firstName'] = '';
    }

    if(!contactData['lastName']){
      errrorObj['lastName'] = 'Please enter the last name';
    }
    else{
      errrorObj['lastName'] = '';
    }

    if(!contactData['mobilePhone']){
      errrorObj['mobilePhone'] = 'Please enter the phone number';
    }
    else{
      errrorObj['mobilePhone'] = '';
    }

    setFormErrors(errrorObj);

    if(!errrorObj['firstName'] && !errrorObj['lastName'] && !errrorObj['mobilePhone']){
      apiHandler({
        url: `${endpoint.ENROLL_PARTICIPANT}/${enrollParticipantData.id}/notificationContact`,
        method: "POST",
        data: contactData,
        authToken,
      }).then((result) => {
        console.log('message', result.data.message);
        message.success(result.data.message);
      });
    }
   
  };

  const populateAlertGroups = () => {
    enrollParticipantData?.agency?.id && apiHandler({
      url: `${endpoint.AGENCY_ALERT_LIST}/${enrollParticipantData?.agency?.id}`,
      authToken,
    }).then((result) => {
      setAlertGroups(result.data);
    });
  };

  const changeAlertGroup = (value) => {
    setSelectedAlertGroup(value);
  }

  const saveAlertGroup = () => {
    apiHandler({
      url: endpoint.ENROLL_PARTICIPANT,
      method: "POST",
      data: {
        id: enrollParticipantData.id,
        notificationList : {
          id : selectedAlertGroup
        }
      },
      authToken,
    }).then((result) => {
    });
  }

  const dataSource = [
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Alert Filters",
      dataIndex: "filter",
      key: "filter",
    },
    {
      title: "",
      dataIndex: "filterIcon",
      key: "filterIcon",
      align: 'center'
    },
  ];

  useEffect(() => {
    if(enrollParticipantData){
      populateAlertGroups();
    }
  }, [enrollParticipantData]);

  useEffect(() => {
      setSelectedAlertGroup(alertGroups && alertGroups[0]?.id);
      setselectedSubscription(alertGroups && alertGroups[0]?.topicArn);
      if(participantProfileData && participantProfileData.id && editParticipantProfile){
        setSelectedAlertGroup(participantProfileData && participantProfileData.notificationList.id);
      }
  }, [alertGroups]);

  useEffect(() => {
    if(selectedAlertGroup){
      apiHandler({
        // url: `${endpoint.AVAILABLE_CONTACTS}/${selectedAlertGroup}`,
        url: `${endpoint.AVAILABLE_CONTACTS}/${enrollParticipantData?.agency?.id}`,
        authToken,
      }).then((result) => {
        let contactsList = [];
        contactsList = result.data.map((obj) => {
          return {
            name : obj.fullName,
            email : obj.email,
            phone: obj.mobilePhone,
            role: obj.role,
            filter: obj.filter,
            filterIcon: <AlertBoard />
          }
        })
        setAvailableContacts(contactsList);
      });
      // console.log(alertGroups[0]?.topicArn)
      if(selectedSubscription){
        apiHandler({
          // url: `${endpoint.SUBSCRIPTIONS}/${selectedAlertGroup}/${selectedSubscription}`,
          url: `${endpoint.SUBSCRIPTIONS}/${enrollParticipantData?.agency?.id}/${selectedSubscription}`,
          authToken,
        }).then((result) => {
  
        });
      }
    }
  }, [selectedAlertGroup,selectedSubscription])

  useEffect(() => {
  }, []);

  return (
    <>
      <h2 style={{ marginTop: 30 }}>Manage Alert Notifications</h2>

      <Row style={{ marginTop: 50 }}>
        <StyledSelectLabel style={{ minWidth: "120px" }}>
          Manage Alert Group:{" "}
        </StyledSelectLabel>
        <Select
          className="enrollParticipantWizard"
          placeholder="Please select alert group"
          onChange={(e) => changeAlertGroup(e)}
          value={selectedAlertGroup}
        >
          {alertGroups?.map((obj) => {
            return <Option value={obj.id}>{obj.name}</Option>;
          })}
        </Select>
        <Button onClick={() => saveAlertGroup()} className="ml-4" type="primary">
          Save
        </Button>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Table scroll={{ y: 120 }} dataSource={availableContacts} columns={columns} pagination={false} />
      </Row>

      <Row style={{ marginTop: 50 }}>
        <label>Additional Alert Recipients</label>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Table scroll={{y: 80}} dataSource={dataSource} columns={columns} pagination={false} />
      </Row>

      <Row style={{ marginTop: 50 }}>
        <label>Add New Contact</label>
      </Row>
      <Row>
        <Col md={3} style={{ marginRight: 10 }}>
          <Input
            name="firstName"
            onChange={handleInputChange}
            placeholder="First Name"
          />
          <p style={{color: 'red'}}>{formErrors && formErrors['firstName']}</p>
        </Col>
        <Col md={3} style={{ marginRight: 10 }}>
          <Input
            name="lastName"
            onChange={handleInputChange}
            placeholder="Last Name"
          />
          <p style={{color: 'red'}}>{formErrors && formErrors['lastName']}</p>
        </Col>
        <Col md={3} style={{ marginRight: 10 }}>
          <Input
            name="role"
            onChange={handleInputChange}
            placeholder="Judge, Lawyer, Spouse etc"
          />
        </Col>
        <Col md={3} style={{ marginRight: 10 }}>
          <Input
            name="email"
            onChange={handleInputChange}
            placeholder="Email"
          />
        </Col>
        <Col md={3} style={{ marginRight: 10 }}>
          <Input
            name="mobilePhone"
            onChange={handleInputChange}
            placeholder="XXXX-XXXX-XXXX"
          />
          <p style={{color: 'red'}}>{formErrors && formErrors['mobilePhone']}</p>
        </Col>
        <Col md={3} style={{ marginRight: 10 }}>
          <StyledButton
            onClick={() => addNewContact()}
            externalCss={css`
              padding: 2px 20px;
              border-radius: 0;
              height: 32px;
            `}
          >
            Submit
          </StyledButton>
        </Col>
      </Row>
    </>
  );
};

export default WizardStepTwo;
