import { StyledStarIcon } from "components/CustomDataTable/CustomDataTable.style";
import CustomDataTable from "../../../components/CustomDataTable/CustomDataTable";
import pinnedSvg from "assets/caseload/pinned.svg";
import moment from "moment";
import { useEffect, useState } from "react";
import apiHandler from "api";
import { useSelector } from "react-redux";
import endpoint from "api/endpoint";

const TestHistory = () => {
  const columns = [
    {
      title: "Pinned",
      dataIndex: "starred",
      sorter: true,
    },
    {
      title: "Test Type",
      dataIndex: "testType",
    },
    {
      title: "Scheduled/Taken",
      dataIndex: "scheduled",
    },
    {
      title: "Outcome",
      dataIndex: "outcome",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const startDate = moment().subtract(7, "months").format("YYYY-MM-DD");

  const { authToken } = useSelector((state) => state.login);

  const [testHistoryData, setTestHistoryData] = useState();
  useEffect(() => {
    apiHandler({
      url: endpoint.TEST_HISTORY + "/" + startDate,
      authToken,
    }).then((result) => {
      setTestHistoryData(result.data);
    });
  }, []);

  const data = [];
  testHistoryData?.map((obj, index) => (
    data.push({
      key: index,
      starred: <StyledStarIcon src={pinnedSvg}></StyledStarIcon>,
      testType: obj.testType.name,
      scheduled: (
        <>
          <p>{moment(obj.scheduledAt).format("MMM D, YYYY h:mm A z")}</p>
        </>
      ),
      outcome: !obj.violation && "Missed",
      status: obj.currentState,
      })
  ));

  return (
    <>
      <h2>Test History</h2>
      <CustomDataTable
        showSelect={true}
        position={["bottomRight"]}
        columns={columns}
        data={data}
        showPagination={true}
      />
    </>
  );
};

export default TestHistory;
