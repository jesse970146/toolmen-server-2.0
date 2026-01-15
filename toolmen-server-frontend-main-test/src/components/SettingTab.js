import React, { useState, useEffect, useContext} from "react";
import { Empty, Button } from "antd";
import  AuthContext  from "../context/auth-context";
import webSocket from "socket.io-client";
import {
  // Button,
  Space,
  Select,
  Drawer,
  Form,
  Row,
  Col,
  Input,
  notification,
} from "antd";
const SettingTab = (props) => {
  const auth = useContext(AuthContext);
  console.log("👀 userInfo:", auth.userInfo);
  // const [ws, setWs] = useState(null);

  // const connectWebSocket = () => {
  //   //開啟
  //   setWs(webSocket("http://localhost:7890/ws/dataPush"));
  // };
    const [form] = Form.useForm();
    const onErrorHandler = (err) => {
        notification["error"]({
          message: "Workspace Creation Failed!",
          duration: 7,
          description:
          (
            <>
              An error has occurred. Please try again later.<br />
              Error message: {err?.message}
            </>
          ),
            // "An error has occurred. Please try again later. <br /> Error message: " +
            // err.message,
          style: {
            width: 500,
          },
        });
      };

   
  const onFinish = (values) => {
    console.log('變更密碼資料：', values);
    ChangePassword();
    form.resetFields(); // 可選：成功送出後清空表單
    
  };
  const ChangePassword = async () => {
    // setCreating(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL+ "/user/" +
          (auth.userInfo.id || "no-input"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth.token,
          },
          body: JSON.stringify({
            oldPassword: form.getFieldValue("oldPassword"),
            newPassword: form.getFieldValue("newPassword"),
            event: "resetPassword"
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      // props.sendRequest();
      // console.log("sendRequest prop:", props.sendRequest);
      // props.onClose();
      // setCreating(false);
    } catch (err) {
      onErrorHandler(err);
      // setCreating(false);
      console.log(err);
    }
    notification["success"]({
          message: "Password change successfully",
          duration: 3,
          description:
          (
            <>
              The password has changed successfully. <br />
              Will logout in 5 seconds, please login again.
            </>
          ),
          style: {
            width: 500,
          },
        });
    form.resetFields();
    setTimeout(auth.logout, 5000);
  };
  // useEffect(() => {
  //   if (ws) {
  //     //連線成功在 console 中打印訊息
  //     console.log("success connect!");
  //     //設定監聽
  //     initWebSocket();
  //   }
  // }, [ws]);

  // const initWebSocket = () => {
  //   //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
  //   ws.on("push_data", (message) => {
  //     console.log(message);
  //   });
  // };

  // const sendMessage = () => {
  //   //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
  //   ws.emit("sub", "只回傳給發送訊息的 client");
  // };

  return (
    <div>
      {/* <Button onClick={connectWebSocket}>connectWebSocket</Button>
      <Button onClick={sendMessage}>sendMessage</Button> */}
      <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[{ required: true, message: "Please enter old password" }]}
          >
            <Input.Password placeholder="Enter old password" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: "Please enter new password" }]}
            hasFeedback
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
        </Col>
      </Row>

      <Button type="primary" className="bg-blue-500" htmlType="submit">Submit</Button>
    </Form>
    </div>
    
  );
};
export default SettingTab;
