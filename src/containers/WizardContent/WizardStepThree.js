import { Button, Row, Select, Table, notification } from "antd";
import apiHandler from "api";
import endpoint from "api/endpoint";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import TrashIcon from "assets/trash-icon.png";
import { saveProgramData } from "features/enrollWizard/enrollWizardSlice";
import { setAssignedDevices } from "features/common/commonSlice";

const { Option } = Select;

export const StyledSelectLabel = styled.label`
  min-width: 110px !important;
  display: flex;
  justify-content: flex-start;
  margin-right: 10px !important;
  padding-top: 5px !important;
`;

const WizardStepThree = () => {
  const { authToken } = useSelector((state) => state.login);

  const dispatch = useDispatch();
  const [programTypes, setProgramTypes] = useState();
  const [availableDevices, setAvailableDevices] = useState();
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [deviceType, setDeviceType] = useState();
  const [alcoholProgramType, setAlcoholProgramType] = useState();
  const [selectedAddDevice, setSelectedAddDevice] = useState();
  const [selectedSchedule, setSelectedSchedule] = useState();
  const [assignedDevicesData, setAssignedDevicesData] = useState();
  const [customOptionsList, setCustomOptionsList] = useState([]);
  const [serialNumber, setSerialNumber] = useState("01");

  const { editParticipantProfile } = useSelector((state) => state.common);

  const enrollParticipantData = useSelector(
    (state) => state.common.enrollParticipantData
  );

  const { activeParticipantId } = useSelector((state) => state.common);

  const { programData } = useSelector((state) => state.enrollWizardData);

  // const { assignedDevices } = participantProfileData;

  const unassignDevice = (event) => {
    apiHandler({
      url: `${endpoint.ASSIGN_DEVICE}/${event.target.alt}`,
      method: "DELETE",
      authToken,
    }).then((result) => {
      notification.info({
        description: result.data.message,
        placement: "topRight",
        duration: 5,
      });
      apiHandler({
        url: `${endpoint.ENROLL_PARTICIPANT}/${
          enrollParticipantData.id || activeParticipantId
        }`,
        authToken,
      }).then((result) => {
        setAssignedDevicesData(result.data.assignedDevices);
        dispatch(setAssignedDevices(result.data.assignedDevices));
      });
    });
  };

  const devicesData = [];

  if (assignedDevicesData) {
    for (var index = 0; index < assignedDevicesData.length; index++) {
      let dataObj = {
        key: index,
        deviceType: assignedDevicesData[index]?.device.deviceTypeName,
        serialNumber: assignedDevicesData[index]?.device.serialNumber,
        assignedOn:
          assignedDevicesData[index]?.assignedOn &&
          moment(assignedDevicesData[index]?.assignedOn).format(
            "MMM D, YYYY h:mm A z"
          ),
        trashIcon: (
          <img
            style={{ cursor: "pointer" }}
            src={TrashIcon}
            alt={assignedDevicesData[index]?.id}
            key={assignedDevicesData[index]?.id}
            // eslint-disable-next-line no-loop-func
            onClick={(e) => unassignDevice(e)}
          />
        ),
      };
      devicesData.push(dataObj);
    }
  }

  const onChange = (value) => {
    setSelectedAddDevice(value);
  };

  const onSearch = (val) => {
    if (val.length >= 2) {
      setSerialNumber(val);
    }

    if (!val) {
      setSerialNumber("01");
    }
  };

  const columns = [
    {
      title: "Device Type",
      dataIndex: "deviceType",
      key: "deviceType",
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
    },
    {
      title: "Assigned On",
      dataIndex: "assignedOn",
      key: "assignedOn",
    },
    {
      title: "",
      dataIndex: "trashIcon",
      key: "trashIcon",
    },
  ];

  const fetchScheduleOptions = () => {
    apiHandler({
      url: `${endpoint.AVAILABLE_TEST_SCHEDULES}/${selectedProgram[0] || 'breathalyzer'}/${enrollParticipantData?.agency?.id}`,
      authToken,
    }).then((result) => {
        setSelectedSchedule(result.data[0].id);
        setCustomOptionsList(result.data);
    });
  }

  const selectDevice = (value) => {
    if (alcoholProgramType === 1) {
      if (value === 2 || value === 4) {
        notification.info({
          description:
            "You need to select a program that allows for multiple devices, like Standalone CAM+ with Scheduled Breathalyzer.",
          placement: "topRight",
          duration: 5,
        });
      } else {
        setDeviceType(value);
        dispatch(saveProgramData({ alcoholProgramType: { id: value } }));
        // setCustomOptionsList(customOptions[value - 1]);
        let selectProgramTypes = [];
        programTypes.map((type) => {
          if (type.id === value) {
            type.deviceTypes.map((deviceType) => {
              selectProgramTypes.push(deviceType.name);
            });
          }
        });
        setSelectedProgram(selectProgramTypes);
      }
    } else {
      setDeviceType(value);
      dispatch(saveProgramData({ alcoholProgramType: { id: value } }));

      let selectProgramTypes = [];
      programTypes.map((type) => {
        if (type.id === value) {
          type.deviceTypes.map((deviceType) => {
            selectProgramTypes.push(deviceType.name);
          });
        }
      });
      setSelectedProgram(selectProgramTypes);
    }

    fetchScheduleOptions();
  };

  const addNewDevice = async () => {
    apiHandler({
      url: `${endpoint.ASSIGN_DEVICE}`,
      method: "POST",
      authToken,
      data: {
        participantId: enrollParticipantData?.id,
        device: { id: selectedAddDevice},
        testSchedule : {id : selectedSchedule}
      },
    }).then((result) => {
      notification.info({
        description: result.data.message,
        placement: "topRight",
        duration: 5,
      });
      apiHandler({
        url: `${endpoint.ENROLL_PARTICIPANT}/${
          enrollParticipantData.id || activeParticipantId
        }`,
        authToken,
      }).then((result) => {
        setAssignedDevicesData(result.data.assignedDevices);
        dispatch(setAssignedDevices(result.data.assignedDevices));
        setSelectedAddDevice("");
      });
    });
  };

  useEffect(() => {
    apiHandler({
      url: `${endpoint.AVAILABLE_DEVICES}/${enrollParticipantData?.agency?.id}/${serialNumber}`,
      authToken,
    }).then((result) => {
      setAvailableDevices(result.data);
    });
  }, [serialNumber]);

  useEffect(() => {
    // setAssignedDevicesData(assignedDevices);
    // setDeviceType(assignedDevicesData && assignedDevicesData[0]?.id);
    apiHandler({
      url: `${endpoint.AVAILABLE_PROGRAM_TYPES}`,
      authToken,
    }).then((result) => {
      setProgramTypes(result.data);
    });
  }, [assignedDevicesData]);

  useEffect(() => {
    apiHandler({
      url: `${endpoint.ENROLL_PARTICIPANT}/${
        enrollParticipantData.id || activeParticipantId
      }`,
      authToken,
    }).then((result) => {
      setAssignedDevicesData(result?.data?.assignedDevices);
      dispatch(setAssignedDevices(result?.data?.assignedDevices));
    });

    if (editParticipantProfile) {
      setDeviceType(
        enrollParticipantData?.latestProgram?.alcoholProgramType?.id
      );
      dispatch(
        saveProgramData({
          alcoholProgramType: {
            id: enrollParticipantData?.latestProgram?.alcoholProgramType?.id,
          },
        })
      );
      setAlcoholProgramType(
        enrollParticipantData?.latestProgram?.alcoholProgramType?.id
      );
      fetchScheduleOptions();
      setSelectedProgram([
        enrollParticipantData?.assignedDevices[0]?.device?.deviceTypeName,
      ]);
    }
  }, []);

  

  return (
    <>
      {/* {!selectedProgram || !selectedAddDevice ?  notification.info({
        description: 'Add the applicable device or select Manage Program to choose new program type.',
        placement: 'topRight',
      }) : ''} */}
      <h2 style={{ marginTop: 30 }}>Manage Program</h2>

      <Row style={{ marginTop: 20 }}>
        <StyledSelectLabel style={{ minWidth: "120px" }}>
          * Alcohol
        </StyledSelectLabel>
        <Select
          className="enrollParticipantWizard"
          placeholder="Please select device"
          onChange={selectDevice}
          value={deviceType}
          defaultValue={deviceType}
        >
          {programTypes?.map((pType) => {
            return (
              <Option key={pType.id} value={pType.id}>
                {pType.name.replace('CAM+', 'TRAC Watch').replace('Breathalyzer', 'TRAC Breath')}
              </Option>
            );
          })}
        </Select>
        <Select
          className="enrollParticipantWizard"
          defaultValue={customOptionsList[0] && customOptionsList[0].id}
          onChange={(value) => setSelectedSchedule(value)}
          value={selectedSchedule}
        >
         {customOptionsList && customOptionsList?.map((option, index)=>{
           return <Option value={option.id}>{option.name}</Option>
         })}
        </Select>
        {/* <Button className="ml-4" type="primary">
          Save
        </Button> */}
      </Row>

      <h2 style={{ marginTop: 30 }}>Manage Devices</h2>

      <Row style={{ marginTop: 20 }}>
        <Table dataSource={devicesData} columns={columns} pagination={false} />
      </Row>

      <Row style={{ marginTop: 50 }}>
        <StyledSelectLabel style={{ minWidth: "120px" }}>
          Add New Device
        </StyledSelectLabel>
        <Select
          style={{ minWidth: "150px !important", maxWidth: "150px !important" }}
          showSearch
          onChange={onChange}
          onSearch={onSearch}
          className="enrollParticipantWizard"
          placeholder="Please select a device"
          filterOption={false}
        >
          {availableDevices?.map((obj) => {
            return (
              selectedProgram.includes(obj.deviceTypeName) && (
                <option value={obj.id}>
                  {obj.deviceTypeName} - {obj.serialNumber}
                </option>
              )
            );
          })}
        </Select>
        <Button
          onClick={addNewDevice}
          disabled={selectedProgram ? false : true}
          className="ml-4"
          type="primary"
        >
          Add
        </Button>
      </Row>
    </>
  );
};

export default WizardStepThree;
