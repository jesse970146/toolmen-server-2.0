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
import LoginWatingpage from "./pages/LoginWatingpage";
import Loadingpage from "./pages/Loadingpage";
import Signuppage from "./pages/Signuppage";
import Errorpage from "./pages/Errorpage";

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
  const initToken = getCookie("access_token_cookie");;
  const initUid = getCookie("uid");
  const [token, setToken] = useState(initToken);
  const [userID, setUserID] = useState(initUid);

  const [userInfo, setUserInfo] = useState(null);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserID(uid);
    // localStorage.setItem("uid", uid);
    // localStorage.setItem("token", token);
    // 新增：把 token 寫進 cookie
    // document.cookie = `access_token_cookie=${token}; path=/; secure; SameSite=Lax`;
    document.cookie = `access_token_cookie=${token}; Path=/; SameSite=Lax`;
    document.cookie = `uid=${uid}; Path=/; SameSite=Lax`;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserID(null);
    setUserInfo(null);
    // localStorage.removeItem("uid");
    // localStorage.removeItem("token");
    // 移除
    document.cookie = "access_token_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL+ "/user/" + String(userID),
        // "http://localhost:8080/user/" + String(userID),
        { headers: { Authorization: "Bearer " + token }}
        // ,credentials: "include" }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setUserInfo(responseData);
    } catch (err) {
      console.log(err);
      logout();
    }
  };

  useEffect(() => {
    if (!!token & !!userID) {
      fetchUserData();
    }
  }, [token, userID]);

  let routes;

  if (!!token && !!userInfo) { //已登入，有token 與userinfo
    routes = (
      <>
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </>
    );
  } else if (!!token && !userInfo) { //表示有登入 token，但還沒拿到 userInfo
    routes = (
      <>
        <Route path="/" element={<Loadingpage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </>
    );
  } else { //兩者都沒有
    routes = (  
      <>
        <Route path="/login" element={<Loginpage />} />
        {/* <Route path="/login/google" element={<LoginWatingpage />} />
        <Route path="/login/github" element={<LoginWatingpage />} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </>
    );
  }

  return (
    <>
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
            <Route path="/signup" element={<Signuppage />} />
            {routes}
          </Routes>
        </Router>
      </AuthContext.Provider>
    </>
  );
};

export default App;
