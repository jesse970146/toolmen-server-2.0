import React, { useContext, useMemo } from "react";
import { Dropdown, Avatar } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import AuthContext from "../context/auth-context";
import { createAvatar } from '@dicebear/core';
import { loreleiNeutral } from '@dicebear/collection';

const NavBar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const avatarSvg = useMemo(() => {
    const avatar = createAvatar(loreleiNeutral, {
      seed: auth.userInfo?.username || 'default',
      size: 128,
      backgroundColor: ["b6e3f4","c0aede","d1d4f9"],
      backgroundType: ["gradientLinear","solid"]
    });
    return avatar.toString(); // 注意：新版 DiceBear 使用 toString()
  }, [auth.userInfo?.username]);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  const userMenuArgs = [
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"),
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

  const navItems = [
    // { label: "Workspace", key: "/", icon: <AppstoreOutlined /> },
    { label: "Help", key: "/help", icon: <QuestionCircleOutlined /> },
  ];

  if (auth.userInfo?.is_admin) {
    navItems.push({ label: "Admin", key: "/admin", icon: <SafetyCertificateOutlined /> });
  }

  return (
    // 1. 移除 border-b border-gray-200，加入 relative 以便定位漸層線
    <section className="h-16 z-50 sticky top-0 flex items-center justify-between bg-white/90 backdrop-blur-md px-6 xl:px-44 shadow-sm relative">
      
      {/* 2. 新增與 Footer 一樣的漸層線條，但位置設為 bottom-0 (底部) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* 左側: Logo 與 導航 */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 no-underline text-gray-800">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
             T
           </div>
           <span className="font-bold text-xl hidden md:block">Toolmen Lab</span>
        </Link>

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
            <span className="hidden lg:block text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full border border-gray-200">
              {auth.userInfo?.lab_name || "No Lab"}
            </span>

            <div className="h-6 w-[1px] bg-gray-300 mx-1 hidden lg:block"></div>

            <Dropdown menu={{ items: userMenuArgs }} trigger={['click']} placement="bottomRight">
              <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                <Avatar 
                  size={40} // 稍微調小一點點比較優雅
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarSvg)}`} // 修正 src 格式
                  style={{ backgroundColor: 'transparent' }} 
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