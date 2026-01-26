import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthContext from "./context/auth-context";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Errorpage from "./pages/Errorpage";
// 引入我們剛做好的 Loadingpage
import Loadingpage from "./pages/Loadingpage"; 
// 如果之後要用等待頁面，記得確認檔名拼字 (Waiting vs Wating)
// import LoginWaitingpage from "./pages/LoginWaitingpage"; 

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

const App = () => {
  const initToken = getCookie("access_token_cookie");
  const initUid = getCookie("uid");
  
  const [token, setToken] = useState(initToken);
  const [userID, setUserID] = useState(initUid);
  const [userInfo, setUserInfo] = useState(null);

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
    routes = (
      <>
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </>
    );
  } else if (token && !userInfo) { 
    // [情境 2] 有 Token 但還沒拿到 UserInfo -> 顯示 Loading
    // 這裡很重要，不然重新整理時會有一瞬間白畫面或跳回 Login
    routes = (
      <>
        <Route path="*" element={<Loadingpage />} />
      </>
    );
  } else { 
    // [情境 3] 未登入 -> 顯示登入頁
    routes = (
      <>
        <Route path="/login" element={<Loginpage />} />
        {/* <Route path="/login/google" element={<LoginWaitingpage />} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </>
    );
  }

  return (
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
  );
};

export default App;