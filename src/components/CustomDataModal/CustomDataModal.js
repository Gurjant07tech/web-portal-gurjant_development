import Modal from "antd/lib/modal/Modal";
import ManageNotifications from "domain/Caseload/ParticipantProfile/ModalContent/ManageNotifications";
import ManageProgram from "domain/Caseload/ParticipantProfile/ModalContent/ManageProgram";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  border-radius: 10px;
`;

const CustomDataModal = ({
  visible,
  activeBlock,
  agencyId,
  modalTitle,
  modalWidth,
  setModalVisible,
  assignedDevices,
  participantId,
  topicArn1,
  topicArn2,
}) => {
  const renderModalComponent = () => {
    // eslint-disable-next-line default-case
    switch (activeBlock) {
      case "ManageNotifications":
        return (
          <ManageNotifications
            topicArn1={topicArn1}
            topicArn2={topicArn2}
            agencyId={agencyId}
          />
        );

      case "ManageProgram":
        return (
          <ManageProgram
            assignedDevices={assignedDevices}
            agencyId={agencyId}
            participantId={participantId}
          />
        );
    }
  };
  return (""
    // <StyledModal
    //   title={modalTitle}
    //   centered
    //   visible={visible}
    //   width={modalWidth}
    //   onCancel={() => setModalVisible(false)}
    //   wrapClassName={`ManageDataModal`}
    // >
    //   {renderModalComponent(agencyId)}
    // </StyledModal>
  );
};

export default CustomDataModal;
