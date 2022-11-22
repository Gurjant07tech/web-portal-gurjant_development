import { Col, DatePicker, Drawer, Row, Space } from "antd";
import {
  setActiveHistoryTab,
  setHistoryStartDate,
  showHistoryDrawer,
} from "features/common/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { useEffect } from "react";
import EventHistory from "./EventHistory";
import BreathalyzerTestHistory from "./BreathalyzerHistory";
import MessageHistory from "./MessageHistory";
import NotesHistory from "./NotesHistory";
import GlossaryTermsDrawer from "./GlossaryTermsDrawer";
import GpsHistory from "./GpsHistory";
import styled from "styled-components";
import CamHistory from "./CamHistory";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

export const GlossaryButton = styled.button`
  background: #ffffff;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
  border-radius: 2px;
  color: #000;
  padding: 5px 16px;
  cursor: pointer;
`;

const HistoryDrawer = () => {
  const dispatch = useDispatch();
  const showDrawer = useSelector((state) => state.common.showHistoryDrawer);
  const activeHistoryTab = useSelector(
    (state) => state.common.activeHistoryTab
  );

  const historyStartDate = useSelector((state) => state.common.historyStartDate);

  const { userData } = useSelector((state) => state.login);

  const onClose = () => {
    if (activeHistoryTab === "glossary") {
      dispatch(setActiveHistoryTab("events"));
    } else {
      dispatch(showHistoryDrawer(false));
      dispatch(setActiveHistoryTab(""));
      dispatch(setHistoryStartDate(moment()));
    }
  };

  const handleChange = (value) => {
    dispatch(setActiveHistoryTab(value));
  };

  const { participantProfileData } = useSelector(
    (state) => state.participantProfileData
  );

  const setStartDate = (value) => {
    dispatch(setHistoryStartDate(value[0]));
  }

  useEffect(() => {
    if (!activeHistoryTab) {
      dispatch(setActiveHistoryTab("events"));
    }
    if(!historyStartDate){
      setHistoryStartDate(moment());
    }
  }, []);

  return (
    <Drawer
      destroyOnClose
      title={
        <Row>
          <Col span={8}>
            {"View History - " + participantProfileData?.fullName}
          </Col>
          <Col span={12}></Col>
          <Col span={4}>
            <GlossaryButton
              type="default"
              onClick={() => handleChange("glossary")}
            >
              Glossary of Terms
            </GlossaryButton>
          </Col>
        </Row>
      }
      _
      placement="right"
      size="large"
      onClose={onClose}
      visible={showDrawer}
    >
      <div className="container">
        {activeHistoryTab !== "glossary" && (
          <Row>
            <Col span={12}>
              <Select
                className="historyDropdown"
                defaultValue="events"
                style={{ width: 280, height: 32 }}
                onChange={handleChange}
              >
                <Option value="events">Event History</Option>
                <Option value="breathalyzer">TRAC Breath Test History</Option>
                {userData.websiteUserType.isSuperUser && (
                  <Option value="cam">TRAC Watch Alcohol Reading History</Option>
                )}
                <Option value="violation">Violation History</Option>
                <Option value="notes">Notes History</Option>
                <Option value="message">Message History</Option>
                <Option value="gpshistory">GPS History</Option>
              </Select>
            </Col>
            <Col
              span={12}
              style={{
                display: "flex",
                justifyContent: "end",
                marginBottom: "10px",
              }}
            >
              <Space direction="vertical" size={12}>
                <RangePicker
                  defaultValue={[historyStartDate, moment()]}
                  onCalendarChange={(v) => setStartDate(v)}
                  disabled={[false, true]}
                  style={{ width: 280, float: "right" }}
                />
              </Space>
            </Col>
          </Row>
        )}

        {activeHistoryTab === "events" && <EventHistory />}
        {activeHistoryTab === "breathalyzer" && <BreathalyzerTestHistory />}
        {activeHistoryTab === "cam" && <CamHistory />}
        {activeHistoryTab === "notes" && <NotesHistory />}
        {activeHistoryTab === "message" && <MessageHistory />}
        {activeHistoryTab === "glossary" && <GlossaryTermsDrawer />}
        {activeHistoryTab === "gpshistory" && <GpsHistory />}
      </div>
    </Drawer>
  );
};

export default HistoryDrawer;
