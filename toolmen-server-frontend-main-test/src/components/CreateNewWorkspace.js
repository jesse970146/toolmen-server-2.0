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
import { LiaDocker } from "react-icons/lia";

import  AuthContext  from "../context/auth-context";

const { Option } = Select;

const CreateNewWorkspace = (props) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);

  const onErrorHandler = (err) => {
    notification["error"]({
      message: "Workspace Creation Failed!",
      duration: 7,
      description:
        "An error has occurred. Please try again later. If you continue to encounter this problem, contact your admin. Error message: " +
        err.message,
      style: {
        width: 500,
      },
    });
  };

  const workspaceCreate = async () => {
    setCreating(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL+ "/workspace" ,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth.token,
          },
          body: JSON.stringify({
            name: form.getFieldValue("name"),
            image: form.getFieldValue("image"),
            server: form.getFieldValue("server")
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
    workspaceCreate();
  };

  return (
    <Drawer
      className="select-none"
      title="Create New Workspace"
      placement="right"
      width={560}
      onClose={() => {
        form.resetFields();
        props.onClose();  // 再執行原本傳進來的函式
      }}
      open={props.visible}
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
              label="Name"
            >
              <Input
                placeholder="Please enter a workspace name"
                addonBefore={auth.userInfo.username + "-"}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="server"
              label="server"
              rules={[{ required: true, message: "Please select an server" }]}
            >
              <Select
                placeholder="Please select an server"
                size="large"
              >
                {props.NodeList.map((nodeName) => (
                  <Option key={nodeName} value={nodeName} className="h-20 pl-4">
                    <div className="h-full flex gap-4 justify-between items-center">
                      <FiServer className="h-8 w-8 text-gray-400" />
                      <div className="flex-1 flex flex-col leading-tight">
                        <div className="font-bold text-gray-700">{nodeName}</div>
                      </div>
                    </div>
                  </Option>
                ))}
                {/* <Option value="server2" className="h-20 pl-4">
                  <div className="h-full flex gap-4 justify-between items-center">
                    <CgServer className="h-9 w-9 text-gray-400" />
                    <div className="flex-1 flex flex-col leading-tight">
                      <div className="font-bold text-gray-700">Server 2</div>
                      <div className="text-gray-500 leading-tight text-sm">
                        GeForce® GTX 1080 Ti × 2
                      </div>
                    </div>
                  </div>
                </Option>
                <Option value="server4" className="h-20 pl-4">
                  <div className="h-full flex gap-4 justify-between items-center">
                    <FiServer className="h-8 w-8 text-gray-400" />
                    <div className="flex-1 flex flex-col leading-tight">
                      <div className="font-bold text-gray-700">Server 4</div>
                      <div className="text-gray-500 leading-tight text-sm">
                        NVIDIA Titan RTX × 2 <br /> GeForce® GTX 3070 Ti × 2
                      </div>
                    </div>
                  </div>
                </Option>
                <Option value="server5" className="h-20 pl-4">
                  <div className="h-full flex gap-4 justify-between items-center">
                    <FiServer className="h-8 w-8 text-gray-400" />
                    <div className="flex-1 flex flex-col leading-tight">
                      <div className="font-bold text-gray-700">Server 5</div>
                      <div className="text-gray-500 leading-tight text-sm">
                        NVIDIA Titan RTX × 2 <br /> GeForce® GTX 3070 Ti × 2
                      </div>
                    </div>
                  </div>
                </Option> */}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="image"
              label="Image"
              rules={[{ required: true, message: "Please select an image" }]}
            >
              <Select
                placeholder="Please select an image"
                size="large"
              >
                {props.ImageList.map((image) => (
                  <Option  value={image.name} className="h-24 pl-4">
                    <div className="h-full flex gap-4 justify-between items-center min-w-0">
                      <LiaDocker  className="h-8 w-8 text-gray-400" />
                      <div className="flex-1 min-w-0 w-full flex flex-col leading-tight">
                        <div className="font-bold text-gray-700">{image.name}</div>
                        <div className="text-gray-500 leading-tight text-sm break-words whitespace-normal max-w-full overflow-hidden">
                          {image.Description}
                        </div>
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Space>
          <Button
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
              props.onClose();  
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

export default CreateNewWorkspace;
