import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Drawer,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Switch,
  notification,
  message,
  Divider
} from "antd";
import { UserOutlined, SafetyCertificateOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import AuthContext from "../context/auth-context";

const EditUser = ({ user, visible, onClose, sendRequest }) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 初始化表單
  useEffect(() => {
    if (user && visible) {
      form.setFieldsValue({
        email: user.email,
        quota: user.quota,
        isAdmin: user.is_admin,
        actived: user.actived,
      });
    } else {
      form.resetFields();
    }
  }, [user, visible, form]);

  const onErrorHandler = (err) => {
    notification.error({
      message: "Update Failed",
      description: err.message || "An error occurred while updating the user.",
      placement: "topRight",
    });
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/user/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({
            event: "updateProfile",
            email: values.email,
            quota: values.quota,
            is_admin: values.isAdmin,
            actived: values.actived,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong");
      }

      message.success("User updated successfully!");
      sendRequest();
      onClose();
    } catch (err) {
      onErrorHandler(err);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title={`Edit User: ${user?.username || ""}`}
      placement="right"
      width={500}
      onClose={onClose}
      open={visible}
      maskClosable={!submitting}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={() => form.submit()}
            type="primary"
            loading={submitting}
            className="bg-blue-500"
          >
            Save Changes
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
        {/* 1. 基本資訊區 (唯讀) */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-gray-500 text-xs font-bold uppercase mb-3 tracking-wider">Basic Info (Read Only)</h3>
          <Row gutter={16}>
            <Col span={12}>
              <div className="text-xs text-gray-400 mb-1">Username</div>
              <div className="text-sm font-medium text-gray-700">{user?.username}</div>
            </Col>
            <Col span={12}>
              <div className="text-xs text-gray-400 mb-1">Lab Name</div>
              <div className="text-sm font-medium text-gray-700">{user?.lab_name}</div>
            </Col>
          </Row>
        </div>

        {/* 2. 編輯區 */}
        <h3 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-wider">Account Settings</h3>
        
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { required: true, message: "Please enter e-mail" },
            { type: "email", message: "Please enter a valid e-mail" },
          ]}
        >
          <Input placeholder="Enter user e-mail" size="large" />
        </Form.Item>

        <Form.Item
          name="quota"
          label="Workspace Quota"
          rules={[{ required: true, message: "Please enter quota" }]}
        >
          <InputNumber 
            style={{ width: "100%" }} 
            min={0} 
            max={100}
            size="large"
            placeholder="e.g., 5" 
          />
        </Form.Item>

        <Divider dashed />

        {/* 3. 權限與狀態設定 */}
        <Row gutter={24}>
          <Col span={12}>
            {/* Admin Switch: 使用 shouldUpdate 確保顏色正確渲染 */}
            <Form.Item
              label="Role Permission"
              shouldUpdate={(prev, curr) => prev.isAdmin !== curr.isAdmin}
              help="Admin has full system access"
            >
              {({ getFieldValue }) => (
                <Form.Item name="isAdmin" valuePropName="checked" noStyle>
                  <Switch 
                    checkedChildren={<><SafetyCertificateOutlined /> Admin</>}
                    unCheckedChildren={<><UserOutlined /> User</>}
                    // 強制設定背景色，防止變成全白
                    style={{ 
                      background: getFieldValue('isAdmin') ? '#1890ff' : '#bfbfbf' // 藍色 : 灰色
                    }}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Active Switch: 紅/綠 配色 */}
            <Form.Item
              label="Account Status"
              shouldUpdate={(prev, curr) => prev.actived !== curr.actived}
              help="Inactive users cannot login"
            >
              {({ getFieldValue }) => (
                <Form.Item name="actived" valuePropName="checked" noStyle>
                  <Switch 
                    checkedChildren={<><CheckCircleOutlined /> Active</>}
                    unCheckedChildren={<><StopOutlined /> Inactive</>}
                    // 關鍵修改：強制依據狀態給予 綠色 或 紅色
                    style={{ 
                      background: getFieldValue('actived') ? '#52c41a' : '#ff4d4f' // 綠色 : 紅色
                    }}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default EditUser;