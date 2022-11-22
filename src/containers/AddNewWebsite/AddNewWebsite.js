import React, { useState, useEffect } from "react";
import { Row, Col, Button, Checkbox, notification, Table } from "antd";
import { StyledModal, StyledUserHeading } from "./AddNewWebsite.style";
import "./AddNewWebsite.css";
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useForm } from "react-hook-form";
import endpoint from "api/endpoint";
import { useSelector, useDispatch } from "react-redux";
import apiHandler from "api";
import { setWebsiteUserData } from "features/agency/websiteUserSlice";
import { showWebsiteUser } from "features/common/commonSlice";


const AddNewWebsite = () => {
  const dispatch = useDispatch();
  const { userData, authToken } = useSelector((state) => state.login);
  // const [modalVisible, setModalVisible] = useState(false);
  const [isPhoto, setPhoValidate] = useState(false);
  const [sendDailyData, setSendDaily] = useState(false);
  const [userTypeList, setUserTypeList] = useState([]);
  const [timezoneList, getTimeZoneList] = useState([]);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const handleAlertCancel = () => { setAlertModalVisible(false); };
  const photoValidator = (value) => { setPhoValidate(value.target.checked) };
  const sendDaily = (value) => { setSendDaily(value.target.checked) };
  const handleCancel = () => { dispatch(showWebsiteUser(false)); };
  const { register, getValues, setValue, reset, handleSubmit, formState: {errors} } = useForm();
  const { showWebModal } = useSelector((state) => state.common);
  const editList = useSelector( (state) => state.editUserData.editDataObj );

  const [alertList, setAlertList] = useState([{
    key: '1',
    name: <Checkbox>Select all</Checkbox>,
    watch: <Checkbox>Select all</Checkbox>,
    gps: <Checkbox>Select all</Checkbox>,
    filter: <Checkbox>Select all</Checkbox>,
  }]);

  useEffect(() => {
    fetchDetails();
  }, [setUserTypeList]);


  const fetchDetails = () => { 
    apiHandler({
      url: endpoint.AMIN_WEBSITE_USER_TYPES,
      authToken,
    }).then((result) => {
      setUserTypeList(result.data);
    });
    getTimezone();
  }

  const getTimezone = () => {
    apiHandler({
      url: `${endpoint.AVAILABLE_TIMEZONE}`,
      authToken,
    }).then((result) => {
      getTimeZoneList(result.data);
    });

    apiHandler({
      url: `${endpoint.AVAILABLE_EVENT_TYPES}`,
      authToken,
    }).then((result) => {
      if(result){
        if(result?.data.length > 0){
          let finalData = [];
          result.data.forEach((el,i)=>{
            let make = {};
            make["key"] = (i+2);
            result.data.forEach((row,i)=>{
              if(row.deviceTypeName == "Breathalyzer") {
                make.name= <Checkbox>{row.name}</Checkbox>
              }
              if(row.deviceTypeName == "Watch") {
                make.name= <Checkbox>{row.name}</Checkbox>
              }
              if(row.deviceTypeName == "GPS") {
                make.name= <Checkbox>{row.name}</Checkbox>
              }
              if(row.deviceTypeName == "Breathalyzer") {
                make.name= <Checkbox>{row.name}</Checkbox>
              }
            });
            finalData.push(make);
          })
          setAlertList(finalData);
        }
      }
    });
  }

  const onSubmit = async () => {
    if(showWebModal == false){ 
      const values = getValues(); 
      const filterName = userTypeList.filter(x => values.userType == x.id);
      if(filterName.length > 0){
        // console.log(values)
        let agency = [];
        if(userData?.agencies.length > 0){
          userData?.agencies.map((list, i) =>  {
            agency.push({id: list.id});
          })
        }
  
        await apiHandler({
          url: '/admin/user',
          method: "POST",
          data: {
            "firstName": values.firstname,
            "middleName": values.middlename,
            "lastName": values.lastname,
            "timeZone": values.timezone,
            "email": values.email,
            "notifyViaEmail": false,
            "notifyViaMobilePhoneText": true,
            "notifyViaAltPhoneText": false,
            "sendDailyReports": sendDailyData,
            "websiteUserType": {
              "id": parseInt(values.userType),
              "name": filterName[0].name
            },
            "status": values.webStatus,
            "isPhotoValidator": isPhoto,
            "agencies": agency,
            "mobilePhone": "("+values.phone1 +")-"+ values.phone2 +"-"+ values.phone3,
            "altPhone": "("+values.alphone1 +")-"+ values.alphone2 +"-"+ values.alphone3,
          },
          authToken: authToken,
        }).then(async (result) => {
          if(result?.data?.id != undefined){
            getUpdateWebsiteUser();
            dispatch(showWebsiteUser(false));
            reset();
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
    }
    else{
      updateWebsite();
    }
  };

  const updateWebsite = async () => {
    const values = getValues(); 
    let agency = [];
    if(userData?.agencies.length > 0){
      userData?.agencies.map((list, i) =>  {
        agency.push({id: list.id});
      })
    }

    await apiHandler({
      url: '/admin/user',
      method: "POST",
      data: {
        "id": editList?.id,
        "firstName": values.firstname,
        "middleName": values.middlename,
        "lastName": values.lastname,
        "timeZone": values.timezone,
        "email": values.email,
        "notifyViaEmail": false,
        "notifyViaMobilePhoneText": true,
        "notifyViaAltPhoneText": false,
        "sendDailyReports": sendDailyData,
        "websiteUserType": editList?.websiteUserType,
        "status": values.webStatus,
        "isPhotoValidator": isPhoto,
        "agencies": agency,
        "mobilePhone": "("+values.phone1 +")-"+ values.phone2 +"-"+ values.phone3,
        "altPhone": "("+values.alphone1 +")-"+ values.alphone2 +"-"+ values.alphone3,
      },
      authToken: authToken,
    }).then(async (result) => {
      if(result?.data?.id != undefined){
        getUpdateWebsiteUser();
        dispatch(showWebsiteUser(false));
        reset();
      }
      else{
        notification.info({
          description: result?.data?.message,
          placement: "topRight",
          duration: 5,
        });
      }
    });
  };


  const getUpdateWebsiteUser = async () => {
    let activeId = '';
    if(userData?.agencies.length > 0){
      activeId = userData?.agencies[0]['id'];
    }
    apiHandler({
      url: `${endpoint.ADMIN_AGENCY}/${activeId}`,
      authToken,
    }).then((result) => {
      notification.success({
        description: "Website user added successfully",
        placement: "topRight",
        duration: 5,
      });
      if(result){
        if(result?.data?.websiteUsers.length > 0){
          dispatch(setWebsiteUserData(result.data.websiteUsers.map((row,i) =>({
            key: (i+1),
            name: row.firstName +" "+row.lastName,
            preferred: row.email,
            status: row.status,
            edits: <EditOutlined />,
          }))));
        }
      }
    });
  }


  // Alert Modal
  const columns = [
    {
      title: 'TRAC Breathalyzer',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'TRAC Watch',
      dataIndex: 'watch',
      key: 'watch',
    },
    {
      title: 'TRAC GPS Watch',
      dataIndex: 'gps',
      key: 'gps',
    },
    {
      title: 'Universal Filters',
      dataIndex: 'filter',
      key: 'filter',
    },
  ];

  const dataSource = [
    {
      key: '1',
      name: <Checkbox>Select all</Checkbox>,
      watch: <Checkbox>Select all</Checkbox>,
      gps: <Checkbox>Select all</Checkbox>,
      filter: <Checkbox>Select all</Checkbox>,
    },
    {
      key: '2',
      name: <Checkbox>Invalid Test (photo/tamper)</Checkbox>,
      watch: <Checkbox>Positive TAC</Checkbox>,
      gps: <Checkbox>Zone Violation(incl & excl)</Checkbox>,
      filter: <Checkbox>Critical Low Phone Battery</Checkbox>,
    },
    {
      key: '3',
      name: <Checkbox>Critically Low Breathalyzer Battery</Checkbox>,
      watch: <Checkbox>Critically Low Watch Battery</Checkbox>,
      gps: <Checkbox>Critically Low TARC GPS Watch Battery</Checkbox>,
      filter: <Checkbox>Location Unavailable</Checkbox>,
    },
    {
      key: '4',
      name: <Checkbox>Positive BrAC Test</Checkbox>,
      watch: <Checkbox>Strap Temper</Checkbox>,
      gps: <Checkbox>Strap Temper</Checkbox>,
      filter: <Checkbox>No Recent Communication</Checkbox>,
    },
    {
      key: '5',
      name: <Checkbox>Missed BrAC Test</Checkbox>,
      watch: <Checkbox>Obstruction Tamper</Checkbox>,
      gps: <Checkbox>TRAC GPS Watch Shutdown</Checkbox>,
      filter: <Checkbox>Insufficient Permissions</Checkbox>,
    },
    {
      key: '6',
      name: <></>,
      watch: <></>,
      gps: <Checkbox>Shielding Detected</Checkbox>,
      filter: <Checkbox>Case Temper</Checkbox>,
    },
  ];


  if(showWebModal == true){
    // fetchDetails();
    // console.log(editList);
    setValue("firstname", editList?.firstName);
    setValue("middlename", editList?.middleName);
    setValue("lastname", editList?.lastName);
    setValue("timezone", editList?.timeZone);
    setValue("email", editList?.email);
    // setValue("phone1", '');
    // setValue("phone2", '');
    // setValue("phone3", '');
    // setValue("alphone1", '');
    // setValue("alphone2", '');
    // setValue("alphone3", '');
    setValue("userType", editList?.role);
    // setValue("newpassword", editList?.firstName);
    setValue("webStatus", editList?.status);
    // setSendDaily(editList?.sendDailyReports);
    // setPhoValidate(editList?.isPhotoValidator);
  }

  return (
    <>

      <Button type="primary" style={{marginTop: '1rem'}} onClick={() => { fetchDetails(); dispatch(showWebsiteUser(true));}}>
       <PlusCircleOutlined /> New Website User
      </Button>

      <StyledModal visible={showWebModal}  width={800} onCancel={(e) => { dispatch(showWebsiteUser(false)); }}
      title={[
        <Row>
          {showWebModal == true ?  (
          <Col md={24} style={{ fontWeight: 'bold' }}>Edit Website User</Col>
          ): (<Col md={24} style={{ fontWeight: 'bold' }}>Add New Website User</Col>)}
        </Row>
      ]}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          
          <Button key="save" type="primary" onClick={(e) => {handleSubmit(onSubmit)(e).catch(() => {});}} className="ant-btn ant-btn-primary">
            Save
          </Button>,
        ]}
      >
        <form>
          <Row>
            <Col md={8}>
              <label><span className='required'>*</span> Name</label>
              {/* <Input placeholder="First Name" style={{ width: '95%',borderRadius: '0px' }} /> */}
              <input placeholder="Enter first name"  {...register("firstname", { required: true})} style={{ width: '95%',borderRadius: '0px' }} />
              {errors?.firstname?.type === 'required' && <span className='error'> First name is required</span>}
            </Col>
            <Col md={8}>
              <input placeholder="Enter middle name" {...register("middlename", { required: false})} style={{ width: '95%',borderRadius: '0px', marginTop: '1.3rem' }} />
            </Col>
            <Col md={8}>
              <input placeholder="Enter last name" {...register("lastname", { required: true})} style={{ width: '95%',borderRadius: '0px', marginTop: '1.3rem' }} />
              {errors?.lastname?.type === 'required' && <span className='error'> Last name is required</span>}
            </Col>
          </Row>

          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={24}>
              <label><span className='required'>*</span> Time Zone</label>
              <select {...register("timezone", { required: true})}>
                <option value="">Select time zone</option>
                { timezoneList.map((list,i) => <option value={list} key={i}>{list}</option>) }
              </select>
              {errors?.timezone?.type === 'required' && <span className='error'> Timezone is required</span>}
            </Col>
          </Row>

          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={12}>
              <label><span className='required'>*</span> Email</label>
              <input placeholder="Enter email" {...register("email", { required: true, pattern: /\S+@\S+\.\S+/ })} />
              {errors?.email?.type === 'required' && <span className='error'> Email is required</span>}
              {errors?.email?.type === 'pattern' && <span className='error'> Invalid email</span>}
            </Col>
            <Col md={10}>
              <Button type="primary" onClick={() => { setAlertModalVisible(true);}}  style={{width: '100%',marginTop: '1.3rem',marginLeft: '1rem'}}>
                Manage Email Phone Alerts
              </Button>
            </Col>
            <Col md={2}></Col>
          </Row>

          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={24}><label><span className='required'>*</span> Mobile Phone</label></Col>
            <Col md={4}>
              <input placeholder="000" maxlength="3" {...register("phone1", { required: true, pattern: /^[\d]{0,3}$/ })} />
            </Col>
            <Col md={4} className="mg_2">
              <input placeholder="000" maxlength="3" {...register("phone2", { required: true, pattern: /^[\d]{0,3}$/ })} />
            </Col>
            <Col md={4}>
              <input placeholder="000" maxlength="3" {...register("phone3", { required: true, pattern: /^[\d]{0,3}$/ })} />
            </Col>
            <Col md={10}>
              <Button type="primary" onClick={() => { setAlertModalVisible(true);}} style={{ width: '100%', marginLeft: '1rem' }}>
                Manage Mobile Phone Alerts
              </Button>
            </Col>
            <Col md={2}></Col>
            <Col md={24}>
              {(errors.phone1?.type === 'required' || errors.phone2?.type === 'required' || errors.phone3?.type === 'required') && <span className='error'> Phone no required</span>}
              {(errors.phone1?.type === 'pattern' || errors.phone2?.type === 'pattern' || errors.phone3?.type === 'pattern') && <span className='error'> Invalid phone number</span>}
            </Col>
          </Row>

          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={24}><label><span className='required'>*</span> Alternative Phone</label></Col>
            <Col md={4}>
              <input placeholder="000" maxlength="3" {...register("alphone1", { required: true, pattern: /^[\d]{0,3}$/ })} />
            </Col>
            <Col md={4} className="mg_2">
              <input placeholder="000" maxlength="3" {...register("alphone2", { required: true, pattern: /^[\d]{0,3}$/ })} />
            </Col>
            <Col md={4}>
              <input placeholder="000" maxlength="3" {...register("alphone3", { required: true, pattern: /^[\d]{0,3}$/ })} />
            </Col>
            <Col md={10}>
              <Button type="primary" onClick={() => { setAlertModalVisible(true);}} style={{ width: '100%',marginLeft: '1rem' }}>
                Manage Alternative Phone Alerts
              </Button>
            </Col>
            <Col md={2}></Col>
            <Col md={24}>
              {(errors.alphone1?.type === 'required' || errors.alphone2?.type === 'required' || errors.alphone3?.type === 'required') && <span className='error'> Phone no required</span>}
              {(errors.alphone1?.type === 'pattern' || errors.alphone2?.type === 'pattern' || errors.alphone3?.type === 'pattern') && <span className='error'> Invalid phone number</span>}
            </Col>
          </Row>

          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={24} className="cs_check"><Checkbox  onChange={sendDaily}>Send Daily Breath Reports</Checkbox></Col>
          </Row>
          
          <StyledUserHeading>USER PERMISSIONS</StyledUserHeading>

          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={24}>
              <label><span className='required'>*</span> Webiste User Type</label>
              <select {...register("userType", { required: true})}>
                <option value="">Select user type</option>
                { userTypeList.map(list => <option value={list.name} key={list.id} >{list.name}</option>) }
              </select>
              {errors?.userType?.type === 'required' && <span className='error'> User type is required</span>}
            </Col>
          </Row>

          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={8}>
              <label><span className='required'>*</span> New Password</label>
              <input type="password" placeholder="Enter new password" {...register("newpassword", { required: true })} />
              {errors?.newpassword?.type === 'required' && <span className='error'> New passsword is required</span>}
            </Col>
            <Col md={8} style={{ marginLeft: '15px' }}>
              <label>Status</label>
              <select {...register("webStatus")}>
                <option value="">Select status</option>
                <option value="ACTIVE">Active</option>
                <option value="IN-ACTIVE">In Active</option>
              </select>
            </Col>
          </Row>

          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={24}>TRAC Agencies</Col>
          </Row>
          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={9}>Name</Col>
            <Col md={9}>Time Zone</Col>
          </Row>
          <Row style={{ marginTop: '0.5rem' }}>
            <Col md={9}>Root</Col>
            <Col md={9}>US/Central</Col>
          </Row>

          <Row style={{ marginTop: '1.3rem' }}>
            <Col md={24} className="cs_check"><Checkbox onChange={photoValidator}>Is Photo Validator</Checkbox></Col>
          </Row>
        </form>
      </StyledModal>


      {/* Alert modal */}
      {alertModalVisible == true ?  (
      <StyledModal visible={alertModalVisible}  width={1000} footer={false} closable={false} onCancel={handleAlertCancel}
        title={[
          <Row>
            <Col md={9} style={{marginTop:'5px',fontWeight: 'bold'}}>Alerts Board</Col>
            <Col md={15}>
              <Button type="primary" style={{float: 'right',marginLeft:'1rem'}}>
                Save
              </Button>
              <Button style={{float: 'right'}} onClick={handleAlertCancel}>Cancel</Button>
            </Col>
          </Row>
        ]}        
      >
        <Row>
          <Col md={24} className="cs_table">
            <Table dataSource={dataSource} columns={columns} pagination={false} className="cs_check" />
          </Col>
        </Row>
      </StyledModal>): (<></>)}
      
    </>
  );
};

export default AddNewWebsite;