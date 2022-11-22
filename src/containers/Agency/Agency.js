import { Button, Row, Col, Space, notification, Select, Input, Checkbox, Switch, Table } from "antd";
import apiHandler from "api";
import endpoint from "api/endpoint";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  StyledColLeft,
  StyledColRight,
  StyledHeading,
  StyledSubHeading,
  ActiveDevicesHeading,
  DeviceList
} from "./Agency.styles";
import AddNewWebsite from "../AddNewWebsite/AddNewWebsite";
import NewContact from "../NewContact/NewContact";
import { EditOutlined,PlusCircleOutlined } from '@ant-design/icons';
import EditAlters from "containers/EditAlerts/EditAlerts";
import { useForm } from "react-hook-form";
import { setWebsiteUserData } from "features/agency/websiteUserSlice";


export const StyledSpace = styled(Space)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45vh;
  font-size: 20px;
  font-weight: bold;
`;

const Agency = () => {
  // All form controls
  const dispatch = useDispatch();
  const { register, getValues, setValue, reset, handleSubmit, formState: {errors} } = useForm({ defaultValues: { displayNext: false } });
  const [agencyList, getAgencyData] = useState([]);
  const [agencyArr, getAgencyArray] = useState([]);
  const [stateList, getStateList] = useState([]);
  const [timezoneList, getTimeZoneList] = useState([]);
  const [availableNotificationLists, getavailableNotificationLists] = useState([]);
  const { authToken, userData } = useSelector((state) => state.login);
  // const agencies = useSelector((state) => state.common.agencies);
  const [contactList, setContact] = useState([]);
  const [deviceList, setDevice] = useState([]);
  const webloadData = useSelector( (state) => state.websiteUserData.websiteDataObj );

  // On filter change
  const onFilterChange = (e) => {
    // console.log(`checked = ${e.target.value}`);
    if(e.target.checked == true){
      getSavedAgency(e.target.value);
    }
  };

  // Alert table data
  const alertColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Breath Reports',
      dataIndex: 'breath',
      key: 'breath',
    },
    {
      title: 'Alerts',
      dataIndex: 'alerts',
      key: 'alerts',
    },
    {
      title: 'Profiles',
      dataIndex: 'profiles',
      key: 'profiles',
    },
    {
      title: 'Edits',
      dataIndex: 'edits',
      key: 'edits',
      align: 'center'
    }
  ];

  const alertData = [
    {
      key: '1',
      name: 'Perston Alerts',
      breath: '[]',
      alerts: '[]',
      profiles: 0,
      edits: <EditAlters />,
    },
    {
      key: '2',
      name: 'Management (Default)',
      breath: '[]',
      alerts: '[]',
      profiles: 403,
      edits: <EditAlters />,
    },
    {
      key: '2',
      name: 'Demo',
      breath: '[8 Recipients]',
      alerts: '[]',
      profiles: 636,
      edits: <EditAlters />,
    },
  ];

  // Contact column data
  const contactColumn = [
    {
      title: 'Last Name, First Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Preferred Contact',
      dataIndex: 'preferred',
      key: 'preferred',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    }
  ];

  // Website column data
  const websiteColumn = [
    {
      title: 'Last Name, First Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Preferred Contact',
      dataIndex: 'preferred',
      key: 'preferred',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Edit',
      dataIndex: 'edits',
      key: 'edits',
      align: 'center'
    }
  ];

  // Get Agency Data
  useEffect(() => {
    let activeId = '';
    if(userData?.agencies.length > 0){
      activeId = userData?.agencies[0]['id'];
    }
    getSavedAgency(activeId);
    getContactList(activeId);
    getAgeyList();
    getStates();
    getTimezone();
    populateAlertGroups();
  }, []);

  const getSavedAgency = async (agencyId) => {
    // Get Agency Saved Data
    apiHandler({
      url: `${endpoint.ADMIN_AGENCY}/${agencyId}`,
      authToken,
    }).then((result) => {
      if(result){
        setValue("name", result?.data?.name);
        setValue("description", result?.data?.description);
        setValue("timezone", result?.data?.timeZone);
        setValue("autoValidation", result?.data?.autoValidationStatus);
        setValue("zip", result?.data?.address?.zip);
        setValue("city", result?.data?.address?.city);
        setValue("state", result?.data?.address?.state);
        setValue("addressOne", result?.data?.address?.address1);
        setValue("addressLineTwo", result?.data?.address?.address2);
        setValue("addressLineThree", result?.data?.address?.address3);
        setValue("displayNext", result?.data?.displayNextTestTime);
        // setValue("parentAgency", result?.data?.parentAgencyId);
        getAgencyData(result?.data);
        if(result?.data?.websiteUsers.length > 0){
          dispatch(setWebsiteUserData(result.data.websiteUsers.map((row,i) =>({
            key: (i+1),
            name: row.firstName +" "+row.lastName,
            preferred: row.email,
            status: row.status,
            edits: <EditOutlined />,
          }))));
        }
        if(result?.data?.activeDeviceTypes.length > 0){
          setDevice(result?.data?.activeDeviceTypes);
        }
      }
    });
  }

  const getContactList = async (agencyId) => {
    apiHandler({
      url: `${endpoint.AVAILABLE_CONTACTS}/${agencyId}`,
      authToken,
    }).then((result) => {
      if(result){
        if(result?.data.length > 0){
          setContact(  result.data.map((row,i) =>({
            key: (i+1),
            name: row.firstName +" "+row.lastName,
            preferred: row.email,
            role: row.role,
          })));
        }
      }
    });
  }

  const getAgeyList = () => {
    apiHandler({
      url: `${endpoint.AGENCIES}`,
      authToken,
    }).then((result) => {
      getAgencyArray(result?.data);
    });
  }

  const getStates = () => {
    apiHandler({
      url: `${endpoint.AVAILABLE_STATES}`,
      authToken,
    }).then((result) => {
      getStateList(result?.data);
    });
  }

  const getTimezone = () => {
    apiHandler({
      url: `${endpoint.AVAILABLE_TIMEZONE}`,
      authToken,
    }).then((result) => {
      getTimeZoneList(result?.data);
    });
  }
  
  const populateAlertGroups = () => {
    apiHandler({
      url: `${endpoint.AGENCY_ALERT_LIST}/56`,
      authToken,
    }).then((result) => {
      getavailableNotificationLists(result?.data);
    });
  };

  // Update Agency Data
  const onUpdate = async () => {
    const values = getValues(); 
    if(values != '' && agencyList != undefined){
      // console.log(values)
      // console.log(agencyList)
      await apiHandler({
        url:endpoint.ADMIN_AGENCY,
        method: "POST",
        data: {
          "id": agencyList?.id,
          "name": values?.name,
          "parentAgencyId": agencyList?.parentAgencyId,
          "address": {
            "address1": values.addressOne,
            "address2": values.addressLineTwo,
            "address3": values.addressLineThree,
            "city": values.city,
            "state": values.state,
            "zip": values.zip
          },
          "timeZone": values.timeZone,
          "description": values?.description,
          "displayNextTestTime": values.displayNext,
          "autoValidationStatus": values.autoValidation,
          "activeDeviceTypes": []
        },
        authToken: authToken,
      }).then(async (result) => {
        notification.info({
          description: result?.data?.message,
          placement: "topRight",
          duration: 5,
        });
        reset();
      });
    }
  };

  // Save Agency Data
  const onSubmit = async () => {
    const values = getValues(); 
    if(values != ''){
      // console.log(values)
      await apiHandler({
        url:endpoint.ADMIN_AGENCY,
        method: "POST",
        data: {
          // "id": agencyList?.id,
          "name": values?.name,
          "parentAgencyId": values?.parentAgency,
          "address": {
            "address1": values?.addressOne,
            "address2": values?.addressLineTwo,
            "address3": values?.addressLineThree,
            "city": values?.city,
            "state": values?.state,
            "zip": values?.zip
          },
          "timeZone": values?.timeZone,
          "description": values?.description,
          "displayNextTestTime": values?.displayNext,
          "autoValidationStatus": values?.autoValidation,
          "activeDeviceTypes": []
        },
        authToken: authToken,
      }).then(async (result) => {
        reset();
        if(result?.data?.id){
          notification.success({
            description: "Agency created successfully",
            placement: "topRight",
            duration: 5,
          });
          getAgeyList();
          getSavedAgency(result?.data?.id)
        }
        else{
          notification.info({
            description: result?.data?.message,
            placement: "topRight",
            duration: 5,
          });
        }
      });
    }
  };

  const createAgency = async () => { 
    setValue("name", '');
    setValue("description", '');
    setValue("timezone", '');
    setValue("autoValidation", '');
    setValue("zip", '');
    setValue("city", '');
    setValue("state", '');
    setValue("addressOne", '');
    setValue("addressLineTwo", '');
    setValue("addressLineThree", '');
    setValue("displayNext", '');
    setValue("parentAgency", '');
    setValue("alertList", '');
    getAgencyData([]);
  }

  

  return (
    <Row>
      <StyledColLeft md={4}>
        <Row>
          <Col md={24}>
            <h2 style={{ color: '#000'}}>Agency</h2>
          </Col>
        
          {/* <Col md={24}>
            <Checkbox onChange={onChange}>Root</Checkbox>
          </Col> */}
        </Row>

        { agencyArr.map((list, i) => 
          <>
            <Row style={{ marginTop: '0.3rem'}} key={list.id}>
              {i == 0 ? <></> : <Col md={4}></Col> }
              <Col md={20}>
                <Checkbox onChange={onFilterChange} value={list.id}>{list.name}</Checkbox>
              </Col>
            </Row>
          </>
        )}

        {agencyList?.id != null && agencyList?.id != undefined ?  
        (<>
          <Row>
            <Col md={24} style={{ marginTop: '1rem', textAlign: 'center'}}>
              <Button type="primary" onClick={(e) => {handleSubmit(createAgency)(e).catch(() => {});}}>Create Child Agency</Button>
            </Col>
          </Row>
        </>): 
        (<></>)}
      </StyledColLeft>
      
      <StyledColRight md={20}>
        <StyledHeading>Agency</StyledHeading>
        <hr />

        <Row>
          <Col md={24}>
            <StyledSubHeading>DuPage Country</StyledSubHeading>
            <hr style={{ border: 'none', borderBottom: '1px solid #ededed'}} />
          </Col>

          <Col md={12}>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Parent Agency
              </Col>
              <Col md={18}>
                <select {...register("parentAgency", )} style={{ width: '90%',borderRadius: '0px' }}>
                  <option value="">Select parent agency</option>
                  { agencyArr.map(list => <option value={list.id} key={list.id}>{list.name}</option>) }
                </select>
                {/* {errors.parentAgency?.type === 'required' && <span className='error'> Parent Agency is required</span>} */}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Name
              </Col>
              <Col md={18}>
                <input placeholder="Enter name" {...register("name", {required : true} )} style={{ width: '90%',borderRadius: '0px' }} />
                {errors.name?.type === 'required' && <div className='error'>Name is required</div>}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Description
              </Col>
              <Col md={18}>
                <input placeholder="Enter description" {...register("description", )} style={{ width: '90%',borderRadius: '0px' }} />
                {/* {errors.description?.type === 'required' && <span className='error'> description is required</span>} */}
              </Col>
            </Row>

            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Time Zone
              </Col>
              <Col md={18}>
                <select {...register("timezone", {required : true})} style={{ width: '90%',borderRadius: '0px' }}>
                  <option value="">Select time zone</option>
                  { timezoneList.map((list,i) => <option value={list} key={i}>{list}</option>) }
                </select>
                {errors.timezone?.type === 'required' && <div className='error'>Timezone is required</div>}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Default Alert List
              </Col>
              <Col md={18}>
                <select {...register("alertList", )} style={{ width: '90%',borderRadius: '0px' }}>
                  <option value="">Select list</option>
                  
                  { availableNotificationLists.map((list,i) => <option value={list.id} key={i}>{list.name}</option>) }
                </select>
                {/* {errors.alertList?.type === 'required' && <span className='error'> Value is required</span>} */}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Display Next Test Time
              </Col>
              <Col md={1} className="cs_check">
                {/* <Checkbox {...register('displayNext', {})} onChange={onChange}></Checkbox> */}
                <input type='checkbox' {...register("displayNext")} style={{height: '15px'}} />
              </Col>
            </Row>

            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Auto Validation List
              </Col>
              <Col md={18}>
                <select {...register("autoValidation", )} style={{ width: '90%',borderRadius: '0px' }}>
                  <option value="">Select auto Validation list</option>
                  <option value="MANUAL">Manual</option>
                  <option value="LIVENESS_NOT_REQUIRED">Liveness Detection Not Required</option>
                  <option value="ALL_CHECKS">All Checks Required</option>
                </select>
                {/* {errors.autoValidation?.type === 'required' && <span className='error'> Value is required</span>} */}
              </Col>
            </Row>
          </Col>

          <Col md={12}>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Address Line 1
              </Col>
              <Col md={18}>
                <input placeholder="Address line 1" {...register("addressOne", )} style={{ width: '90%',borderRadius: '0px' }} />
                {/* {errors.addressOne?.type === 'required' && <span className='error'> Value is required</span>} */}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Address Line 2
              </Col>
              <Col md={18}>
                <input placeholder="Address line 2" {...register("addressLineTwo", )} style={{ width: '90%',borderRadius: '0px' }} />
                {/* {errors.addressLineTwo?.type === 'required' && <span className='error'> Value is required</span>} */}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Address Line 3
              </Col>
              <Col md={18}>
                <input placeholder="Address line 3" {...register("addressLineThree", )} style={{ width: '90%',borderRadius: '0px' }} />
                {/* {errors.addressLineThree?.type === 'required' && <span className='error'> Value is required</span>} */}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                City
              </Col>
              <Col md={18}>
                <input placeholder="City" {...register("city", )} style={{ width: '90%',borderRadius: '0px' }} />
                {/* {errors.city?.type === 'required' && <span className='error'> Value is required</span>} */}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                State
              </Col>
              <Col md={18}>
                <select {...register("state", )} style={{ width: '90%',borderRadius: '0px' }}>
                  <option value="">Select state</option>
                  {Object.entries(stateList).map(([key, value]) =>
                    <option value={key}>{value}</option>
                  )}
                </select>
                {/* {errors.state?.type === 'required' && <span className='error'> Value is required</span>} */}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={6}>
                Zip
              </Col>
              <Col md={18}>
                <input placeholder="Zip" {...register("zip", )} style={{ width: '90%',borderRadius: '0px' }} />
                {/* {errors.zip?.type === 'required' && <span className='error'> Value is required</span>} */}
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem'}}>
              <Col md={22}>
              {agencyList?.id != null && agencyList?.id != undefined ?  
              (<>
                <Button type="primary" onClick={(e) => {handleSubmit(onUpdate)(e).catch(() => {});}}  style={{float: 'right'}}>Update Agency</Button>
              </>): 
              (<>
                <Button type="primary" onClick={(e) => {handleSubmit(onSubmit)(e).catch(() => {});}}  style={{float: 'right'}}>Save Agency</Button>
              </>)}
              </Col>
            </Row>
          </Col>
        </Row>

        {agencyList?.id != null && agencyList?.id != undefined ?  
        (<>
        <StyledSubHeading>Active Devices</StyledSubHeading>

        <ActiveDevicesHeading>
          <Row>
            <Col md={15}>
              Device
            </Col>
            <Col md={2}>
              |
            </Col>
            <Col md={7} style={{ textAlign: 'center' }}>Activate</Col>
          </Row>
        </ActiveDevicesHeading>

        {deviceList.map(d => 
          (<DeviceList key={d.id}>
            <Row>
              <Col md={17}>
                {d.name}
              </Col>
              <Col md={7} style={{ textAlign: 'center' }}>
                <Switch defaultChecked />
              </Col>
            </Row>
          </DeviceList>))
        }    

        {/* Alert Table */}
        <StyledSubHeading>Alert Groups</StyledSubHeading>

        <Row>
          <Col md={24} style={{ marginBottom: "1rem" }}>
            <Table columns={alertColumn} dataSource={alertData} pagination={false}  />
          </Col>
          <Col md={4}>
            <Input placeholder="Add Group" style={{ width: '90%',borderRadius: '0px' }} />
          </Col>
          <Col md={17}>
          </Col>
          <Col md={3} style={{ textAlign: "center" }}>
            <PlusCircleOutlined />
          </Col>
        </Row>

        {/* Website table */}
        <StyledSubHeading style={{marginTop: '4rem'}}>Website Users</StyledSubHeading>

        <Row>
          <Col md={24}>
            <Table columns={websiteColumn} dataSource={webloadData} pagination={false}  />
          </Col>
          <Col md={24}>
            <AddNewWebsite />
          </Col>
        </Row>

        {/* Contact Table */}
        <StyledSubHeading style={{marginTop: '4rem'}}>Contacts</StyledSubHeading>

        <Row>
          <Col md={24}>
            <Table columns={contactColumn} dataSource={contactList} pagination={false}  />
          </Col>
          <Col md={24}>
            <NewContact />
          </Col>
        </Row>
        </>): 
        (<></>)}
      </StyledColRight>
    </Row>
  )
}

export default Agency;
