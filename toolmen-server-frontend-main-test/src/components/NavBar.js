import React, { useContext, useState } from "react";
import { Dropdown, Avatar, Badge } from "antd"; // 移除沒用到的 Button, Menu
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  BellOutlined
} from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom"; 

import AuthContext from "../context/auth-context";

const NavBar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    // 你的登出邏輯
    auth.logout();
    navigate("/login");
  };

  // --- 修改重點 1: 下拉選單加入 Settings ---
  const userMenuArgs = [
    // {
    //   key: 'profile',
    //   label: <span className="font-medium">My Profile</span>,
    //   icon: <UserOutlined />,
    //   // onClick: () => navigate("/profile"), // 如果你有做 Profile 頁面
    // },
    {
      key: 'settings', // 加入 Settings
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"), // 點擊跳轉到 /settings
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // --- 修改重點 2: 上方導航移除 Settings ---
  const navItems = [
    { label: "Workspace", key: "/", icon: <AppstoreOutlined /> },
    // { label: "Settings", key: "/settings", icon: <SettingOutlined /> }, <--- 這裡刪除
    { label: "Help", key: "/help", icon: <QuestionCircleOutlined /> },
  ];

  if (auth.userInfo?.is_admin) {
    navItems.push({ label: "Admin", key: "/admin", icon: <SafetyCertificateOutlined /> });
  }

  return (
    <section className="h-16 z-50 sticky top-0 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 xl:px-44 shadow-sm">
      
      {/* 左側: Logo 與 導航 */}
      <div className="flex items-center gap-8">
        <div to="/" className="flex items-center gap-2 no-underline text-gray-800">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
             T
           </div>
           <span className="font-bold text-xl hidden md:block">Toolmen Lab</span>
        </div>

        {/* 導航按鈕區 */}
        {auth.isLoggedIn && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.key} to={item.key}>
                <div 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                    ${location.pathname === item.key 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
                >
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 右側: 使用者資訊 */}
      <div className="flex items-center gap-4">
        {auth.isLoggedIn && (
          <>
             {/* 鈴鐺範例 */}
            {/* <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors text-gray-600">
              <Badge count={0} size="small" dot> 
                <BellOutlined style={{ fontSize: 20 }} />
              </Badge>
            </div> */}

            <span className="hidden lg:block text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full border border-gray-200">
              {auth.userInfo?.lab_name || "No Lab"}
            </span>

            <div className="h-6 w-[1px] bg-gray-300 mx-1 hidden lg:block"></div>

            <Dropdown menu={{ items: userMenuArgs }} trigger={['click']} placement="bottomRight">
              <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                <Avatar 
                  style={{ backgroundColor: '#2563EB' }} 
                  src={auth.userInfo?.avatarUrl} 
                  icon={<UserOutlined />}
                >
                  {auth.userInfo?.username?.[0]?.toUpperCase()}
                </Avatar>
                
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-sm font-semibold text-gray-700">
                    {auth.userInfo?.username}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {auth.userInfo?.is_admin ? "Administrator" : "User"}
                  </span>
                </div>
              </div>
            </Dropdown>
          </>
        )}
      </div>
    </section>
  );
};

export default NavBar;