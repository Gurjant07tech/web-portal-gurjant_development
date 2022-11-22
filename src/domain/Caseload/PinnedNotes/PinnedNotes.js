import {
  StyledPinnedNotesBlock,
  StyledHeading,
  StyledItem,
  StyledInnerBlock,
  StyledCreateNewLink,
  StyledPinnedGreyText,
  StyledInputTextArea,
  StyledModal,
} from "./PinnedNotes.style";
import moment from "moment";
import { useEffect, useState } from "react";
import apiHandler from "api";
import { useDispatch, useSelector } from "react-redux";
import endpoint from "api/endpoint";
import PinnedNote from "assets/caseload/pinned.svg";
import EditIcon from "assets/caseload/EditIcon.svg";
import DeleteIcon from "assets/caseload/DeleteIcon.svg";
import UnpinnedNote from "assets/caseload/notPinned.svg";
import PlusCircle from "assets/PlusCircle.svg";
import { Row, Col } from "antd";
import "./PinnedNotesCustom.css";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { setPinnedNotesData } from "features/caseload/pinnedNotesSlice";

const PinnedNotes = ({participantId}) => {
  const dispatch = useDispatch();
  const startDate = moment().subtract(7, "months").format("YYYY-MM-DD");
  const { authToken } = useSelector((state) => state.login);
  const [pinnedNotesData, setPinnedNotes] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [message, setMessage] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState(0);
  const [editNoteId, setEditNoteId] = useState();
  const [messageError, setMessageError] = useState();
  // const [participantId, setParticipantId] = useState();

  const createNewNote = async () => {
    if(message.length > 100){
      setMessageError('Only 100 characters allowed');
    }
    else{
      setMessageError('');
    await apiHandler({
      url: `${endpoint.ENROLL_PARTICIPANT}/${participantId}/note`,
      method: "POST",
      data: {
        id: editNoteId || currentNoteId,
        isPinned,
        message,
      },
      authToken,
    });
    setModalVisible(false);
    getPinnedNotesData();
    setMessage("");
    setIsPinned(false);
    if (editNoteId) {
      setEditNoteId(null);
      setIsPinned(false);
    }
  }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if(value.length > 99){
      setMessageError('Only 100 characters allowed');
    }
    else{
      setMessageError('');
      setMessage(value);
      dispatch(setPinnedNotesData(pinnedNotesData));
    }
   
  };

  const getPinnedNotesData = async () => {
    const result = await apiHandler({
      url: `${endpoint.ENROLL_PARTICIPANT}/${participantId}/notes/${startDate}`,
      authToken,
    });

    const pinnedNotesList = result.data.filter((item) => (moment().diff(moment(item.submittedAt), 'days') <= 7 && item));

    setPinnedNotes(pinnedNotesList);
    dispatch(setPinnedNotesData(pinnedNotesList));
  };

  const pinnedNotesDataArr = useSelector(
    (state) => state.pinnedNotes.pinnedNotesObj
  );

  const {showHistoryDrawer} = useSelector(
    (state) => state.common
  );

  const updateNote = async (e, { id, message, isPinned }, editNote) => {
    // e.stopPropagation();
    await apiHandler({
      url: `${endpoint.ENROLL_PARTICIPANT}/${participantId}/note`,
      method: "POST",
      data: {
        id,
        isPinned: !isPinned,
        message,
      },
      authToken,
    });
    getPinnedNotesData();
    setMessage(message);
    if (editNote) {
      setIsPinned(isPinned);
      setEditNoteId(id);
    } else {
      setCurrentNoteId(id);
      setIsPinned(!isPinned);
    }
  };

  const editNote = (obj) => {
    console.log('Edit note', obj);
    setEditNoteId(obj.id);
    setMessage(obj.message);
    setIsPinned(obj.isPinned);
  }

  // useEffect(() => {
  //   setParticipantId(participantProfileData.id);
  // }, [participantProfileData]);

  useEffect(() => {
    if(participantId){
      getPinnedNotesData();
    }
   
  }, [participantId, showHistoryDrawer]);

  useEffect(() => {
    if (editNoteId > 0) {
      setModalVisible(true);
    }
  }, [editNoteId]);

  useEffect(() => {
    // if (currentNoteId > 0) {
    //   createNewNote();
    // }
  }, [currentNoteId]);

  return (
    <>
      <StyledPinnedNotesBlock>
        <Row>
          <Col md={8}>
            <StyledHeading>Notes</StyledHeading>
          </Col>
          <Col md={16}>
            <StyledCreateNewLink
              onClick={(e) => {
                // e.stopPropagation();
                setMessage('');
                setIsPinned(false);
                setModalVisible(true);
              }}
            >
              <img src={PlusCircle} alt="plusCircle" /> New Note
            </StyledCreateNewLink>
          </Col>
        </Row>

        <StyledInnerBlock>
          {pinnedNotesDataArr?.map(
            ({ id, submittedAt, submittedByName, message, isPinned }) => {
              return (
                <StyledItem key={id}>
                  <StyledPinnedGreyText>
                    @{submittedByName}
                  </StyledPinnedGreyText>
                  <p style={{overflowWrap: 'break-word'}}>{message}</p>
                  <StyledPinnedGreyText>
                    {submittedAt && moment(submittedAt).format("MM/DD/YYYY h:mm A z")}
                  </StyledPinnedGreyText>
                  <p>
                    <img
                      src={isPinned ? PinnedNote : UnpinnedNote}
                      alt={message}
                      onClick={(e) => updateNote(e, { id, message, isPinned })}
                    />
                    <img
                      src={EditIcon}
                      alt="editnote"
                      onClick={() =>
                        editNote({id, message, isPinned})
                      }
                    />
                    {/* <img alt="deletenote" src={DeleteIcon} /> */}
                  </p>
                </StyledItem>
              );
            }
          )}
        </StyledInnerBlock>
      </StyledPinnedNotesBlock>
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

export default PinnedNotes;
