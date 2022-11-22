import { StyledStarIcon } from "components/CustomDataTable/CustomDataTable.style";
import CustomDataTable from "../../../components/CustomDataTable/CustomDataTable";
import pinnedSvg from "assets/caseload/pinned.svg";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import apiHandler from "api";
import endpoint from "api/endpoint";
import moment from "moment";
import unPinnedSvg from "assets/caseload/notPinned.svg";
import { Row } from "antd";
import styled from "styled-components";
import { setSelectedEvents } from "features/common/commonSlice";

export const ReadButton = styled.button`
  background: #ffffff;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
  border-radius: 2px;
  margin-bottom: 10px;
  color: #000;
  padding: 5px 16px;
  cursor: pointer;
`;

const Events = () => {
  const { authToken } = useSelector((state) => state.login);
  const  dispatch = useDispatch()
  const startDate = moment().subtract(12, "months").format("YYYY-MM-DD");
  const [eventData, setEventData] = useState();
  const [eventsList, setEventsList] = useState([]);

  const activeHistoryTab = useSelector(
    (state) => state.common.activeHistoryTab
  );
  const activeParticipantId = useSelector(
    (state) => state.common.activeParticipantId
  );

  const { selectedEvents } = useSelector((state) => state.common);

  // const showLoader = useSelector((state) => state.showLoader);

  const pinEvent = (eventId, isPinned) => {
    // console.log('pin event', isPinned);
    apiHandler({
      url: endpoint.COMPLIANCE_EVENT,
      method: "POST",
      data: {
        isPinned,
        id: eventId,
      },
      authToken,
    }).then(async (result) => {
      const eventsData = eventData?.map((obj) => {
        if (obj.id === eventId) {
          obj.isPinned = !obj.isPinned;
        }
        return obj;
      });
      setEventData(eventsData);
    });
  };

  const getEvents = async () => {
    apiHandler({
      url:
        endpoint.ENROLL_PARTICIPANT +
        "/" +
        activeParticipantId +
        "/events/" +
        startDate,
      authToken,
    }).then(async (result) => {
      if (!result) return;
      let newEvents = await result.data?.map((obj) => {
        if (
          (!obj.isRead && moment().diff(moment(obj.receivedAt), "days") <= 7) ||
          (!obj.isRead &&
            obj.isPinned &&
            moment().diff(moment(obj.receivedAt), "days") <= 7) ||
          (obj.isPinned && moment().diff(moment(obj.receivedAt), "days") > 7)
        ) {
          return obj;
        } else {
          return "";
        }
      });
      newEvents = newEvents?.filter((obj) => {
        if (obj) return obj;
      });

      let data = [];
      data = newEvents?.map((obj, index) => {
        return {
          key: index,
          id: obj.id,
          eventType: obj.eventType.name,
          device: obj?.device?.serialNumber,
          isPinned: (
            <StyledStarIcon
              onClick={() => {
                pinEvent(obj.id, !obj.isPinned);
              }}
              key={index}
              src={obj.isPinned ? pinnedSvg : unPinnedSvg}
            ></StyledStarIcon>
          ),
          scheduled: (
            <>
              <p>{moment(obj.createdAt).format("MMM D, YYYY h:mm A z")}</p>
              <p>{moment(obj.receivedAt).format("MMM D, YYYY h:mm A z")}</p>
            </>
          ),
          status: obj.eventStatus,
        };
      });
      setEventsList(data);
    });
    dispatch(setSelectedEvents());
  };

  const columns = [
    {
      title: "Pinned",
      dataIndex: "isPinned",
      sorter: true,
    },
    {
      title: "Event Type",
      dataIndex: "eventType",
    },
    {
      title: "Device",
      dataIndex: "device",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Created At/ Received At",
      dataIndex: "scheduled",
    },
    {
      title: "Updated At",
      dataIndex: "scheduled",
    },
  ];

  const markAsRead = async() => {
    let eventsData = [];
    eventsData = selectedEvents.map((item) => {
      return {
        "id" : item,
        "isRead": true
      }
    });

    await apiHandler({
      url: endpoint.COMPLIANCE_EVENTS,
      method: "POST",
      data: eventsData,
      authToken,
    }).then(async (result) => {
      getEvents();
    })

  };

  useEffect(() => {
    if (!activeHistoryTab) {
      getEvents();
    }
  }, [activeHistoryTab]);

  useEffect(() => {
    dispatch(setSelectedEvents());
  }, []);

  return (
    <>
      <h2>New Events</h2>
      <Row>
        <ReadButton onClick={() => markAsRead()}>Mark as Read</ReadButton>
      </Row>
      <Row>
        <p style={{color: 'red', fontWeight: 600}}>Mark as Read removes events from this page but they will be viewable in the View History page.</p>
      </Row>
      <CustomDataTable
        showSelect={true}
        position={["bottomLeft"]}
        columns={columns}
        data={eventsList}
        tableSource="events"
        // showPagination={true}
      />
    </>
  );
};

export default Events;
