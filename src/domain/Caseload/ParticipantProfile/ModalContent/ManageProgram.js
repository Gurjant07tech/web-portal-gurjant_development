import { Col, Collapse, Row, Select, Switch } from "antd";
import endpoint from "api/endpoint";
import CustomDataTable from "components/CustomDataTable/CustomDataTable";
import moment from "moment";
import { useSelector } from "react-redux";
import { css } from "styled-components";
import { StyledButton } from "theme/StyledComponents";
import apiHandler from "api";
import { useState } from "react";

const { Panel } = Collapse;
const ManageProgram = ({ agencyId, assignedDevices, participantId }) => {
  const columns = [
    {
      title: "Program Type",
      dataIndex: "programType",
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
    },
    {
      title: "Assigned On",
      dataIndex: "assignedOn",
    },
    {
      title: "Scheduled/Zones",
      dataIndex: "scheduledZones",
    },
    {
      title: "Activate",
      dataIndex: "activate",
    },
  ];

  const [inventoryData, setInventoryData] = useState([]);
  const [deviceId, setDeviceId] = useState();
  const data = [];
  assignedDevices?.map((obj, index) => {
    const {
      assignedOn,
      device: { serialNumber, deviceTypeName },
    } = obj;
    data.push({
      key: index,
      programType: deviceTypeName,
      serialNumber: serialNumber,
      assignedOn: assignedOn && moment(assignedOn).format("MMM D, YYYY h:mm A z"),
      scheduledZones:
        "6:00 AM   Su M Tu W Th F Sa 10:00 AM   Su M Tu W Th F Sa2:00 PM   Su M Tu W Th F Sa 6:00 PM   Su M Tu W Th F Sa  9:00 PM   Su M Tu W Th F Sa",
      activate: <Switch defaultChecked />,
    });
  });

  const { authToken } = useSelector((state) => state.login);

  const getDeviceInventory = (value) => {
    apiHandler({
      url: `${endpoint.AVAILABLE_DEVICES}/${value}/${agencyId}`,
      authToken,
    }).then((result) => {
      setInventoryData([...inventoryData, result.data]);
    });
  };

  const selectDevice = (value) => {
    setDeviceId(value);
  };

  const assignNewDevice = () => {
    apiHandler({
      url: `${endpoint.ASSIGN_DEVICE}`,
      method: "POST",
      authToken,
      data: { participantId, device: { id: deviceId } },
    }).then((result) => {});
  };

  return (
    <>
      <CustomDataTable
        position={["bottomRight"]}
        columns={columns}
        data={data}
      />
      <Collapse className="py-10" ghost defaultActiveKey={["1"]}>
        <Panel header="Add New Device" key="1">
          <Row>
            <Col md={8}>
              <Select
                onChange={(e) => getDeviceInventory(e)}
                placeholder="Please select program type"
              >
                <option value="breathalyzer">Breathalyzer</option>
                <option value="watch">Watch</option>
              </Select>
            </Col>
            <Col md={8}>
              <Select
                onChange={(e) => selectDevice(e)}
                placeholder="Please select devices in inventory"
              >
                {inventoryData[0]?.map((obj) => {
                  return <option value={obj.id}>{obj.serialNumber}</option>;
                })}
              </Select>
            </Col>
            <Col md={3}>
              <StyledButton
                externalCss={css`
                  margin: 10px;
                  width: 150px;
                  padding: 6px;
                `}
                onClick={() => assignNewDevice()}
              >
                Submit
              </StyledButton>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </>
  );
};

export default ManageProgram;
