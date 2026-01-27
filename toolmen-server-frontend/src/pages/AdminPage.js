import React, { useState } from "react";
import { Tabs } from "antd";
import { 
  AppstoreOutlined, 
  TeamOutlined, 
  CloudServerOutlined, 
  ExperimentOutlined
} from "@ant-design/icons";

// 引入你的 Admin 組件
import AdminTabWorkspace from "../components/AdminTabWorkspace";
import AdminTabUser from "../components/AdminTabUser";
import AdminTabImage from "../components/AdminTabImage";
import AdminTabLab from "../components/AdminTabLab";

const AdminPage = () => {
  const [adminActiveTab, setAdminActiveTab] = useState("admin-ws");

  // 渲染 Tab 標題的輔助函式
  const renderTabTitle = (title, Icon) => (
    <span className="flex items-center gap-2 text-sm font-medium">
      <Icon style={{ fontSize: '18px' }} />
      {title}
    </span>
  );

  // --- 重點修改：定義 items 陣列 ---
  const items = [
    {
      key: "admin-ws",
      label: renderTabTitle("Workspaces", AppstoreOutlined),
      children: (
        <div className="px-4">
          <AdminTabWorkspace isActive={adminActiveTab === "admin-ws"} />
        </div>
      ),
    },
    {
      key: "admin-user",
      label: renderTabTitle("Users", TeamOutlined),
      children: (
        <div className="px-4">
          <AdminTabUser isActive={adminActiveTab === "admin-user"} />
        </div>
      ),
    },
    {
      key: "admin-image",
      label: renderTabTitle("Images", CloudServerOutlined),
      children: (
        <div className="px-4">
          <AdminTabImage isActive={adminActiveTab === "admin-image"} />
        </div>
      ),
    },
    {
      key: "admin-lab",
      label: renderTabTitle("Labs", ExperimentOutlined),
      children: (
        <div className="px-4">
          <AdminTabLab isActive={adminActiveTab === "admin-lab"} />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden min-h-[70vh] border border-gray-200">
      
      {/* 頂部裝飾條 */}
      <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

      <div className="p-6">
        <div className="mb-6 border-b pb-4">
           <h2 className="text-2xl font-bold text-gray-800">Admin Control</h2>
        </div>

        <Tabs
          defaultActiveKey="admin-ws"
          activeKey={adminActiveTab}
          onChange={setAdminActiveTab}
          tabPosition="left"
          size="large"
          className="admin-tabs"
          // --- 重點修改：直接傳入 items 陣列 ---
          items={items}
        />
      </div>
    </div>
  );
};

export default AdminPage;