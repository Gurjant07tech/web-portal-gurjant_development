import React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { StyledButton } from "theme/StyledComponents";
import { Row, Col, Select, Input, Button, DatePicker  } from "antd";
import { css } from 'styled-components';
import { StyledModal } from "./ManageSchedule.style";
import "./ManageScheduleCustom.css";
import apiHandler from "api";
import endpoint from "api/endpoint";
import moment from "moment";

const { RangePicker } = DatePicker;

const ManageSchedule = () => {
  const { Option } = Select;

  const { authToken } = useSelector((state) => state.login);
  const [modalVisible, setModalVisible] = useState(false);
  const [zoneData, setZoneData] = useState([]);
  const [deviceList, setDevices] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [zoneApiData, setZoneAPIData] = useState([]);
  const [dates, setDates] = useState(null);
  const [hackValue, setHackValue] = useState(null);
  const [value, setValue] = useState(null);
  const [showSchedule, setSchedule] = useState(false);
  
  const { activeParticipantId } = useSelector((state) => state.common);
  const [monthDays, setDays] = useState([]);
  const week_names = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  function getDaysInCurrentMonth() {
    const date = new Date();
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
  }

  const getDays = () => { 
    var month = [];
    // const result = getDaysInCurrentMonth();
    for(let i=0; i <=11; i++){
      let date = "0"+i+"a";
      if(i == 0){
        date = "12a";
      } 
      if(i > 0){
        date = i+"a";
      } 
      month.push({"id":i, "val": date})
    }
    for(let i=0; i <=11; i++){
      let date = "0"+i+"p";
      if(i == 0){
        date = "12p";
      } 
      if(i > 0){
        date = i+"p";
      } 
      month.push({"id":i, "val": date})
    }
    setDays(month)
  }

  useEffect(() => {
    fetchDetails();
  }, [setZoneData]);

  const fetchDetails = () => { 
    setDevices([]);
    setZoneAPIData([]);
    setHackValue([null, null]);
    setDates([null, null]);

    apiHandler({
      url: endpoint.AVAILABLE_ZONES + "/" + `${activeParticipantId}` + "/zones",
      authToken,
    }).then((result) => {
      setZoneData(result.data);
    });

    getDays();

    apiHandler({
      url: `${endpoint.ENROLL_PARTICIPANT}/${
        activeParticipantId
      }`,
      authToken,
    }).then((result) => {
      setDevices(result.data.assignedDevices);
      setZoneAPIData(result.data);
    });
  }

  const onChange = (value) => {console.log(`selected ${value}`); };

  const onZoneChange = (value) => {
    if(value != ''){
      function zList(element) { 
        return (element.id == value); 
      }
      let list = zoneData.filter(zList);
      console.log(`selected ${value}`); 
      console.log(list); 
    }
  };

  const deviceOnchange = (value) => {
    if(value != ''){
      function dlList(element) { 
        return (element.id == value); 
      }
      let list = deviceList.filter(dlList);
      let startDate = null;
      let endDate = null;

      if(list[0].testDateRange.startDate != null){
        startDate = moment(list[0].testDateRange.startDate)
      }
      if(list[0].testDateRange.endDate != null){
        endDate = moment(list[0].testDateRange.endDate)
      }
      setHackValue([startDate, endDate])
      // console.log(`selected ${value}`);
      // console.log(list[0])
      // console.log(dates)
      if(list[0].device.deviceTypeName == 'Breathalyzer'){
        apiHandler({
          url: `${endpoint.AVAILABLE_TEST_SCHEDULES}/${list[0].device.deviceTypeName || 'breathalyzer'}/${zoneApiData?.agency?.id}`,
          authToken,
        }).then((result) => {
          setSchedule(true);
          // console.log(result);
          setScheduleList(result.data);
        });
      }
      else {
        setSchedule(false);
      }
    }
    else {
      setHackValue([null, null]);
      setDates([null, null]);
      setSchedule(false);
    }
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  // Save Manage Schedule
  const saveSchedule = () => {
    apiHandler({
      url: endpoint.AVAILABLE_ZONES + "/" + `${activeParticipantId}` + "/zones",
      authToken,
      method: 'POST',
      data:[{}]
    }).then((result) => {
      setModalVisible(false)
    });
  };

  const checkDateBlue = (index,e) => {
    if(e.currentTarget.classList.contains("bg_blue") == true){
      e.currentTarget.classList.remove("bg_blue")
    }
    else {
      e.currentTarget.classList.add("bg_blue")
    }
  }

  const checkDateBlueTw = (index,e) => {
    if(e.currentTarget.classList.contains("bg_blue2") == false){
      e.currentTarget.classList.add("bg_blue2")
    }
    else {
      e.currentTarget.classList.remove("bg_blue2")
    }
  }

  const checkDateOrange = (index,e) => {
    if(e.currentTarget.classList.contains("bg_orange") == true){
      e.currentTarget.classList.remove("bg_orange")
    }
    else {
      e.currentTarget.classList.add("bg_orange")
    }
  }
  
  // Get and set dates
  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
    return !!tooEarly || !!tooLate;
  };
  
  const onOpenChange = (open) => {
    if (open) {
      setHackValue([null, null]);
      setDates([null, null]);
    } else {
      setHackValue(null);
    }
  };

  return (
    <>
      <StyledButton
        externalCss={css`
          background: #fff;
          border: 1px solid #0557a2;
          color: #0557a2;
          padding: 10px;
          margin: 15px 5px;
        `}
        onClick={(e) => {
          fetchDetails(); setModalVisible(true);
        }} >
        Manage Schedule
      </StyledButton>

      <StyledModal visible={modalVisible} closable={false} width={900} footer={null} onCancel={(e) => { setModalVisible(false)}}
        title={[
          <Row>
            <Col md={2} style={{marginTop:'5px',fontWeight: 'normal'}}>Device</Col>
            <Col md={7}>
              <Select placeholder="Please select device" onChange={deviceOnchange} style={{marginLeft:'5px', width: '100%',borderRadius: '0px', fontWeight: 'normal' }} >
                <Option value="">Select Device</Option>
                { deviceList.map(d => <Option value={d.id} key={d.device.id} >{d.device.deviceTypeName}</Option>) }
              </Select>
            </Col>
            <Col md={15}>
              <Button type="primary" style={{float: 'right',marginLeft:'1rem'}}  onClick={() => saveSchedule()}>Save</Button>
              <Button style={{float: 'right'}} onClick={(e) => { setModalVisible(false)}}>Cancel</Button>
            </Col>
          </Row>
        ]}
      >
        <Row>
          {showSchedule == false ? (
            <>
              <Col md={2} className="mt-5">
                Zone:
              </Col>
              <Col md={9}>
                <Select placeholder="Select zone"  style={{ width: '90%',borderRadius: '0px' }} onChange={onZoneChange}>
                  <Option value="">Select Zone</Option>
                  { zoneData.map(zone => <Option value={zone.id} key={zone.id} >{zone.name}</Option>) }
                </Select>
              </Col>
            </>
          ) : (
            <>
              <Col md={2} className="mt-5">
                Schedule:
              </Col>
              <Col md={9}>
                <Select placeholder="Select schedule"  style={{ width: '90%',borderRadius: '0px' }}>
                  { scheduleList.map(sc => <Option value={sc.id} key={sc.id} >{sc.name}</Option>) }
                </Select>
              </Col>
            </>
          )}
          

          <Col md={9}>
            <Button type="primary">Create Exception</Button>
            {/* <RangePicker value={hackValue || value} disabledDate={disabledDate} onCalendarChange={(val) => setDates(val)} onChange={(val) => setValue(val)} onOpenChange={onOpenChange} /> */}
          </Col>
        </Row>
        
        {showSchedule == false ? (
          <>
            <Row>
              <table className='table'>
                <thead>
                  <tr>
                    <th></th>
                    { monthDays.map((day,i) => <th>{day.val}</th>) }
                  </tr>
                </thead>
                <tbody>
                  { week_names.map((day,i) => <tr><td key={i}>{day}</td>
                    { monthDays.map((day,i) => 
                      <td>
                        <div style={{ display: "flex" }}>
                          <div className="square" onClick={(e) => { checkDateBlue(i,e)}} style={{ marginRight: "4px" }}></div>
                          <div className="square" onClick={(e) => { checkDateOrange(i,e)}}></div>
                        </div>
                      </td>
                    ) }
                  </tr>) }
                </tbody>
              </table>
            </Row>
          </>
        ) : (
          <>
            <Row>
              <table className='table'>
                <thead>
                  <tr>
                    <th></th>
                    { monthDays.map((day,i) => <th>{day.val}</th>) }
                  </tr>
                </thead>
                <tbody>
                  { week_names.map((day,i) => <tr><td key={i}>{day}</td>
                    { monthDays.map((day,i) => 
                      <td>
                        <div style={{ display: "flex" }}>
                          <div className="square2" onClick={(e) => { checkDateBlueTw(i,e)}} style={{ marginRight: "4px" }}></div>
                        </div>
                      </td>
                    ) }
                  </tr>) }
                </tbody>
              </table>
            </Row>
          </>
        )}

      </StyledModal>
    </>
  );
};

export default ManageSchedule;




// {
//   "id": 2570,
//   "testDuration": 30,
//   "advanceWarning": 10,
//   "testPeriods": [
//     {
//       "startHour": 19,
//       "periodLength": 1,
//       "testCount": 1,
//       "isRandom": false,
//       "dayOfWeek": 1
//     },
//     {
//       "startHour": 19,
//       "periodLength": 1,
//       "testCount": 1,
//       "isRandom": false,
//       "dayOfWeek": 2
//     }
//   ]
//  }
