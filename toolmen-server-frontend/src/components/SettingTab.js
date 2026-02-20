import React, { useState, useContext } from "react";
import { App, Button, Form, Input} from "antd";
import AuthContext from "../context/auth-context";

const SettingTab = () => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  // 新增 loading 狀態，避免重複提交並提供視覺回饋
  const [loading, setLoading] = useState(false);

  // 錯誤通知處理
  const onErrorHandler = (err) => {
    notification.error({
      message: "Change Password Failed",
      duration: 5,
      description: (
        <>
          An error has occurred. Please try again later.<br />
          Error message: {err?.message || "Unknown error"}
        </>
      ),
      style: { width: 500 },
    });
  };

  // 成功通知處理
  const onSuccessHandler = () => {
    notification.success({
      message: "Password Changed Successfully",
      duration: 3,
      description: (
        <>
          The password has been updated. <br />
          You will be logged out in 3 seconds. Please login again.
        </>
      ),
      style: { width: 500 },
    });
  };

  const changePassword = async (values) => {
    setLoading(true);
    try {
      const userId = auth.userInfo?.id;
      if (!userId) throw new Error("User ID not found.");

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth.token,
          },
          body: JSON.stringify({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            event: "resetPassword",
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Request failed");
      }

      // --- 成功邏輯放在這裡 ---
      onSuccessHandler();
      form.resetFields();
      
      // 縮短登出時間，5秒體感太久
      setTimeout(() => {
        auth.logout();
      }, 3000);

    } catch (err) {
      // --- 失敗邏輯放在這裡 ---
      console.error(err);
      onErrorHandler(err);
    } finally {
      // 無論成功或失敗，都解除 loading 狀態
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    changePassword(values);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 0" }}>
      <Form 
        form={form} 
        onFinish={onFinish} 
        layout="vertical"
        autoComplete="off" // 避免瀏覽器自動填充干擾
      >
        <Form.Item
          name="oldPassword"
          label="Old Password"
          rules={[{ required: true, message: "Please enter your old password" }]}
        >
          <Input.Password placeholder="Enter old password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: "Please enter a new password" },
            // { min: 6, message: "Password must be at least 6 characters" } // 建議加入長度限制
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

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
                return Promise.reject(new Error("The two passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} // 綁定 loading 狀態
            block // 讓按鈕填滿寬度 (可選)
            className="bg-blue-500"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SettingTab;