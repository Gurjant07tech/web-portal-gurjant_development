import { Col, Collapse, Row, Space, Spin, Tooltip } from "antd";
import styled, { css } from "styled-components";
import { StyledButton } from "theme/StyledComponents";
import BatteryIcon from "assets/caseload/Battery.svg";
import infoCircleIcon from "assets/caseload/InfoCircle.svg";
import ScheduleIcon from "assets/caseload/Schedule.svg";
import TamperIcon from "assets/caseload/Tamper.svg";
import ConnectivityIcon from "assets/caseload/Connectivity.svg";
import ParticipantProfileDefaultPic from "assets/caseload/participant-default-pic.png";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setParticipantProfileData } from "features/caseload/participantProfileDataslice";
import Events from "../Events/Events";
import PinnedNotes from "../PinnedNotes/PinnedNotes";
import {
  setActiveParticipant,
  setEditParticipantProfile,
  setEnrollParticipantData,
  setHistoryStartDate,
  showEnrollParticipant,
  showHistoryDrawer,
  showLoader,
  showMessageDrawer,
} from "features/common/commonSlice";
import { setWizardStep } from "features/enrollWizard/enrollWizardSlice";
import apiHandler from "api";
import endpoint from "api/endpoint";
import moment from "moment";

import ManageZones from "../ManageZones/ManageZones";
import ManageSchedule from "../ManageSchedule/ManageSchedule";

const StyledDataList = styled.ul`
  list-style: none;
`;
const StyledDataListItem = styled.li`
  font-family: Aileron-Regular;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 18px;
  margin: 20px 0;

  &:first-child {
    margin: 0;
  }
`;

const StyledIconList = styled.ul`
  list-style: none;
  display: inline;
`;

export const StyledSpace = styled(Space)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  font-size: 20px;
  font-weight: bold;
`;

const StyledIconListItem = styled.li`
  float: left;
  display: inline-block;
  height: 45px;
  margin: 10px 10px 10px 0px;
  background: ${(props) => props.color};
  border-radius: 6px;
  padding: 10px;
  width: 48px;
  text-align: center;
`;

const { Panel } = Collapse;

const ParticipantProfile = () => {
  const [participantData, setParticipantData] = useState([]);

  const { authToken } = useSelector((state) => state.login);
  const { activeParticipantId } = useSelector((state) => state.common);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const profileIcons = [
    { icon: infoCircleIcon, color: "#1A8917", title: "Info Circle" },
    { icon: ConnectivityIcon, color: "#1A8917", title: "Connectivity" },
    { icon: BatteryIcon, color: "#FF0033", title: "Battery" },
    { icon: ScheduleIcon, color: "#1A8917", title: "Calendar" },
    { icon: TamperIcon, color: "#FF0033", title: "Shield" },
  ];

  const [panelOpen, setPanelOpen] = useState(false);

  const openPanel = (e) => {
    // e.stopPropogation();
    setPanelOpen(!panelOpen);
  };

  useEffect(() => {
    setLoading(true);
    apiHandler({
      url: `${endpoint.ENROLL_PARTICIPANT}/${activeParticipantId}
        `,
      authToken,
    }).then((result) => {
      setParticipantData(result.data);
      dispatch(setParticipantProfileData?.(result.data));
      dispatch(setHistoryStartDate(moment(result?.data?.latestProgram?.activationDate)));
      setLoading(false);
    });
  }, []);

  if(loading){
    return <StyledSpace><Spin size={"large"} /></StyledSpace>
  }

  return (
    <>
      {/* <Row>
        <Col md={12}>
          <StyledIconList>
            {profileIcons.map(({ icon, color, title }) => {
              return (
                <Tooltip
                  placement="bottom"
                  title={title}
                  color="#c4c4c4"
                  key={Math.random() * 99}
                >
                  <StyledIconListItem color={color}>
                    <img src={icon} alt="icon" />
                  </StyledIconListItem>
                </Tooltip>
              );
            })}
          </StyledIconList>
        </Col>
      </Row> */}
      <Row>
        <Col md={2}>
          <img
            src={
              participantData?.participantProfileImage
                ? participantData?.participantProfileImage
                : ParticipantProfileDefaultPic
            }
            width="80"
            height="100"
            alt="placeholder"
          />
        </Col>
        <Col md={8}>
          <StyledDataList>
            <StyledDataListItem>{`Name: ${
              participantData?.fullName ?? ""
            }`}</StyledDataListItem>
            <StyledDataListItem>{`AKA: ${
              participantData?.firstName ?? ""
            }`}</StyledDataListItem>
            <StyledDataListItem>{`Phone Number: ${
              participantData?.mobilePhone ?? ""
            }`}</StyledDataListItem>
          </StyledDataList>
        </Col>
        <Col md={8}>
          <StyledDataList>
            <StyledDataListItem>{`Time Zone: ${
              participantData?.timeZone ?? ""
            }`}</StyledDataListItem>
            <StyledDataListItem>{`Client Type: ${
              participantData?.clientType ?? ""
            }`}</StyledDataListItem>
            <StyledDataListItem>{`Offense: ${
              participantData?.offense ?? ""
            }`}</StyledDataListItem>
          </StyledDataList>
        </Col>
        <Col md={6}>
          <StyledButton
            externalCss={css`
              padding: 10px 20px;
              float: right;
            `}
            onClick={(e) => {
              dispatch(setEditParticipantProfile(true));
              dispatch(setActiveParticipant(participantData?.id));
              dispatch(setEnrollParticipantData(participantData));
              dispatch(showEnrollParticipant(true));
              // if (currentStep < 0 || !currentStep) {
              dispatch(setWizardStep(0));
              // }
            }}
          >
            Edit Profile/Manage Program
          </StyledButton>
          <StyledButton
            externalCss={css`
              background: #fff;
              border: 1px solid #0557a2;
              color: #0557a2;
              padding: 10px;
              margin: 15px 0px;
              display: flex;
              justify-content: flex-end;
              float: right;
            `}
            onClick={(e) => {
              // e.stopPropagation();
              dispatch(showHistoryDrawer(true));
              dispatch(setHistoryStartDate(moment(participantData?.latestProgram?.activationDate)))
            }}
          >
            View History/Reports
          </StyledButton>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <StyledButton
            externalCss={css`
              background: #fff;
              border: 1px solid #0557a2;
              color: #0557a2;
              padding: 10px;
              margin: 15px 5px;
            `}
            onClick={() => {
              dispatch(showMessageDrawer(true));
            }}
          >
            Send Message 
          </StyledButton>
          <ManageZones />
          <ManageSchedule />
        </Col>
      </Row>
      <Row className="participantProfileCollapse">
        <Collapse
          destroyInactivePanel
          defaultActiveKey={["0"]}
          onChange={(e) => openPanel(e)}
        >
          <Panel
            forceRender={true}
            header={panelOpen ? "Show Less" : "Show More"}
            key="1"
          >
            <Row>
              <Col md={8}>
                <StyledDataList>
                  <StyledDataListItem>
                    {`Address: ${[
                      participantData?.address?.address1,
                      participantData?.address?.address2,
                      participantData?.address?.city,
                      participantData?.address?.state,
                      participantData?.address?.zip,
                    ]
                      .filter(Boolean)
                      .join(", ")}`}
                  </StyledDataListItem>
                  <StyledDataListItem>
                    {`Birth Date: ${
                      (participantData?.birthDate &&
                        moment(participantData?.birthDate).format(
                          "DD-MM-YYYY"
                        )) ??
                      ""
                    }`}
                  </StyledDataListItem>
                  <StyledDataListItem>
                    Email : {participantData?.email}
                  </StyledDataListItem>
                  <StyledDataListItem>
                    Alt. Phone Number : {participantData?.altPhone ?? ""}
                  </StyledDataListItem>
                </StyledDataList>
              </Col>
              <Col md={8}>
                <StyledDataList>
                  <StyledDataListItem>
                    Drivers License Number:{" "}
                    {participantData?.driversLicense ?? ""}
                  </StyledDataListItem>
                  <StyledDataListItem>
                    Occupation: {participantData?.occupation ?? ""}
                  </StyledDataListItem>
                  <StyledDataListItem>
                    Gender: {participantData?.gender ?? ""}
                  </StyledDataListItem>
                  <StyledDataListItem>
                    Ethnicity: {participantData?.ethnicity ?? ""}
                  </StyledDataListItem>
                </StyledDataList>
              </Col>
              <Col md={8}>
                <StyledDataList>
                  <StyledDataListItem>
                    Height: {participantData?.height ?? ""}
                  </StyledDataListItem>
                  <StyledDataListItem>
                    Weight: {participantData?.weight ?? ""}
                  </StyledDataListItem>
                  <StyledDataListItem>
                    Hair Color: {participantData?.hairColor ?? ""}
                  </StyledDataListItem>
                  <StyledDataListItem>
                    Eye Color: {participantData?.eyeColor ?? ""}
                  </StyledDataListItem>
                </StyledDataList>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </Row>
      <Row>
        <Col md={18}>
          <Events />
        </Col>
        <Col md={6}>
          <PinnedNotes participantId={participantData?.id} />
        </Col>
      </Row>
    </>
  );
};

export default ParticipantProfile;
