import React, { useState, useContext } from "react";
import {
  App,
  Button,
  Drawer,
  Form,
  Space,
  Input,
  Select,
} from "antd";
import { 
  DesktopOutlined, 
  InfoCircleOutlined
} from "@ant-design/icons";
import { FiServer } from "react-icons/fi"; 
import { LiaDocker } from "react-icons/lia"; 
import AuthContext from "../context/auth-context";

const { Option } = Select;

const CreateNewWorkspace = (props) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const { notification } = App.useApp();
  // Error Handler
  const onErrorHandler = (err) => {
    notification.error({
      message: "Workspace Creation Failed!",
      description: "An error has occurred. Please try again later. If you continue to encounter this problem, contact your admin. Error message: " + err.message,
      style: {
        width: 500,
      },
    });
  };

  // Form Submission
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/workspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({
          name: values.name,
          image: values.image,
          server: values.server,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong");
      }

      // Using the original logic's success flow but with updated UI feedback if desired, 
      // keeping strict to "don't touch logic" means we rely on props.sendRequest()
      props.sendRequest(); 
      handleClose(); 
    } catch (err) {
      onErrorHandler(err);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Unified Close Handler
  const handleClose = () => {
    form.resetFields();
    props.onClose();
  };

  const prefixLabel = auth.userInfo?.username ? `${auth.userInfo.username}-` : null;

  return (
    <Drawer
      className="select-none"
      title="Create New Workspace"
      placement="right"
      width={560}
      onClose={handleClose}
      open={props.visible}
      maskClosable={!submitting}
      // Footer Actions moved to footer prop for better UI
      footer={
        <div className="flex justify-end gap-2">
          <Button 
            onClick={handleClose} 
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={() => form.submit()}
            type="primary"
            loading={submitting}
            className="bg-blue-500"
          >
            {submitting ? "Creating" : "Create"}
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
        <h3 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-wider dark:text-gray-400">Workspace Details</h3>

        <Form.Item
          name="name"
          label="Name"
        >
          <Space.Compact style={{ width: '100%' }}>
            {/* 2. 把 addonBefore 變成一個「偽裝成標籤」的 Button */}
            {prefixLabel && (
              <Button 
                type="default" 
                size="large" // 記得跟 Input 一樣大
                className="!cursor-default !bg-gray-50 !text-gray-500 hover:!border-gray-300 hover:!text-gray-500 dark:!bg-slate-700/50 dark:!text-gray-400 dark:hover:!border-gray-600" // Tailwind 輔助樣式：禁止游標、灰色背景
                style={{ pointerEvents: 'none' }} // 讓它點擊無效，感覺更像 Label
              >
                {prefixLabel}
              </Button>
            )}

            {/* 3. Input 本體 */}
            <Input
              prefix={<DesktopOutlined className="text-gray-400 dark:text-gray-500" />}
              placeholder="Please enter a workspace name"
              size="large"
              // 這裡不需要 addonBefore 了
            />
          </Space.Compact>
        </Form.Item>

        <Form.Item
          name="server"
          label="Server"
          rules={[{ required: true, message: "Please select an server" }]}
        >
          <Select
            placeholder="Please select an server"
            size="large"
            optionLabelProp="value"
          >
            {props.NodeList.map((nodeName) => (
              <Option key={nodeName} value={nodeName} className="py-2">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-md text-gray-500 dark:bg-slate-700/50 dark:text-gray-400">
                    <FiServer size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{nodeName}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Compute Node</span>
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          rules={[{ required: true, message: "Please select an image" }]}
        >
          <Select
            placeholder="Please select an image"
            size="large"
            optionLabelProp="label" 
            popupMatchSelectWidth={false}
            listHeight={400}
          >
            {props.ImageList.map((image) => {
              // Logic to handle optional name
              const displayName = image.name || image.value;
              const submitValue = image.name || image.value;
              // Use value as key if available to ensure uniqueness
              const uniqueKey = image.value || image.name || Math.random();

              return (
                <Option 
                  key={uniqueKey} 
                  value={submitValue} 
                  label={displayName} 
                  className="py-2"
                >
                  <div className="flex gap-3 dark:text-gray-400">
                    <div className="mt-1">
                      <LiaDocker className="h-6 w-6 text-blue-500 dark" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-gray-800 dark:text-gray-300">
                        {displayName}
                      </span>                                     
                      {image.description && (
                        <span className="text-xs text-gray-500 whitespace-normal break-words leading-tight mt-1 dark:text-gray-500">
                          {image.description}
                        </span>
                      )}
                    </div>
                  </div>
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <div className="bg-blue-50 p-3 rounded-md flex gap-2 items-start mt-6 dark:bg-slate-700/50">
          <InfoCircleOutlined className="text-blue-500 mt-0.5 dark:text-blue-400" />
          <p className="text-xs text-blue-600 m-0 leading-relaxed dark:text-blue-400 ">
            Note: Creating a workspace may take a few moments depending on the image size and server load.
          </p>
        </div>
      </Form>
    </Drawer>
  );
};

export default CreateNewWorkspace;