import CustomDataTable from "../../../components/CustomDataTable/CustomDataTable";
import { StyledStarIcon } from "components/CustomDataTable/CustomDataTable.style";
import moment from "moment";
import { useEffect, useState } from "react";
import apiHandler from "api";
import { useSelector } from "react-redux";
import endpoint from "api/endpoint";
import pinnedSvg from "assets/caseload/pinned.svg";
import unPinnedSvg from "assets/caseload/notPinned.svg";
import DownloadTableButton from "components/DownloadTableButton/DownloadTableButton";
import { Col, Row } from "antd";
import styled from "styled-components";

export const ViolationButton = styled.button`
  background: #ffffff;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
  border-radius: 2px;
  margin-bottom : 10px;
  color: #000;
  padding: 5px 16px;
  cursor : pointer;
`;

const EventHistory = () => {
  const columns = [
    {
      title: "Pinned",
      dataIndex: "isPinned",
    },
    {
      title: "Event Type",
      dataIndex: "eventType",
    },
    {
      title: "Device",
      dataIndex: "deviceName",
    },
    {
      title: "Created At/Received At",
      dataIndex: "scheduled",
      sorter: (a, b) => { return new Date(moment(a.scheduledDate, "MMMM Do YYYY, h:mm:ss a").format("LLL")) -
      new Date(moment(b.scheduledDate, "MMMM Do YYYY, h:mm:ss a").format("LLL"))},
    },
    {
      title: "Compliant At",
      dataIndex: "compliant",
      sorter: (a, b) => { return new Date(moment(a.compliantDate, "MMMM Do YYYY, h:mm:ss a").format("LLL")) -
      new Date(moment(b.compliantDate, "MMMM Do YYYY, h:mm:ss a").format("LLL"))},
    },
    {
      title: "Notification Sent At",
      dataIndex: "notificationTime",
      sorter: (a, b) => { return new Date(moment(a.notificationDate, "MMMM Do YYYY, h:mm:ss a").format("LLL")) -
      new Date(moment(b.notificationDate, "MMMM Do YYYY, h:mm:ss a").format("LLL"))},
    }
  ];

  const csvHeaders = [
    {
      label: "Pinned",
      key: "isPinned",
    },
    {
      label: "Event Type",
      key: "eventType",
    },
    {
      label: "Device",
      key: "deviceName",
    },
    {
      label: "Created At/Received At",
      key: "createdAt",
    },
    {
      label: "Received At",
      key: "receivedAt",
    },
    {
      label: "Compliant At",
      key: "compliant",
    },
    {
      label: "Notification Sent At",
      key: "notificationTime",
    },
  ];

  const { historyStartDate } = useSelector((state) => state.common);

  const { authToken } = useSelector((state) => state.login);

  const [eventHistoryData, setEventHistoryData] = useState();

  const { participantProfileData } = useSelector(
    (state) => state.participantProfileData
  );

  const pinEvent = (eventId, isPinned) => {
    apiHandler({
      url: endpoint.COMPLIANCE_EVENT,
      method: "POST",
      data: {
        isPinned,
        id: eventId
      },
      authToken,
    }).then(async(result) => {
      const eventsData = eventHistoryData.map((obj) => {
          if(obj.id === eventId){
            obj.isPinned = !obj.isPinned;
          }
          return obj;
      })
      setEventHistoryData(eventsData);
    });
  }

  useEffect(() => {
    apiHandler({
      url:
        endpoint.ENROLL_PARTICIPANT +
        "/" +
        participantProfileData?.id +
        "/events/" +
        (historyStartDate.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD")),
      authToken,
    }).then((result) => {
      if (!result) return;
      setEventHistoryData(result?.data);
    });
  }, [participantProfileData, historyStartDate]);

  const data = [];
  const csvData = [];

  eventHistoryData?.map((obj, index) => {
    data.push({
      key: index,
      eventType: obj.eventType.name,
      device: obj?.device?.serialNumber,
      isPinned: (
        <StyledStarIcon onClick={() => {pinEvent(obj.id, !obj.isPinned)}} key={index} src={obj.isPinned ? pinnedSvg : unPinnedSvg}></StyledStarIcon>
      ),
      scheduled: (
        <>
          <p>{moment(obj.createdAt).format("MMM D, YYYY h:mm A z")}</p>
          <p>{moment(obj.receivedAt).format("MMM D, YYYY h:mm A z")}</p>
        </>
      ),
      compliant: (
        <>
          <p>
            {obj.compliantAt &&
              moment(obj.compliantAt).format("MMM D, YYYY h:mm A z")}
          </p>
        </>
      ),
      notificationTime: (
        <>
          <p>
            {obj.notifiedSubscribersCreatedAt &&
              moment(obj.notifiedSubscribersCreatedAt).format(
                "MMM D, YYYY h:mm A z"
              )}
          </p>
        </>
      ),
      status: obj.eventStatus,
      scheduledDate: moment(obj.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
      compliantDate: moment(obj.compliantAt).format("MMMM Do YYYY, h:mm:ss a"),
      notificationDate: moment(obj.notifiedSubscribersCreatedAt).format("MMMM Do YYYY, h:mm:ss a"),
    });

    csvData.push({
      eventType: obj.eventType.name,
      device: obj?.device?.serialNumber,
      isPinned: obj.isPinned,
      createdAt: moment(obj.createdAt).format("MMM D, YYYY h:mm A z"),
      receivedAt: moment(obj.receivedAt).format("MMM D, YYYY h:mm A z"),
      compliant:
        obj.compliantAt &&
        moment(obj.compliantAt).format("MMM D, YYYY h:mm A z"),
      notificationTime:
        obj.notifiedSubscribersCreatedAt &&
        moment(obj.notifiedSubscribersCreatedAt).format("MMM D, YYYY h:mm A z"),
      status: obj.eventStatus,
    });
  });

  return (
    <>
      <Row>
        <Col span={8}>
          <h2>Events History</h2>
        </Col>
        <Col span={12}>
          {/* <h2>Events History</h2> */}
        </Col>
        <Col span={4}>
          <DownloadTableButton csvData={csvData} headers={csvHeaders} />
        </Col>
      </Row>
      <Row>
        <ViolationButton>Mark as Violation</ViolationButton>
      </Row>
      <CustomDataTable
        showSelect={true}
        position={["bottomRight"]}
        columns={columns}
        data={data}
        showPagination={false}
        className="eventsTable"
      />
    </>
  );
};

export default EventHistory;
