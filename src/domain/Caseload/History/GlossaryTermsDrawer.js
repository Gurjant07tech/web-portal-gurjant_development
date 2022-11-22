import CustomDataTable from "../../../components/CustomDataTable/CustomDataTable";
import DownloadTableButton from "components/DownloadTableButton/DownloadTableButton";
import { Col, Row } from "antd";

const GlossaryTermsDrawer = () => {
  const columns = [
    {
      title: "Term",
      dataIndex: "term",
    },
    {
      title: "Definition",
      dataIndex: "definition",
    }
  ];

  const csvHeaders = [
    {
        label: "Term",
        key: "term",
      },
      {
        label: "Definition",
        key: "definition",
      }
  ];


  const data = [{
      term : 'Mark as Definition',
      definition : 'If you want to add this event to the Violation History page and report, select this checkbox.'
  }, {
      term : 'Pinned',
      definition : 'Selecting the pin icon will prioritize this event and place it on the Caseload page.'
  }, {
      term : 'Created At',
      definition : 'This is the date and time the event occurred.'
  }, {
      term : 'Received At',
      definition : 'This is the date and time the event data was received by the server.'
  }, {
      term : 'Compliant At',
      definition : 'This is the date and time the event ended and compliance is resumed. Examples of how compliance is resumed include: A low battery being charged; a subsequent negative alcohol reading; airplane mode being turned off; re-entering an inclusion zone; exiting an exclusion zone; turning on location permissions, etc.'
  }, {
      term : 'Notification At',
      definition : 'This is the date and time a notification regarding the event was sent to Alert Recipients.'
  }];

  return (
    <>
     <Row>
        <Col span={8}>
          <h2>Glossary of Terms</h2>
        </Col>
        <Col span={12}>{/* <h2>Events History</h2> */}</Col>
        <Col span={4}>
          <DownloadTableButton csvData={data} headers={csvHeaders} />
        </Col>
      </Row>
      <Row><h3>Below is a list of definitions to help you navigate and better understand the language used in this web portal.</h3></Row>
      <CustomDataTable
        position={["bottomRight"]}
        columns={columns}
        data={data}
      />
    </>
  );
};

export default GlossaryTermsDrawer;
