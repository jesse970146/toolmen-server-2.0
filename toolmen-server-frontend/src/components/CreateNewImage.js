import React, { useState, useContext } from "react";
import {
  App,
  Button,
  Drawer,
  Form,
  Input,
} from "antd";
import { 
  FileImageOutlined, 
  CloudServerOutlined, 
} from "@ant-design/icons";
import AuthContext from "../context/auth-context";

const CreateNewImage = ({ visible, onClose, sendRequest }) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const { notification, message} = App.useApp();
  // 錯誤通知
  const onErrorHandler = (err) => {
    notification.error({
      message: "Creation Failed",
      description: err.message || "An error occurred while creating the image.",
      placement: "topRight",
    });
  };

  // 提交表單
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({
          name: values.name,
          value: values.value,
          description: values.description, // 注意：後端似乎需要大寫開頭的 Description
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong");
      }

      message.success("Image created successfully!");
      sendRequest(); // 重新整理列表
      handleClose(); // 關閉視窗並重置
    } catch (err) {
      onErrorHandler(err);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 統一處理關閉 (重置表單)
  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title="Create New Image"
      placement="right"
      width={500}
      onClose={handleClose}
      open={visible}
      maskClosable={!submitting}
      // 將按鈕移至底部 Footer
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={() => form.submit()}
            type="primary"
            loading={submitting}
            className="bg-blue-500"
          >
            Create Image
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark="optional"
      >
        <h3 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-wider">Image Details</h3>

        <Form.Item
          name="name"
          label="Display Name"
          rules={[{ required: true, message: "Please enter image name" }]}
        >
          <Input 
            prefix={<FileImageOutlined className="text-gray-400" />} 
            placeholder="e.g. Ubuntu 24.04 - ML" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="value"
          label="Docker Image Tag"
          rules={[{ required: true, message: "Please enter the docker hub image name" }]}
          help="The exact image name/tag in Docker Hub"
        >
          <Input 
            prefix={<CloudServerOutlined className="text-gray-400" />} 
            placeholder="e.g. toolmen/server:v1.0" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea 
            placeholder="Brief description of the environment and tools included..." 
            rows={4}
            className="resize-none"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateNewImage;