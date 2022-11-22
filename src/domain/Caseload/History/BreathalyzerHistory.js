import CustomDataTable from "../../../components/CustomDataTable/CustomDataTable";
import moment from "moment";
import { useEffect, useState } from "react";
import apiHandler from "api";
import { useSelector } from "react-redux";
import endpoint from "api/endpoint";
import DownloadTableButton from "components/DownloadTableButton/DownloadTableButton";
import { Col, Row } from "antd";
import axios from 'axios';

const BreathalyzerTestHistory = () => {
  const columns = [
    {
      title: "Test Type",
      dataIndex: "testType",
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
      title: "Scheduled At",
      dataIndex: "scheduled",
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.scheduledDate) -
      new Date(b.scheduledDate),
    },
    {
      title: "Taken At/ Received At",
      dataIndex: "receivedAt",
      sorter: (a, b) =>new Date(a.receivedDate) -
      new Date(b.receivedDate),
    },
    {
      title: "Alcohol Reading",
      dataIndex: "outcome",
      sorter: (a, b) =>new Date(a.outcome) -
      new Date(b.outcome),
    },
    {
      title: "Photo",
      dataIndex: "photo",
    },
  ];

  const csvHeaders = [
    {
      label: "Test Type",
      key: "testType",
    },
    {
      label: "Device",
      key: "device",
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "Scheduled At",
      key: "scheduled",
    },
    {
      label: "Taken At/ Received At",
      key: "receivedAt",
    },
    {
      label: "Alcohol Reading",
      key: "outcome",
    },
  ];

  const { historyStartDate } = useSelector((state) => state.common);

  const { authToken } = useSelector((state) => state.login);

  const [BreathalyzerTestHistoryData, setBreathalyzerTestHistoryData] =
    useState();

  const { participantProfileData } = useSelector(
    (state) => state.participantProfileData
  );

   const CheckImage = (path) => {
    axios
      .get(path)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  useEffect(() => {
    apiHandler({
      url:
        endpoint.ENROLL_PARTICIPANT +
        "/" +
        participantProfileData?.id +
        "/testResults/" +
        (historyStartDate.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD")),
      authToken,
    }).then((result) => {
      setBreathalyzerTestHistoryData(result.data);
    });
  }, [historyStartDate]);

  const data = [];
  const csvData = [];
 
  BreathalyzerTestHistoryData?.map((obj, index) => {
    const imageUrl = `${process.env.REACT_APP_PARTICIPANT_IMAGE_URL_QA}/${participantProfileData?.id}/testResult_${obj.id_thumb}.png`;
    data.push({
      key: index,
      testType: obj.testType.name,
      scheduled: (
        <>
          <p>{obj.scheduledAt && moment(obj.scheduledAt).format("MMM D, YYYY h:mm A z")}</p>
        </>
      ),
      scheduledDate: obj.scheduledAt,
      receivedDate: obj.receivedAt,
      receivedAt: (
        <>
          <p>
            {obj.receivedAt &&
              moment(obj.receivedAt).format("MMM D, YYYY h:mm A z")}
          </p>
        </>
      ),
      outcome: obj.testThreshold,
      status: obj.currentState,
      device: obj.device.deviceTypeName,
      photo : CheckImage(imageUrl) && <img alt="photo_thumb" src={imageUrl}/>
    });

    csvData.push({
      testType: obj.testType.name,
      scheduled: moment(obj.scheduledAt).format("MMM D, YYYY h:mm A z"),
      receivedAt:
        obj.receivedAt && moment(obj.receivedAt).format("MMM D, YYYY h:mm A z"),
      outcome: !obj.violation && "Missed",
      status: obj.currentState,
      device: obj.device.deviceTypeName,
    });
  });

  return (
    <>
      <Row>
        <Col span={8}>
          <h2>TRAC Breath Test History</h2>
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

export default BreathalyzerTestHistory;
