import React from "react";
import { useSelector } from "react-redux";
import { Col, Collapse, Row, Checkbox } from "antd";
import InputAntd from "components/InputAntd/InputAntd";

const { Panel } = Collapse;

const UserPreference = () => {
  const { userData } = useSelector((state) => state.login);
  const {
    address: { address1, address2, address3, city, state, zip },
    email,
    notifyViaEmail,
    mobilePhone,
    notifyViaMobilePhoneText,
    altPhone,
    notifyViaAltPhoneText,
    sendDailyReports,
    mobileCountryCode,
    altCountryCode,
  } = userData;

  return (
    <Collapse style={{ margin: "30px 0" }}>
      <Panel header="Contact and Notification Preferences" key="2">
        <div style={{ textAlign: "center" }}>Address</div>
        <InputAntd label="Line 1" required={false} defaultValue={address1} />
        <InputAntd label="Line 2" required={false} defaultValue={address2} />
        <InputAntd label="Line 3" required={false} defaultValue={address3} />
        <InputAntd label="City" required={false} defaultValue={city} />
        <InputAntd label="State" required={false} defaultValue={state} />
        <InputAntd label="Zip" required={false} defaultValue={zip} />
        <Row>
          <Col md={4}></Col>
          <Col md={12}>
            <InputAntd
              label="Email"
              required={false}
              inputWidth="300px"
              defaultValue={email}
            />
          </Col>
          <Col>
            <Checkbox checked={notifyViaEmail} onChange={null}>
              Send Email Notification
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col md={4}></Col>
          <Col md={12}>
            <InputAntd
              label="Mobile Phone"
              placeholder="Enter Mobile Phone"
              type="phone"
              defaultValue={mobilePhone}
              countryCode={mobileCountryCode}
              inputWidth="300px"
            />
          </Col>
          <Col>
            <Checkbox checked={notifyViaMobilePhoneText} onChange={null}>
              Send Text Notification
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col md={4}></Col>
          <Col md={12}>
            <InputAntd
              label="Alt Phone"
              required={false}
              type="phone"
              inputWidth="300px"
              className="ant-form-item-label"
              countryCode={altCountryCode}
              defaultValue={altPhone}
            />
          </Col>
          <Col>
            <Checkbox checked={notifyViaAltPhoneText} onChange={null}>
              Send Text Notification
            </Checkbox>
          </Col>
        </Row>
        <div style={{ textAlign: "center" }}>
          <Checkbox checked={sendDailyReports} onChange={null}>
            Send Daily Reports
          </Checkbox>
        </div>
      </Panel>
    </Collapse>
  );
};

export default UserPreference;
