import React from 'react';
import { useState } from "react";
import { Row, Col, Select, Input, Button, Table  } from "antd";
import { StyledModal, StyledSubHeading } from "./EditAlerts.style";
import "./EditAlerts.css";
import { EditOutlined } from '@ant-design/icons';

const EditAlerts = () => {

  const [modalVisible, setModalVisible] = useState(false);

  const handleCancel = () => {
    setModalVisible(false);
  };

  // Alerts column data
  const alertColumn = [
    {
      title: 'Last Name, First Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Alert Filters',
      dataIndex: 'alertFilters',
      key: 'alertFilters'
    },
    {
      title: '',
      dataIndex: 'editAlert',
      key: 'editAlert',
      align: 'center'
    }
  ];

  const alertData = [
    {
      key: '1',
      name: 'Admin, Super',
      role: 'Agency Admin',
      email: 'junk@test.org',
      phone: '000-000-0000',
      alertFilters: 'All Alerts Active',
      editAlert: <EditOutlined />,
    },
  ];


  // Alerts column data
  const breathColumn = [
    {
      title: 'Last Name, First Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Alert Filters',
      dataIndex: 'alertFilters',
      key: 'alertFilters'
    },
    {
      title: '',
      dataIndex: 'editAlert',
      key: 'editAlert',
      align: 'center'
    }
  ];

  const breathData = [
    {
      key: '1',
      name: 'Admin, Super',
      role: 'Agency Admin',
      email: 'junk@test.org',
      phone: '000-000-0000',
      alertFilters: 'All Alerts Active',
      editAlert: <EditOutlined />,
    },
  ];


  return (
    <>
      <EditOutlined onClick={(e) => {setModalVisible(true);}} />
      <StyledModal visible={modalVisible}  width={950} onCancel={(e) => { setModalVisible(false)}}
       title={[
        <Row>
          <Col md={24} style={{ fontWeight: 'bold' }}>Edit Alerts</Col>
        </Row>
        ]}
        footer={false}
      >
        <Row>
          <Col md={4}>Agency</Col>
          <Col md={4}>Root</Col>
        </Row>

        <Row style={{ marginTop: '1.3rem' }}>
          <Col md={4}>Name</Col>
          <Col md={4}>Demo</Col>
        </Row>

        <Row style={{ marginTop: '1.3rem' }}>
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

        
        <StyledSubHeading style={{marginTop: '2rem'}}>Alerts</StyledSubHeading>

        <Row>
          <Col md={24}>
            <Table columns={alertColumn} dataSource={alertData} pagination={false}  />
          </Col>
        </Row>
        
        <Row style={{marginTop: '1rem'}}>
          <Col md={4}>
            <Input placeholder="Last Name" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="First Name" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="Judge Lawyer" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="Email" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="Phone" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Button type="primary">
              Submit
            </Button>
          </Col>
        </Row>


        <StyledSubHeading style={{marginTop: '3.5rem'}}>Automated Breath Reports</StyledSubHeading>

        <Row>
          <Col md={24}>
            <Table columns={breathColumn} dataSource={breathData} pagination={false}  />
          </Col>
        </Row>

        <Row style={{marginTop: '1rem'}}>
          <Col md={4}>
            <Input placeholder="Last Name" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="First Name" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="Judge Lawyer" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="Email" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Input placeholder="Phone" style={{ width: '95%',borderRadius: '0px' }} />
          </Col>
          <Col md={4}>
            <Button type="primary">
              Submit
            </Button>
          </Col>
        </Row>
      </StyledModal>
    </>
  );
};

export default EditAlerts;
