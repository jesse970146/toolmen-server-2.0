import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { App as AntdApp, ConfigProvider, theme} from 'antd';
import AuthContext from "./context/auth-context";
// import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Errorpage from "./pages/Errorpage";
// 引入我們剛做好的 Loadingpage
import Loadingpage from "./pages/Loadingpage"; 

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import WorkspaceTab from "./components/WorkspaceTab";
import SettingTab from "./components/SettingTab";
import HelpTab from "./components/HelpTab";
import AdminPage from "./pages/AdminPage"; // 剛剛建立的

import { Outlet } from "react-router-dom";
// Cookie 讀取工具 (放在 Component 外層即可)
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}
const MainLayout = ({ isDark, setIsDark }) => {
  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'dark' : ''}`}>
      <NavBar isDark={isDark} setIsDark={setIsDark} />
      <div className="flex-auto bg-white dark:bg-slate-900 pt-8 px-6 xl:px-44 pb-12 transition-colors duration-300">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  const initToken = getCookie("access_token_cookie");
  const initUid = getCookie("uid");
  
  const [token, setToken] = useState(initToken);
  const [userID, setUserID] = useState(initUid);
  const [userInfo, setUserInfo] = useState(null);
  // dark mode 狀態 (預設為 false，表示淺色模式)
  const [isDark, setIsDark] = useState(() => {
    const savedMode = localStorage.getItem("isDark");
    return savedMode === "true"; // 轉為布林值
  });

  // 2. 當 isDark 改變時，同步到 localStorage 和 body class
  useEffect(() => {
    localStorage.setItem("isDark", isDark); // 儲存設定
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserID(uid);
    // 寫入 Cookie
    document.cookie = `access_token_cookie=${token}; Path=/; SameSite=Lax`;
    document.cookie = `uid=${uid}; Path=/; SameSite=Lax`;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserID(null);
    setUserInfo(null);
    // 清除 Cookie (設定過期時間)
    document.cookie = "access_token_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  // 抓取使用者資料
  const fetchUserData = useCallback(async () => {
    // 如果沒有 token 或 userID 就不要執行，避免錯誤
    if (!token || !userID) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/user/${String(userID)}`,
        { 
          headers: { Authorization: "Bearer " + token } 
        }
      );
      
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch user data");
      }
      
      setUserInfo(responseData);
    } catch (err) {
      console.error("Fetch User Data Error:", err);
      // 如果 Token 失效或錯誤，執行登出
      logout();
    }
  }, [token, userID, logout]);

  // 當 Token 或 UserID 改變時，嘗試抓取使用者資料
  useEffect(() => {
    if (token && userID) {
      fetchUserData();
    }
  }, [token, userID, fetchUserData]);

  // --- 路由邏輯 ---
  let routes;

  if (token && userInfo) { 
    // [情境 1] 已登入且資料載入完成 -> 顯示主頁
    // routes = (
    //   <>
    //     <Route path="/" element={<Homepage />} />
    //     <Route path="*" element={<Navigate to="/" replace />} />
    //   </>
    // );
    routes = (
      <>
        {/* 把 MainLayout 當作父路由 */}
        <Route path="/" element={<MainLayout isDark={isDark} setIsDark={setIsDark} />}>
          {/* 首頁預設顯示 Workspace */}
          <Route index element={<WorkspaceTab isActive={true} />} />
          
          <Route path="settings" element={<SettingTab/>} />
          <Route path="help" element={<HelpTab isDark={isDark}/>} />
          
          {/* Admin 路由保護 */}
          {userInfo.is_admin && (
             <Route path="admin" element={<AdminPage />} />
          )}
          
          {/* 萬一亂打網址，導回首頁 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </>
    );
  } else if (token && !userInfo) { 
    // [情境 2] 有 Token 但還沒拿到 UserInfo -> 顯示 Loading
    // 這裡很重要，不然重新整理時會有一瞬間白畫面或跳回 Login
    routes = (
      <>
        <Route path="*" element={<Loadingpage isDark={isDark} />} />
      </>
    );
  } else { 
    // [情境 3] 未登入 -> 顯示登入頁
    routes = (
      <>
        <Route path="/login" element={<Loginpage isDark={isDark} setIsDark={setIsDark}/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntdApp>
        <AuthContext.Provider
          value={{
            isLoggedIn: !!token,
            token: token,
            userID: userID,
            userInfo: userInfo,
            login: login,
            logout: logout,
          }}
        >
          <Router>
            <Routes>
              <Route path="/error" element={<Errorpage />} />
              {routes}
            </Routes>
          </Router>
        </AuthContext.Provider>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;