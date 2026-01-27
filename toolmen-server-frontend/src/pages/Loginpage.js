import React, { useState, useContext } from "react";
import { Form, Input, Button, notification } from "antd";
import { AiOutlineUser } from "react-icons/ai";
import { FiLock } from "react-icons/fi";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AuthContext from "../context/auth-context";
import minions from "../assets/images/minions.png";

// 引入你的 Loadingpage (請確認路徑是否正確，例如 ../pages/Loadingpage 或 ../components/Loadingpage)
import LoadingOverlay from "./LoadingOverlay"; 

const Loginpage = () => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  
  // 新增 loading 狀態
  const [isLoading, setIsLoading] = useState(false);

  // 錯誤通知處理
  const onErrorHandler = (err) => {
    notification.error({
      message: "Login Failed!",
      duration: 7,
      description: `An error has occurred. Please try again later. Error message: ${err.message}`,
      style: { width: 500 },
    });
  };

  // 登入邏輯
  const onLoginHandler = async (values) => {
    // 1. 開始請求前，開啟 Loading 畫面
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      // 登入成功
      auth.login(responseData.uid, responseData.access_token);
      
      // 注意：登入成功後通常會跳轉頁面，所以這裡不需要 setIsLoading(false)，
      // 保持 Loading 狀態直到頁面切換，可以避免畫面閃爍回登入表單。

    } catch (err) {
      console.error(err);
      onErrorHandler(err);
      
      // 2. 如果發生錯誤，必須關閉 Loading 讓使用者能再次嘗試
      setIsLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  // 否則回傳原本的登入頁面
  return (
    <section className="flex flex-col min-h-screen select-none">

      {isLoading && <LoadingOverlay />}

      <NavBar />
      
      <div className="z-0 bg-white flex-1 flex items-center justify-center px-6 xl:px-44">
        <div className="rounded-xl w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
          
          {/* 左側圖片 */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <img src={minions} alt="Login Visual" className="w-3/4 object-contain" />
          </div>

          {/* 右側登入表單 */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="px-8 pt-8 bg-white rounded-md drop-shadow drop-shadow-[0_0_15px_rgba(0,0,0,0.20)] hover:drop-shadow-[0_0_25px_rgba(0,0,0,0.30)] transition duration-200 w-96">
              <div className="text-gray-700 font-semibold text-3xl mb-8">
                Welcome to Toolmen
              </div>
              
              <Form
                name="login-form"
                form={form}
                initialValues={{ remember: true }}
                onFinish={onLoginHandler}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                hideRequiredMark
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: "Please input your username!" }]}
                >
                  <Input
                    size="large"
                    prefix={<AiOutlineUser className="text-gray-400 w-5 h-5 mr-2" />}
                    placeholder="Username"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
                >
                  <Input.Password
                    size="large"
                    prefix={<FiLock className="text-gray-400 ml-0.5 mr-2" />}
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="bg-blue-500 w-full rounded-md mt-2"
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Loginpage;