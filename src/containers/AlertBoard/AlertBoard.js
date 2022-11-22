import React from 'react';
import { useState } from "react";
import { Row, Col, Button, Checkbox, Table } from "antd";
import { StyledModal } from "./AlertBoard.style";
import "./AlertBoard.css";
import { EditOutlined } from '@ant-design/icons';

const AlertBoard = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const handleCancel = () => {
    setModalVisible(false);
  };

  
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
      name: <Checkbox>Invalid Test (photo/tamper)</Checkbox>,
      watch: <Checkbox>Positive TAC</Checkbox>,
      gps: <Checkbox>Zone Violation(incl & excl)</Checkbox>,
      filter: <Checkbox>Critical Low Phone Battery</Checkbox>,
    },
    {
      key: '4',
      name: <Checkbox>Invalid Test (photo/tamper)</Checkbox>,
      watch: <Checkbox>Positive TAC</Checkbox>,
      gps: <Checkbox>Zone Violation(incl & excl)</Checkbox>,
      filter: <Checkbox>Critical Low Phone Battery</Checkbox>,
    },
  ];
  


  return (
    <>
      <EditOutlined onClick={(e) => {setModalVisible(true);}} />

      <StyledModal visible={modalVisible}  width={800} footer={false} closable={false} onCancel={handleCancel}
        title={[
          <Row>
            <Col md={9} style={{marginTop:'5px',fontWeight: 'bold'}}>Alerts Board</Col>
            <Col md={15}>
              <Button type="primary" style={{float: 'right',marginLeft:'1rem'}}>
                Save
              </Button>
              <Button style={{float: 'right'}} onClick={handleCancel}>Cancel</Button>
            </Col>
          </Row>
        ]}        
      >
        <Row>
          <Col md={24} className="cs_table">
            <Table dataSource={dataSource} columns={columns} pagination={false} className="cs_check" />
          </Col>
        </Row>

       
      </StyledModal>
    </>
  );
};

export default AlertBoard;
