import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Space,
  Select,
  Drawer,
  Form,
  Row,
  Col,
  Input,
  notification,
} from "antd";
import { FiServer } from "react-icons/fi";
import { CgServer } from "react-icons/cg";
import { Checkbox } from 'antd';
import  AuthContext  from "../context/auth-context";

const { Option } = Select;

const CreateNewLab = (props) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);

  const onErrorHandler = (err) => {
    notification["error"]({
      message: "Image Creation Failed!",
      duration: 7,
      description:
        "An error has occurred. Please try again later. Error message: " +  err.message,
      style: {
        width: 500,
      },
    });
  };

  const LabCreate = async () => {
    setCreating(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL+ "/labs" ,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth.token,
          },
          body: JSON.stringify({
            name: form.getFieldValue("name"),
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      props.sendRequest();
      props.onClose();
      setCreating(false);
    } catch (err) {
      onErrorHandler(err);
      setCreating(false);
      console.log(err);
    }
    form.resetFields();
  };

  // 這裡要串接後端新增workspace
  const onFinish = () => {
    LabCreate();
  };

  return (
    <Drawer
      className="select-none"
      title="Create New Lab"
      placement="right"
      width={560}
      onClose={() => {
        form.resetFields();
        props.onClose();  // 再執行原本傳進來的函式
      }}
      visible={props.visible}
      // extra={
      //   <Space>
      //     <Button onClick={props.onClose} disabled={creating} className="">
      //       Cancel
      //     </Button>
      //     <Button
      //       onClick={() => {
      //         onFinish();
      //       }}
      //       loading={creating}
      //       type="primary"
      //       className="bg-blue-500"
      //       htmlType="submit"
      //     >
      //       {creating && "Creating"}
      //       {!creating && "Create"}
      //     </Button>
      //   </Space>
      // }
    >
      <Form
        layout="vertical"
        requiredMark="optional"
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Lab name"
              rules={[{ required: true, message: "Please enter lab name" }]}
            >
              <Input
                placeholder="Please enter lab name"
              />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="value"
              label="Value"
              rules={[{ required: true, message: "Please enter the name of image in docker hub" }]}
            >
              <Input
                placeholder="Please enter the name of image in docker hub"
              />
            </Form.Item>
          </Col>
        </Row> */}
        {/* <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="Description"
              label="Description"
              rules={[{ required: true, message: "Please enter the description of image" }]}
            >
              <Input
                placeholder="Please enter the description of image"
              />
            </Form.Item>
          </Col>
        </Row> */}
        <Space>
          <Button
            // onClick={() => {
            //   onFinish();
            // }}
            loading={creating}
            type="primary"
            className="bg-blue-500"
            htmlType="submit"
          >
            {creating && "Creating"}
            {!creating && "Create"}
          </Button>
          <Button 
            onClick={() => {
              form.resetFields();
              props.onClose();  // 再執行原本傳進來的函式
            }}
            disabled={creating} 
            className=""
          >
            Cancel
          </Button>
        </Space>

      </Form>
    </Drawer>
  );
};

export default CreateNewLab;
