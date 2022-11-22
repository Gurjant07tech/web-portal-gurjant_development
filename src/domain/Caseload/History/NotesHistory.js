import CustomDataTable from "../../../components/CustomDataTable/CustomDataTable";
import moment from "moment";
import { useEffect, useState } from "react";
import apiHandler from "api";
import { useSelector } from "react-redux";
import endpoint from "api/endpoint";
import EditIcon from "assets/caseload/EditIcon.svg";
import PinnedNote from "assets/caseload/pinned.svg";
import UnpinnedNote from "assets/caseload/notPinned.svg";
import DownloadTableButton from "components/DownloadTableButton/DownloadTableButton";
import { Col, Row } from "antd";
import {
  StyledInputTextArea,
  StyledModal,
} from "../PinnedNotes/PinnedNotes.style";
import Checkbox from "antd/lib/checkbox/Checkbox";

const NotesHistory = () => {
  const columns = [
    {
      title: "Pinned",
      dataIndex: "isPinned",
      width: '10%'
    },
    {
      title: "Note",
      dataIndex: "note",
      width: '40%'
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: '25%'
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      width: '25%'
    },
  ];

  const csvHeaders = [
    {
      label: "Pinned",
      key: "isPinned",
    },
    {
      label: "Note",
      key: "note",
    },
    {
      label: "Created At",
      key: "createdAt",
    },
    {
      label: "Created By",
      key: "createdBy",
    },
  ];

  const { historyStartDate } = useSelector((state) => state.common);

  const { authToken } = useSelector((state) => state.login);

  const [NotesHistoryData, setNotesHistoryData] = useState();

  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(0);
  const [editNoteId, setEditNoteId] = useState();
  const [messageError, setMessageError] = useState();
  const [isPinned, setIsPinned] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    if(value.length > 99){
      setMessageError('Only 100 characters allowed');
    }
    else{
      setMessageError('');
      setMessage(value);
      // dispatch(setPinnedNotesData(pinnedNotesData));
    }
   
  };


  const { participantProfileData } = useSelector(
    (state) => state.participantProfileData
  );

  const editNote = (obj) => {
    console.log('Edit note', obj);
    setEditNoteId(obj.id);
    setMessage(obj.message);
    setIsPinned(obj.isPinned);
  }

  useEffect(() => {
    apiHandler({
      url:
        endpoint.ENROLL_PARTICIPANT +
        "/" +
        participantProfileData?.id +
        "/notes/" +
        (historyStartDate.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD")),
      authToken,
    }).then((result) => {
      setNotesHistoryData(result.data);
    });
  }, [historyStartDate]);

  useEffect(() => {
    if (editNoteId > 0) {
      setModalVisible(true);
    }
  }, [editNoteId]);

  const updateNote = async (e, { id, message, isPinned }, editNote) => {
    // e.stopPropagation();
    await apiHandler({
      url: `${endpoint.ENROLL_PARTICIPANT}/${participantProfileData?.id}/note`,
      method: "POST",
      data: {
        id,
        isPinned: !isPinned,
        message,
      },
      authToken,
    }).then((result) => {
      apiHandler({
        url:
          endpoint.ENROLL_PARTICIPANT +
          "/" +
          participantProfileData?.id +
          "/notes/" +
          (historyStartDate.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD")),
        authToken,
      }).then((result) => {
        setNotesHistoryData(result.data);
      });
    });
  };

  
  const createNewNote = async () => {
    if(message.length > 100){
      setMessageError('Only 100 characters allowed');
    }
    else{
    setMessageError('');
    await apiHandler({
      url: `${endpoint.ENROLL_PARTICIPANT}/${participantProfileData?.id}/note`,
      method: "POST",
      data: {
        id: editNoteId || currentNoteId,
        isPinned,
        message,
      },
      authToken,
    });
    setModalVisible(false);
    // getPinnedNotesData();
    setMessage("");
    setIsPinned(false);
    if (editNoteId) {
      setEditNoteId(null);
      setIsPinned(false);
    }

    apiHandler({
      url:
        endpoint.ENROLL_PARTICIPANT +
        "/" +
        participantProfileData?.id +
        "/notes/" +
        (historyStartDate.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD")),
      authToken,
    }).then((result) => {
      setNotesHistoryData(result.data);
    });
  }
  };

  const data = [];
  const csvData = [];
  NotesHistoryData?.map(({ id, submittedAt, submittedByName, message, isPinned }, index) => {
    data.push({
      key: index,
      isPinned: (
        <><img
          onClick={(e) => updateNote(e, { id, message, isPinned })}
          src={isPinned ? PinnedNote : UnpinnedNote}
          alt={isPinned}
          style={{ cursor: 'pointer' }} />
          <img
            src={EditIcon}
            style={{marginLeft : 10, cursor: 'pointer'}}
            alt="editnote"
            onClick={() => editNote({ id, message, isPinned })} /></>
      ),
      note: message,
      createdAt: (
        <>
          <p>{moment(submittedAt).format("MMM D, YYYY h:mm A z")}</p>
        </>
      ),

      createdBy: submittedByName,
    });

    csvData.push({
      isPinned: isPinned,
      note: message,
      createdAt: moment(submittedAt).format("MMM D, YYYY h:mm A z"),
      createdBy: submittedByName,
    });
  });

  return (
    <>
      <Row>
        <Col span={8}>
          <h2>Notes History</h2>
        </Col>
        <Col span={12}>{/* <h2>Events History</h2> */}</Col>
        <Col span={4}>
          <DownloadTableButton csvData={csvData} headers={csvHeaders} />
        </Col>
      </Row>
      <CustomDataTable
        position={["bottomRight"]}
        columns={columns}
        data={data}
        showPagination={true}
      />
       <StyledModal
        title="New Note"
        centered
        width="270px"
        visible={modalVisible}
        okText="Save"
        cancelText="Cancel"
        onOk={(e) =>{ createNewNote()}}
        onCancel={(e) => { setModalVisible(false)}}
        wrapClassName="pinnedNotesModal"
      >
        <StyledInputTextArea
          onChange={(e) => {
            // e.stopPropagation();
            handleChange(e);
          }}
         
          autoSize={true}
          rows={5}
          maxLength={100}
          value={message}
        />
        <p className="text-danger">{messageError}</p>
        <Checkbox
          checked={isPinned}
         
          onChange={(e) => {
            // e.stopPropagation();
            setIsPinned(!isPinned);
          }}
        >
          Pin this note
        </Checkbox>
      </StyledModal>
    </>
  );
};

export default NotesHistory;
