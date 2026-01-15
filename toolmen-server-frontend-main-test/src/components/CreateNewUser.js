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
import { LuMicroscope } from "react-icons/lu";
const { Option } = Select;

const CreateNewUser = (props) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);
  // const [images, setImages] = useState([]);
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

  const UserCreate = async () => {
    setCreating(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL+ "/user" ,
          // (form.getFieldValue("name") || "no-input"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth.token,
          },
          body: JSON.stringify({
            username: form.getFieldValue("name"),
            // fullname: form.getFieldValue("name"),
            email: form.getFieldValue("email"),
            lab_name: form.getFieldValue("lab"),
            quota: form.getFieldValue("quota"),
            is_admin: form.getFieldValue("isAdmin"),
            actived: form.getFieldValue("actived"),
            // disabled: form.getFieldValue("disabled"),
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

  // fetch lab
  // const [LabList, setLabList] = useState([]);
  // const sendLabRequest = async () => {
  //   try {
  //     const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/lab", {
  //       headers: { Authorization: "Bearer " + auth.token },
  //     });
  //     const responseData = await response.json();

  //     if (!response.ok) {
  //       throw new Error(responseData.message);
  //     }
  //     // console.log(responseData)
  //     setLabList(responseData.labs);
  //     console.log(responseData.labs);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {
  //   sendLabRequest();
  // }, []);
    // 新增
  // 這裡要串接後端新增workspace
  const onFinish = () => {
    UserCreate();
  };

  return (
    <Drawer
      className="select-none"
      title="Create New User"
      placement="right"
      width={560}
      // onClose={props.onClose}
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
              label="Name"
              rules={[{ required: true, message: "Please enter user's name" }]}
            >
              <Input
                placeholder="Please enter user's name"
                // addonBefore={auth.userInfo.username + "-"}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[{ required: true, message: "Please enter e-mail" }]}
            >
              <Input
                placeholder="Please enter e-mail"
                // addonBefore={auth.userInfo.username + "-"}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="lab"
              label="Lab"
              rules={[{ required: true, message: "Please select lab" }]}
            >
              <Select
                placeholder="Please select a lab"
                // defaultValue="server4"
              >
                {props.LabList.map((lab) => (
                  <Option key={lab.name} value={lab.name} className="h-20 pl-4">
                    <div className="h-full flex gap-4 justify-between items-center">
                      {/* Icon 可自訂，也可全部統一使用一種 */}
                      <LuMicroscope className="text-gray-400" />
                      <div className="flex-1 flex flex-col leading-tight">
                        <div className="font-bold text-gray-700">{lab.name}</div>
                        {/* <div className="text-gray-500 leading-tight text-sm">
                          Kubernetes Node
                        </div> */}
                      </div>
                    </div>
                  </Option>
                ))}
                
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="quota"
              label="Quota"
              rules={[{ required: true, message: "Please enter user's quota" }]}
            >
              <Input
                placeholder="Please enter user's quota"
                // addonBefore={auth.userInfo.username + "-"}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="isAdmin"
              valuePropName="checked" // 告訴 Form.Item 勾選框的值是 checked 屬性
            >
              <Checkbox>Admin ? </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="actived"
              valuePropName="checked" // 告訴 Form.Item 勾選框的值是 checked 屬性
            >
              <Checkbox>Actived ?</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="disabled"
              valuePropName="checked" // 告訴 Form.Item 勾選框的值是 checked 屬性
            >
              <Checkbox>Disabled ?</Checkbox>
            </Form.Item>
          </Col>
        </Row> */}
        {/* <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: false,
                  message: "please enter url description",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="please enter url description"
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

export default CreateNewUser;
