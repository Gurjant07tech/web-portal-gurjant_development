import React from 'react';
import { useState } from "react";
import { Row, Col, Select, Input, Button, Checkbox  } from "antd";
import { StyledModal, StyledUserHeading } from "./NewContact.style";
import "./NewContact.css";
import { PlusCircleOutlined } from '@ant-design/icons';

const NewContact = () => {

  const [modalVisible, setModalVisible] = useState(false);

  const { Option } = Select;

  const onChange = (value) => {
    // console.log(`selected ${value}`);
  };

  const sendDaily = (value, mode) => {
    // console.log(value.format('YYYY-MM-DD'), mode);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };


  return (
    <>
      <Button type="primary" style={{marginTop: '1rem'}} onClick={(e) => {setModalVisible(true);}}>
       <PlusCircleOutlined /> New Contact
      </Button>

      <StyledModal visible={modalVisible}  width={800} onCancel={(e) => { setModalVisible(false)}}
       title={[
        <Row>
          <Col md={24} style={{ fontWeight: 'bold' }}>Add New Contact</Col>
        </Row>
      ]}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="save" type="primary">
            Save
          </Button>,
        ]}
      >
        <Row>
          <Col md={8}>
            <label><span className='required'>*</span> Name</label>
            <Input placeholder="First Name" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={8}>
            <Input placeholder="Middle Name" style={{ width: '95%',borderRadius: '0px', marginTop: '1.3rem' }} />
          </Col>
          <Col md={8}>
            <Input placeholder="Last Name" style={{ width: '95%',borderRadius: '0px', marginTop: '1.3rem' }} />
          </Col>
        </Row>

        <Row style={{ marginTop: '1.3rem' }}>
          <Col md={24}>
            <label><span className='required'>*</span> Time Zone</label>
            <Select placeholder="Time Zone" onChange={onChange} style={{ width: '98%',borderRadius: '0px' }} >
              <Option value="">Home Zone 1</Option>
              <Option value="">Home Zone 2</Option>
              <Option value="">Home Zone 3</Option>
            </Select>
          </Col>
        </Row>

        <Row style={{ marginTop: '1.3rem' }}>
          <Col md={12}>
            <label><span className='required'>*</span> Email</label>
            <Input placeholder="Email" style={{ width: '100%',borderRadius: '0px' }} />
          </Col>
          <Col md={10}>
            <Button type="primary" style={{width: '100%',marginTop: '1.3rem',marginLeft: '1rem'}}>
              Manage Email Phone Alerts
            </Button>
          </Col>
          <Col md={2}></Col>
        </Row>

        <Row style={{ marginTop: '1.3rem' }}>
          <Col md={24}><label><span className='required'>*</span> Mobile Phone</label></Col>
          <Col md={4}>
            <Input placeholder="000" style={{ width: '100%',borderRadius: '0px' }} />
          </Col>
          <Col md={4} className="mg_2">
            <Input placeholder="000" style={{ width: '100%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="000" style={{ width: '100%',borderRadius: '0px' }} />
          </Col>
          <Col md={10}>
            <Button type="primary" style={{ width: '100%', marginLeft: '1rem' }}>
              Manage Mobile Phone Alerts
            </Button>
          </Col>
          <Col md={2}></Col>
        </Row>

        <Row style={{ marginTop: '1.3rem' }}>
          <Col md={24}><label><span className='required'>*</span> Alternative Phone</label></Col>
          <Col md={4}>
            <Input placeholder="000" style={{ width: '100%',borderRadius: '0px' }} />
          </Col>
          <Col md={4} className="mg_2">
            <Input placeholder="000" style={{ width: '100%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="000" style={{ width: '100%',borderRadius: '0px' }} />
          </Col>
          <Col md={10}>
            <Button type="primary" style={{ width: '100%',marginLeft: '1rem' }}>
              Manage Alternative Phone Alerts
            </Button>
          </Col>
          <Col md={2}></Col>
        </Row>

        <Row style={{ marginTop: '1.3rem' }}>
          <Col md={24} className="cs_check"><Checkbox onChange={sendDaily}>Send Daily Breath Reports</Checkbox></Col>
        </Row>
        
        <StyledUserHeading>USER PERMISSIONS</StyledUserHeading>

        <Row style={{ marginTop: '1.3rem' }}>
          <Col md={24}>
            <label><span className='required'>*</span> Webiste User Type</label>
            <Select placeholder="Super User [admin]" onChange={onChange} style={{ width: '98%',borderRadius: '0px' }} >
              <Option value="">Home Zone 1</Option>
              <Option value="">Home Zone 2</Option>
              <Option value="">Home Zone 3</Option>
            </Select>
          </Col>
        </Row>

        <Row style={{ marginTop: '1.3rem' }}>
          <Col md={8}>
            <label><span className='required'>*</span> New Password</label>
            <Input placeholder="000" style={{ width: '100%',borderRadius: '0px' }} />
          </Col>
          <Col md={8} style={{ marginLeft: '15px' }}>
            <label>Status</label>
            <Select placeholder="Active" onChange={onChange} style={{ width: '98%',borderRadius: '0px' }} >
              <Option value="">Home Zone 1</Option>
              <Option value="">Home Zone 2</Option>
              <Option value="">Home Zone 3</Option>
            </Select>
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
          <Col md={24} className="cs_check"><Checkbox onChange={sendDaily}>Is Photo Validator</Checkbox></Col>
        </Row>
      </StyledModal>
    </>
  );
};

export default NewContact;
