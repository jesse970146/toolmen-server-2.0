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

const EditUser = (props) => {
  const auth = useContext(AuthContext);
  const { user } = props;
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  // const [images, setImages] = useState([]);
  const onErrorHandler = (err) => {
    notification["error"]({
      message: "User Creation Failed!",
      duration: 7,
      description:
        "An error has occurred. Please try again later. If you continue to encounter this problem, contact your admin. Error message: " +
        err.message,
      style: {
        width: 500,
      },
    });
  };

  const UserEdit = async () => {
    setEditing(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL+ "/user/" +
          (user.id || "no-input"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth.token,
          },
          body: JSON.stringify({
            event: "updateProfile",
            email: form.getFieldValue("email"),
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
      setEditing(false);
    } catch (err) {
      onErrorHandler(err);
      setEditing(false);
      console.log(err);
    }
    form.resetFields();
  };

  useEffect(() => {
  if (user) {
    form.setFieldsValue({
      email: user.email,
      quota: user.quota,
      isAdmin: user.is_admin,
      actived: user.actived,
    });
  } else {
    // form.resetFields();
  }
}, [user, form]);
  // 這裡要串接後端新增workspace
  const onFinish = () => {
    UserEdit();
  };

  return (
    <Drawer
      className="select-none"
      title="Edit User"
      placement="right"
      width={560}
      onClose={props.onClose}
      visible={props.visible}
      // extra={
      //   <Space>
      //     <Button onClick={props.onClose} disabled={editing} className="">
      //       Cancel
      //     </Button>
      //     <Button
      //       onClick={() => {
      //         onFinish();
      //       }}
      //       loading={editing}
      //       type="primary"
      //       className="bg-blue-500"
      //       htmlType="submit"
      //     >
      //       {editing && "Editing"}
      //       {!editing && "Edit"}
      //     </Button>
      //   </Space>
      // }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Name"
            >
              <div className="px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-700">
                {user?.username || "—"}
              </div>
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
              label="Lab"
            >
              <div className="px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-700">
                {user?.lab_name}
              </div>
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
        <Space>
          <Button
            // onClick={() => {
            //   form.resetFields();
            //   onFinish();
            // }}
            loading={editing}
            type="primary"
            className="bg-blue-500"
            htmlType="submit"
          >
            {editing && "Editing"}
            {!editing && "Edit"}
          </Button>
          <Button 
            onClick={() => {
              // form.resetFields();
              props.onClose();  // 再執行原本傳進來的函式
            }}
            disabled={editing} 
            className=""
          >
            Cancel
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

export default EditUser;
