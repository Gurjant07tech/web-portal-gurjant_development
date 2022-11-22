import { Row } from "antd";
import AddParticipant from "containers/EnrollParticipant/EnrollParticipant";
import ManageSchedule from "domain/EnrollParticipantWizard/ManageSchedule";
import React, { useState } from "react";

const WizardStepOne = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  return (
    <>
      {!showSchedule ? (
        <>
          <Row>
            <AddParticipant />
          </Row>
          {/* <Row>
            <Col md={16}>
              <h2>Schedule</h2>

              <Button onClick={() => setShowSchedule(true)} type="primary">
                Manage Schedule
              </Button>
            </Col>
          </Row>{" "} */}
        </>
      ) : (
        <ManageSchedule />
      )}
    </>
  );
};

export default WizardStepOne;
