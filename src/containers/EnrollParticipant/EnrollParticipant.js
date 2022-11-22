import { Form, Col, Row, DatePicker, notification } from "antd";
import moment from "moment";
import apiHandler from "api";
import endpoint from "api/endpoint";
import { EnrollParticipant } from "api/enrollParticipant";
import { fullNameFieldCheck } from "components/FullName/FullName";
import InputAntd from "components/InputAntd/InputAntd";
import Loader from "components/Loader/Loader";
import SelectAntd from "components/SelectAntd/SelectAntd";
import SelectSearchAntd from "components/SelectSearchAntd/SelectSearchAntd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { css } from "styled-components";
import { StyledAppContainer } from "theme/StyledComponents";
import { getOffsetsTz, getUserTz } from "utils";
import { StyledDivider } from "./EnrollParticipant.styles";
import "./CollapseCustom.css";
import { saveEnrollParticipantFormData } from "features/enrollParticipant/enrollParticipantSlice";
import { setWizardErrorObj } from "features/enrollWizard/enrollWizardSlice";
import { setParticipantProfileData } from "features/caseload/participantProfileDataslice";
import { setEditParticipantProfile } from "features/common/commonSlice";

const AddParticipant = () => {
  const dispatch = useDispatch();
  const { authToken } = useSelector((state) => state.login);

  const { agencies, editParticipantProfile, drawerErrorMessage } = useSelector(
    (state) => state.common
  );

  const { enrollParticipantFormData } = useSelector(
    (state) => state.enrollParticipant
  );

  const { enrollParticipantData } = useSelector((state) => state.common);

  const { participantProfileData } = useSelector(
    (state) => state.participantProfileData
  );

  const [agencyAlertList, setAgencyAlertList] = useState([]);

  const agency = enrollParticipantFormData?.agency;

  const [selectedDate, setSelectedDate] = useState(moment());

  const participantType = [
    { name: "Unspecified", id: "Unspecified" },
    {
      name: "Condition of Bond",
      id: "Condition of Bond",
    },
    {
      name: "Conditional Discharge",
      id: "Conditional Discharge",
    },
    {
      name: "Count Supervision",
      id: "Count Supervision",
    },
    { name: "Demo", id: "Demo" },
    { name: "Diversion", id: "Diversion" },
    { name: "Parole", id: "Parole" },
    { name: "Pre-Trial", id: "Pre-Trial" },
    { name: "Probation", id: "Probation" },
    { name: "Volunteer", id: "Volunteer" },
  ];

  const offenseList = [
    { name: "Unspecified", id: "Unspecified" },
    {
      name: "Condition of Bond",
      id: "Condition of Bond",
    },
    {
      name: "Conditional Discharge",
      id: "Conditional Discharge",
    },
    {
      name: "Count Supervision",
      id: "Count Supervision",
    },
    { name: "Demo", id: "Demo" },
    { name: "Diversion", id: "Diversion" },
    { name: "Parole", id: "Parole" },
    { name: "Pre-Trial", id: "Pre-Trial" },
    { name: "Probation", id: "Probation" },
    { name: "Volunteer", id: "Volunteer" },
  ];

  const genderList = [
    { id: "M", name: "Male" },
    { id: "F", name: "Female" },
  ];

  const statesList = [
    { id: "AL", name: "Alabama" },
    { id: "AK", name: "Alaska" },
    { id: "AZ", name: "Arizona" },
    { id: "AR", name: "Arkansas" },
    { id: "CA", name: "California" },
    { id: "CO", name: "Colorado" },
    { id: "CT", name: "Connecticut" },
    { id: "DE", name: "Delaware" },
    { id: "DC", name: "Dist of Columbia" },
    { id: "FL", name: "Florida" },
    { id: "GA", name: "Georgia" },
    { id: "HI", name: "Hawaii" },
    { id: "ID", name: "Idaho" },
    { id: "IL", name: "Illinois" },
    { id: "IN", name: "Indiana" },
    { id: "IA", name: "Iowa" },
    { id: "KS", name: "Kansas" },
    { id: "KY", name: "Kentucky" },
    { id: "LA", name: "Louisiana" },
    { id: "ME", name: "Maine" },
    { id: "MD", name: "Maryland" },
    { id: "MA", name: "Massachusetts" },
    { id: "MI", name: "Michigan" },
    { id: "MN", name: "Minnesota" },
    { id: "MS", name: "Mississippi" },
    { id: "MO", name: "Missouri" },
    { id: "MT", name: "Montana" },
    { id: "NE", name: "Nebraska" },
    { id: "NV", name: "Nevada" },
    { id: "NH", name: "New Hampshire" },
    { id: "NJ", name: "New Jersey" },
    { id: "NM", name: "New Mexico" },
    { id: "NY", name: "New York" },
    { id: "NC", name: "North Carolina" },
    { id: "ND", name: "North Dakota" },
    { id: "OH", name: "Ohio" },
    { id: "OK", name: "Oklahoma" },
    { id: "OR", name: "Oregon" },
    { id: "PA", name: "Pennsylvania" },
    { id: "RI", name: "Rhode Island" },
    { id: "SC", name: "South Carolina" },
    { id: "SD", name: "South Dakota" },
    { id: "TN", name: "Tennessee" },
    { id: "TX", name: "Texas" },
    { id: "UT", name: "Utah" },
    { id: "VT", name: "Vermont" },
    { id: "VA", name: "Virginia" },
    { id: "WA", name: "Washington" },
    { id: "WV", name: "West Virginia" },
    { id: "WI", name: "Wisconsin" },
    { id: "WY", name: "Wyoming" },
  ];

  const onFinish = (values) => {
    // console.log("Success:", values);
    fullNameFieldCheck({ ...values }, dispatch);
    EnrollParticipant(enrollParticipantFormData, authToken);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    fullNameFieldCheck({ ...errorInfo.values }, dispatch);
  };

  const wizardErrorObj = useSelector(
    (state) => state.enrollWizardData.wizardErrorObj
  );

  const onDateChange = (date, dateString) => {
    dispatch(
      saveEnrollParticipantFormData({
        ...enrollParticipantFormData,
        birthdate: dateString,
      })
    );
    setSelectedDate(dateString);
  };

  const populateAgencyAlertList = (agencyId) =>
    
  agencyId && apiHandler({
      url: `${endpoint.AGENCY_ALERT_LIST}/${agencyId}`,
      authToken,
    }).then((result) => setAgencyAlertList(result?.data));

  useEffect(() => {
    // Populating initial drop down values and default value - Agency Alert List
    // populateAgencyAlertList(14);
    populateAgencyAlertList(agency);
  }, [agency]);

  useEffect(() => {
    dispatch(setWizardErrorObj({}));
    if (editParticipantProfile && participantProfileData) {
      dispatch(
        saveEnrollParticipantFormData({
          ...enrollParticipantFormData,
          firstname: participantProfileData?.firstName,
          lastname: participantProfileData?.lastName,
          middlename: participantProfileData?.middleName,
          mobilephone: participantProfileData?.mobilePhoneUnformatted,
          agency: participantProfileData?.agency?.id,
          participanttype: participantProfileData?.participantType,
          timezone: participantProfileData?.timeZone,
          aka: participantProfileData?.aka,
          offense: participantProfileData?.offense,
          email: participantProfileData?.email,
          casenumber: participantProfileData?.caseNumber,
          driverslicense: participantProfileData?.driversLicense,
          address: participantProfileData?.address?.address1,
          apartment: participantProfileData?.address?.address2,
          city: participantProfileData?.address?.city,
          state: participantProfileData?.address?.state,
          zip: participantProfileData?.address?.zip,
          occupation: participantProfileData?.occupation,
          birthdate:
            participantProfileData?.birthDate ?? moment().format("YYYY-MM-DD"),
          gender: participantProfileData?.gender,
          height: participantProfileData?.height > 0 ? participantProfileData?.height : '',
          weight: participantProfileData?.weight > 0 ? participantProfileData?.weight : '',
          eyecolor: participantProfileData?.eyeColor,
          haircolor: participantProfileData?.hairColor,
          ethnicity: participantProfileData?.ethnicity,
          id: participantProfileData?.id,
        })
      );
    }

    if (
      enrollParticipantData &&
      enrollParticipantData.id &&
      !editParticipantProfile
    ) {
      dispatch(setEditParticipantProfile(true));
      dispatch(setParticipantProfileData(enrollParticipantData));
      dispatch(
        saveEnrollParticipantFormData({
          ...enrollParticipantFormData,
          id: enrollParticipantData.id,
        })
      );
    }

    if (!editParticipantProfile && enrollParticipantData.length === 0) {
      dispatch(
        saveEnrollParticipantFormData({
          ...enrollParticipantFormData,
          birthdate: moment().format("YYYY-MM-DD"),
        })
      );
    }
  }, []);

  if (agencyAlertList.length === 0) return <Loader />;

  return (
    <StyledAppContainer maxWidth="100%">
      {drawerErrorMessage &&
        notification.info({
          description: drawerErrorMessage,
          placement: "topRight",
        })}
      <Form name="basic"
        labelCol={{
          span: 32,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row>
          <Col md={8}>
            <h2>Enroll Participant</h2>
          </Col>
        </Row>
        <StyledDivider />
        <Row>
          <Col md={6}>
            <SelectAntd
              label="Agency"
              required={true}
              placeholder="Select Agency"
              optionsArr={agencies}
              defaultValue={
                editParticipantProfile
                  ? participantProfileData?.agency?.id
                  : undefined
              }
              width="300px"
              pageKey="enroll"
            />
          </Col>
          <Col md={6}>
            <SelectAntd
              label="Participant Type*"
              placeholder="Select Participant Type"
              optionsArr={participantType}
              width="300px"
              pageKey="enroll"
              required={true}
            />
          </Col>
          <Col md={6}>
            <SelectSearchAntd
              label="Time Zone"
              optionsArr={getOffsetsTz()}
              defaultValue={getUserTz()}
              width="300px"
              pageKey="enroll"
            />
          </Col>
          <Col md={6}>
            <InputAntd
              inputWidth="300px"
              type="phone"
              required={true}
              label="Mobile Phone*"
              value={
                (editParticipantProfile &&
                  participantProfileData?.mobilePhone) ||
                ""
              }
              className="cs_h"
            />
          </Col>
        </Row>

        <Row>
          <Col md={6} style={{ marginTop: "20px" }}>
            <InputAntd
              inputWidth="300px"
              required={true}
              label="First Name"
              placeholder="First Name"
              value={
                editParticipantProfile ? participantProfileData?.firstName : ""
              }
            />
          </Col>
          <Col md={6} style={{ marginTop: "20px" }}>
            <InputAntd
              inputWidth="300px"
              label="Middle Name"
              placeholder="Middle Name"
              value={
                editParticipantProfile ? participantProfileData?.middleName : ""
              }
            />
          </Col>
          <Col md={6} style={{ marginTop: "20px" }}>
            <InputAntd
              inputWidth="300px"
              required={true}
              className="mt-3"
              label="Last Name"
              placeholder="Last Name"
              value={
                editParticipantProfile ? participantProfileData?.lastName : ""
              }
            />
          </Col>
          <Col md={6} style={{ marginTop: "20px" }}>
            <InputAntd
              inputWidth="300px"
              label="A.K.A"
              value={editParticipantProfile ? participantProfileData?.aka : ""}
            />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <SelectAntd
              label="Offense"
              placeholder="Offense"
              optionsArr={offenseList}
              required
              width="300px"
              value={
                editParticipantProfile ? participantProfileData?.offense : ""
              }
            />
          </Col>
          <Col md={6}>
            <InputAntd
              inputWidth="300px"
              label="Case Number"
              placeholder="Case Number"
              value={
                editParticipantProfile ? participantProfileData?.caseNumber : ""
              }
            />
          </Col>
          <Col md={6}>
            <InputAntd
              inputWidth="300px"
              label="Email"
              placeholder="Email"
              value={
                editParticipantProfile ? participantProfileData?.email : ""
              }
            />
          </Col>
          <Col md={6}>
            <InputAntd
              inputWidth="300px"
              label="Driver's License"
              placeholder="Driver's License Number"
              value={
                editParticipantProfile
                  ? participantProfileData?.driversLicense
                  : ""
              }
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} style={{ marginTop: "20px" }}>
            <InputAntd
              inputWidth="250px"
              label="Address"
              placeholder="Address"
              value={
                editParticipantProfile
                  ? participantProfileData?.address?.address1
                  : ""
              }
            />
          </Col>
          <Col md={5} style={{ marginTop: "20px" }}>
            <InputAntd
              inputWidth="250px"
              label="Apartment"
              // hideLabel={true}
              placeholder="Apt/Suite"
              value={
                editParticipantProfile
                  ? participantProfileData?.address?.address2
                  : ""
              }
            />
          </Col>
          <Col md={5} style={{ marginTop: "20px" }}>
            <InputAntd
              inputWidth="250px"
              label="City"
              placeholder="City"
              // hideLabel={true}
              value={
                editParticipantProfile
                  ? participantProfileData?.address?.city
                  : ""
              }
            />
          </Col>
          <Col md={5} style={{ marginTop: "20px" }}>
            <SelectAntd
              label="State"
              placeholder="Select State"
              optionsArr={statesList}
              width="250px"
              // hideLabel={true}
            />
          </Col>
          <Col md={4} style={{ marginTop: "20px" }}>
            <InputAntd
              inputWidth="250px"
              label="Zip"
              placeholder="Zip"
              // hideLabel={true}
              value={
                editParticipantProfile
                  ? participantProfileData?.address?.zip
                  : ""
              }
            />
          </Col>
          <Col md={2} />
        </Row>
        <Row>
          <Col md={5}>
            <InputAntd
              inputWidth="250px"
              label="Occupation"
              value={
                editParticipantProfile ? participantProfileData?.occupation : ""
              }
            />
          </Col>
          <Col md={5}>
            <label>Date of Birth:</label>
            <DatePicker
              label="Birthdate*"
              style={{
                width: "250px",
                marginTop: "5px",
              }}
              allowClear={false}
              value={
                moment(selectedDate) ||
                (participantProfileData?.birthDate
                  ? moment(participantProfileData?.birthDate)
                  : moment())
              }
              onChange={onDateChange}
            />
            <p
              style={{
                color: wizardErrorObj && wizardErrorObj["birthdate"] && "red",
              }}
            >
              {wizardErrorObj && wizardErrorObj["birthdate"]}
            </p>
          </Col>
          <Col md={5}>
            <SelectAntd
              label="Gender"
              placeholder="Select Gender"
              optionsArr={genderList}
              width="250px"
              pageKey="enroll"
            />
          </Col>
          <Col md={5}>
            <InputAntd
              inputWidth="250px"
              label="Height"
              value={
                editParticipantProfile ? participantProfileData?.height > 0 && participantProfileData?.height: ""
              }
            />
          </Col>
          <Col md={4}>
            <InputAntd
              inputWidth="250px"
              label="Weight"
              value={
                editParticipantProfile ? participantProfileData?.weight > 0 && participantProfileData?.weight : ""
              }
            />
          </Col>
          <Col md={2} />
        </Row>
        <Row>
          <Col md={5}>
            <InputAntd
              inputWidth="250px"
              label="Hair Color"
              placeholder="Hair Color"
              value={
                editParticipantProfile ? participantProfileData?.hairColor : ""
              }
            />
          </Col>
          <Col md={5}>
            <InputAntd
              inputWidth="250px"
              label="Eye Color"
              placeholder="Eye Color"
              value={
                editParticipantProfile ? participantProfileData?.eyeColor : ""
              }
            />
          </Col>
          <Col md={5}>
            <InputAntd
              inputWidth="250px"
              label="Ethnicity"
              placeholder="Ethnicity"
              value={
                editParticipantProfile ? participantProfileData?.ethnicity : ""
              }
            />
          </Col>
          <Col md={2} />
        </Row>
      </Form>
    </StyledAppContainer>
  );
};

export default AddParticipant;
