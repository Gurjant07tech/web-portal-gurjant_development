import CustomDataTable from "../../../components/CustomDataTable/CustomDataTable";
import moment from "moment";
import { useEffect, useState } from "react";
import apiHandler from "api";
import { useSelector } from "react-redux";
import endpoint from "api/endpoint";
import DownloadTableButton from "components/DownloadTableButton/DownloadTableButton";
import { Col, Row } from "antd";

const MessageHistory = () => {
  const columns = [
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Message Sent At",
      dataIndex: "sentAt",
    },
    {
        title: "Message Received At",
        dataIndex: "receivedAt",
    },
    {
        title: "Message Sent By",
        dataIndex: "sentBy",
    },
  ];

  const csvHeaders = [
    {
      label: "Message",
      key: "message",
    },
    {
      label: "Message Sent At",
      key: "sentAt",
    },
    {
        label: "Message Received At",
        key: "receivedAt",
    },
    {
        label: "Message Sent By",
        key: "sentBy",
    },
  ];

  const { historyStartDate } = useSelector((state) => state.common);

  const { authToken } = useSelector((state) => state.login);

  const [MessageHistoryData, setMessageHistoryData] = useState();

  const { participantProfileData } = useSelector(
    (state) => state.participantProfileData
  );   

  useEffect(() => {
    apiHandler({
        url: endpoint.ENROLL_PARTICIPANT+"/"+participantProfileData?.id+"/messages/" +(historyStartDate.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD")),
      authToken,
    }).then((result) => {
      setMessageHistoryData(result.data);
    });
  }, [historyStartDate]);

  const data = [];
  const csvData = [];
  MessageHistoryData?.map((obj, index) => {
    data.push({
      key: index,
      message: obj.message,
      sentAt: (
        <>
          <p>{moment(obj.sentAt).format("MMM D, YYYY h:mm A z")}</p>
        </>
      ),
      receivedAt: (
        <>
          <p>{obj.receivedAt && moment(obj.receivedAt).format("MMM D, YYYY h:mm A z")}</p>
        </>
      ),
      sentBy: obj.sentBy,
    });

    csvData.push({
      message: obj.message,
      sentAt: moment(obj.sentAt).format("MMM D, YYYY h:mm A z"),
      receivedAt:obj.receivedAt && moment(obj.receivedAt).format("MMM D, YYYY h:mm A z"),
      sentBy: obj.sentBy,
    });
  });

  return (
    <>
     <Row>
        <Col span={8}>
          <h2>Message History</h2>
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
    </>
  );
};

export default MessageHistory;
