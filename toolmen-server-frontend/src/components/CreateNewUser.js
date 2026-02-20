import React, { useState, useContext } from "react";
import {
  App,
  Button,
  Drawer,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Switch,
  Divider,
} from "antd";
import { 
  UserOutlined, 
  SafetyCertificateOutlined, 
  StopOutlined, 
  CheckCircleOutlined,
  MailOutlined 
} from "@ant-design/icons";
import { LuMicroscope } from "react-icons/lu"; // 保留原本的 Lab Icon
import AuthContext from "../context/auth-context";

const { Option } = Select;

const CreateNewUser = ({ visible, onClose, sendRequest, LabList }) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { notification, message} = App.useApp();
  // 錯誤通知
  const onErrorHandler = (err) => {
    notification.error({
      message: "Creation Failed",
      description: err.message || "An error occurred while creating the user.",
      placement: "topRight",
    });
  };

  // 提交表單
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({
          username: values.name,
          email: values.email,
          lab_name: values.lab,
          quota: values.quota,
          is_admin: values.isAdmin,
          actived: values.actived,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong");
      }

      message.success("User created successfully!");
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
      title="Create New User"
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
            Create User
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark="optional"
        // 設定預設值：預設 Quota 為 5，預設為一般使用者且啟用中
        initialValues={{
          quota: 5,
          isAdmin: false,
          actived: true, 
        }}
      >
        <h3 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-wider">User Details</h3>

        <Form.Item
          name="name"
          label="Username"
          rules={[{ required: true, message: "Please enter user's name" }]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="e.g. johndoe" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { required: true, message: "Please enter e-mail" },
            { type: "email", message: "Please enter a valid e-mail" },
          ]}
        >
          <Input 
            prefix={<MailOutlined className="text-gray-400" />} 
            placeholder="user@example.com" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="lab"
          label="Laboratory"
          rules={[{ required: true, message: "Please select a lab" }]}
        >
          <Select
            placeholder="Select a lab"
            size="large"
            optionLabelProp="value" // 選中後只顯示 value 文字，不顯示整個 Option 的自訂樣式
          >
            {LabList.map((lab) => (
              <Option key={lab.name} value={lab.name} className="py-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-md text-blue-500 dark:bg-gray-700">
                    <LuMicroscope size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 dark:text-gray-200">{lab.name}</span>
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="quota"
          label="Workspace Quota"
          rules={[{ required: true, message: "Please enter user's quota" }]}
        >
          <InputNumber 
            style={{ width: "100%" }} 
            min={0} 
            max={100} 
            size="large"
            placeholder="e.g. 5" 
          />
        </Form.Item>

        <Divider dashed />

        <h3 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-wider">Permissions & Status</h3>

        <Row gutter={24}>
          <Col span={12}>
            {/* Admin Switch */}
            <Form.Item
              label="Role Permission"
              shouldUpdate={(prev, curr) => prev.isAdmin !== curr.isAdmin}
              help="Admin has full access"
            >
              {({ getFieldValue }) => (
                <Form.Item name="isAdmin" valuePropName="checked" noStyle>
                  <Switch 
                    checkedChildren={<><SafetyCertificateOutlined /> Admin</>}
                    unCheckedChildren={<><UserOutlined /> User</>}
                    style={{ 
                      background: getFieldValue('isAdmin') ? '#1890ff' : '#bfbfbf'
                    }}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Active Switch (紅綠燈邏輯) */}
            <Form.Item
              label="Account Status"
              shouldUpdate={(prev, curr) => prev.actived !== curr.actived}
              help="Initial status"
            >
              {({ getFieldValue }) => (
                <Form.Item name="actived" valuePropName="checked" noStyle>
                  <Switch 
                    checkedChildren={<><CheckCircleOutlined /> Active</>}
                    unCheckedChildren={<><StopOutlined /> Inactive</>}
                    style={{ 
                      background: getFieldValue('actived') ? '#52c41a' : '#ff4d4f'
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

export default CreateNewUser;