import {
  Col,
  Table,
  Drawer,
  Row,
  Space,
  Input,
  Button,
  Alert,
  Radio
} from "antd";
import apiHandler from "api";
import endpoint from "api/endpoint";
import { showMessageDrawer } from "features/common/commonSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MessageDrawer = () => {
  const dispatch = useDispatch();
  const showDrawer = useSelector((state) => state.common.showMessageDrawer);
  const [message, setMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const onClose = () => {
    dispatch(showMessageDrawer(false));
  };

  const onChange = (e) => {
    if(e.target.checked){
      setMessage(e.target.value);
    }
    else{
      setMessage('');
    }
    
  };

  const { participantProfileData } = useSelector(
    (state) => state.participantProfileData
  );

  const { authToken } = useSelector((state) => state.login);

  const sendMessage = async () => {
    await apiHandler({
      url:
        endpoint.ENROLL_PARTICIPANT +
        "/" +
        participantProfileData?.id +
        "/message",
      method: "POST",
      authToken: authToken,
      data: message,
    }).then((response) => {
      setSuccessMessage("Message sent to the participant");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    });
  };

  const columns = [
    {
      title: "Canned Messages",
      dataIndex: "message",
      sorter: true,
      render: (message) => (
        <Radio value={message}>{message}</Radio> 
      ),
    },
  ];
  const data = [
    {
      key: 0,
      message: "Please call your supervision officer immediately.",
    },
    {
      key: 1,
      message: "Please call CAM Systems as soon as possible at 800-208-3244.",
    },
    {
      key: 2,
      message: "Please perform an alcohol test immediately.",
    },
    {
      key: 3,
      message:
        "You have been randomly selected to perform a breath test now. Please do so immediately.",
    },
    {
      key: 4,
      message:
        "Your TRAC device requires a service update. Please call CAM Systems right away at 800-208-3244 to schedule this.",
    },
    {
      key: 5,
      message:
        "Your scheduled program payment has declined. Please call 800-208-3244 immediately to make up this payment.",
    },
    {
      key: 6,
      message:
        "Your account is past due and a payment must be made within 24 hours to prevent your account from going to collections. Please call 800-208-3244 to make your payment.",
    },
    {
      key: 7,
      message:
        "REMINDER:  You have a probation appointment coming up.  Please call your officer if you have any questions.",
    },
    {
      key: 8,
      message:
        "REMINDER:  You have a CAM Systems service appointment coming up.  Please call us at 800-208-3244 if you have any questions.",
    },
    {
      key: 9,
      message: "URGENT:  A violation has been sent to the court.",
    },
    {
      key: 10,
      message:
        "URGENT:  You have missed a scheduled breath test. You must perform a breath test immediately.You have a failed test.  This is a warning.  Remember, no hats, no sunglasses, and no obstructing the camera.",
    },
  ]; // rowSelection object indicates the need for row selection

  return (
    <Drawer
      destroyOnClose
      title="Send Message to Participant"
      placement="right"
      size="500"
      onClose={onClose}
      visible={showDrawer}
    >
      <div className="container">
        {successMessage && (
          <Alert message={successMessage} banner type="success" />
        )}
        <Row>
          <Col span={24}>
          <Radio.Group onChange={(e)=>onChange(e)} value={message}>
            <Space direction="vertical" size={12}>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ y: 400 }}
              />
              <Input.TextArea rows={5} value={message} />
            </Space>
            </Radio.Group>
          </Col>
        </Row>
        <div
          style={{
            position: "fixed",
            width: "100%",
            padding: 10,
            display: "flex",
            justifyContent: "flex-end",
            bottom: 0,
            borderTop: "1px solid #c5c5c5",
            left: 0,
            background: "#fff",
          }}
          className="container"
        >
          <Space>
            <Row>
           
              <Col span={10} className="mt-10">
                <Button
                  onClick={() => onClose()}
                  type="primary"
                  style={{ marginTop: "20px" }}
                  htmlType="button"
                >
                  Cancel
                </Button>
              </Col>
              <Col span={8} className="mt-10">
              <Button
                  onClick={() => sendMessage()}
                  type="primary"
                  style={{ marginTop: "20px" }}
                  htmlType="button"
                  disabled={message ? false : true}
                >
                  Send Message
                </Button>
              </Col>
            </Row>
          </Space>
        </div>
      </div>
    </Drawer>
  );
};

export default MessageDrawer;
