// import React, { useContext } from "react";
// import { Tabs } from "antd";

// import NavBar from "../components/NavBar";
// import WorkspaceTab from "../components/WorkspaceTab";
// import SettingTab from "../components/SettingTab";
// import APPsTab from "../components/APPsTab";
// import AdminTab from "../components/AdminTab";
// import AdminTab_user from "../components/AdminTab_user";
// import  AuthContext  from "../context/auth-context";


// const { TabPane } = Tabs;

// const Homepage = () => {
//   const auth = useContext(AuthContext);
//   console.log("👀 userInfo:", auth.userInfo);
//   return (
//     <section className="flex flex-col min-h-screen select-none">
//       <NavBar />
//       <section
//         className="Content"
//         class="flex-auto z-0 bg-gray-100 pt-12 px-12 xl:px-44"
//       >
//         <div className="w-full flex items-center gap-8">
//           <div className="w-20 h-20 overflow-hidden">
//             <img
//               className="object-cover h-full w-full"
//               src="https://images.unsplash.com/photo-1612380783707-d759e46ee5cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1044&q=80"
//             />
//           </div>
//           <div className="flex flex-col items-start gap-4">
//             <span className="text-3xl font-semibold text-black">
//               {auth.userInfo.username}
//             </span>
//             <span className="text-sm font-semibold bg-gray-300 px-4 rounded-full">
//               {auth.userInfo.lab_name}
              
//             </span>
//           </div>
//         </div>
//         <div className="mt-8">
//           <Tabs className="" defaultActiveKey="1" tabBarStyle={{}}>
//             <TabPane tab="ML Workspace" key="1">
//               <WorkspaceTab />
//             </TabPane>
//             {/* <TabPane tab="APPs" key="2">
//               <APPsTab />
//             </TabPane> */}
//             {/* <TabPane tab="Tutorial" key="3">
//               Content of Tab Pane 3
//             </TabPane> */}
//             <TabPane tab="Setting" key="4">
//               <SettingTab />
//             </TabPane>
//             {auth.userInfo.is_admin && (
//               <TabPane tab="Workspace list" key="5">
//                 <AdminTab />
//               </TabPane>
//             )}
//             {auth.userInfo.is_admin && (
//               <TabPane tab="User list" key="6">
//                 <AdminTab_user />
//               </TabPane>
//             )}
//           </Tabs>
//         </div>
//       </section>
//     </section>
//   );
// };

// export default Homepage;
import React, { useState, useEffect, useContext } from "react";
import { Tabs } from "antd";

import NavBar from "../components/NavBar";
import WorkspaceTab from "../components/WorkspaceTab";
import SettingTab from "../components/SettingTab";
import APPsTab from "../components/APPsTab";
import AdminTab_workspace from "../components/AdminTab_workspace";
import AdminTab_user from "../components/AdminTab_user";
import AdminTab_image from "../components/AdminTab_image";
import AdminTab_lab from "../components/AdminTab_lab";
import AuthContext from "../context/auth-context";
import Footer from "../components/Footer";
import HelpTab from "../components/HelpTab";
const { TabPane } = Tabs;

const Homepage = () => {
  const auth = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("1"); // <-- 追蹤目前的 tab
  const [adminActiveTab, setAdminActiveTab] = useState("admin-ws");

  useEffect(() => {
    if (activeTab !== "100") {
      setAdminActiveTab("None");
    }
  }, [activeTab]);

  return (
    <section className="flex flex-col min-h-screen select-none">
      <NavBar />
      <section className="flex-auto z-0 bg-gray-100 pt-12 px-12 xl:px-44">
        <div className="w-full flex items-center gap-8">
          <div className="w-20 h-20 overflow-hidden">
            <img
              className="object-cover h-full w-full"
              src="https://images.unsplash.com/photo-1612380783707-d759e46ee5cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1044&q=80"
            />
          </div>
          <div className="flex flex-col items-start gap-4">
            <span className="text-3xl font-semibold text-black">
              {auth.userInfo.username}
            </span>
            <span className="text-sm font-semibold bg-gray-300 px-4 rounded-full">
              {auth.userInfo.lab_name}
            </span>
          </div>
        </div>
        <div className="mt-8">
          <Tabs
            defaultActiveKey="1"
            activeKey={activeTab}
            onChange={setActiveTab}
          >
            <TabPane tab="ML Workspace" key="1">
              <WorkspaceTab isActive={activeTab === "1"} />
            </TabPane>
            <TabPane tab="Settings" key="2">
              <SettingTab />
            </TabPane>
            <TabPane tab="Help" key="3">
              <HelpTab />
            </TabPane>

            {auth?.userInfo?.is_admin && (
              <TabPane tab="Admin Tab" key="100" >
                <Tabs
                  defaultActiveKey="admin-ws"
                  activeKey={adminActiveTab}
                  onChange={setAdminActiveTab}
                >
                  <TabPane tab="Workspace List" key="admin-ws">
                    <AdminTab_workspace isActive={adminActiveTab === "admin-ws"} />
                  </TabPane>
                  <TabPane tab="User List" key="admin-user">
                    <AdminTab_user isActive={adminActiveTab === "admin-user"} />
                  </TabPane>
                  <TabPane tab="Image List" key="admin-image">
                    <AdminTab_image isActive={adminActiveTab === "admin-image"} />
                  </TabPane>
                  <TabPane tab="Lab List" key="admin-lab">
                    <AdminTab_lab isActive={adminActiveTab === "admin-lab"} />
                  </TabPane>
                </Tabs>
              </TabPane>
            )}
          </Tabs>
          
        </div>
        
      </section>
      <Footer />
    </section>
  );
};

export default Homepage;
