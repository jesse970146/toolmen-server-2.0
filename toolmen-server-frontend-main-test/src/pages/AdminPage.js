import React, { useState } from "react";
import { Tabs } from "antd";
import { 
  AppstoreOutlined, 
  TeamOutlined, 
  CloudServerOutlined, 
  ExperimentOutlined,
  SettingFilled 
} from "@ant-design/icons";

// 引入你的 Admin 組件
import AdminTab_workspace from "../components/AdminTab_workspace";
import AdminTab_user from "../components/AdminTab_user";
import AdminTab_image from "../components/AdminTab_image";
import AdminTab_lab from "../components/AdminTab_lab";

// const { TabPane } = Tabs;

// ... (Import 部分相同)

const AdminPage = () => {
  const [adminActiveTab, setAdminActiveTab] = useState("admin-ws");

  const renderTabTitle = (title, Icon) => (
    <span className="flex items-center gap-2 text-sm font-medium">
      <Icon style={{ fontSize: '18px' }} />
      {title}
    </span>
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden min-h-[70vh] border border-gray-200">
      
      {/* 頂部裝飾條 (可選) */}
      <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

      <div className="p-6">
        <div className="mb-6 border-b pb-4">
           <h2 className="text-2xl font-bold text-gray-800">Admin Control</h2>
        </div>

        <Tabs
          defaultActiveKey="admin-ws"
          activeKey={adminActiveTab}
          onChange={setAdminActiveTab}
          tabPosition="left" // 關鍵改變：變成側邊欄
          size="large"
          className="admin-tabs" // 如果需要寫 CSS 可以用這個
        >
          {/* 內容跟上面一樣，只是排版會自動變 */}
          <items tab={renderTabTitle("Workspaces", AppstoreOutlined)} key="admin-ws">
            <div className="px-4">
               <AdminTab_workspace isActive={adminActiveTab === "admin-ws"} />
            </div>
          </items>
          
          <items tab={renderTabTitle("Users", TeamOutlined)} key="admin-user">
             <div className="px-4">
                <AdminTab_user isActive={adminActiveTab === "admin-user"} />
             </div>
          </items>
          
          <items tab={renderTabTitle("Images", CloudServerOutlined)} key="admin-image">
             <div className="px-4">
                <AdminTab_image isActive={adminActiveTab === "admin-image"} />
             </div>
          </items>
          
          <items tab={renderTabTitle("Labs", ExperimentOutlined)} key="admin-lab">
             <div className="px-4">
                <AdminTab_lab isActive={adminActiveTab === "admin-lab"} />
             </div>
          </items>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;