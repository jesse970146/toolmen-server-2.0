import React, { useState, useContext } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  notification,
  message,
} from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import AuthContext from "../context/auth-context";

const CreateNewLab = ({ visible, onClose, sendRequest }) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 錯誤通知
  const onErrorHandler = (err) => {
    notification.error({
      message: "Creation Failed",
      description: err.message || "An error occurred while creating the lab.",
      placement: "topRight",
    });
  };

  // 提交表單
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/labs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({
          name: values.name,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong");
      }

      message.success("Lab created successfully!");
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
      title="Create New Lab"
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
            Create Lab
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
        <h3 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-wider">Lab Details</h3>

        <Form.Item
          name="name"
          label="Lab Name"
          rules={[{ required: true, message: "Please enter lab name" }]}
        >
          <Input 
            prefix={<ExperimentOutlined className="text-gray-400" />} 
            placeholder="e.g. ToolmenLAB, LAB203" 
            size="large"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateNewLab;