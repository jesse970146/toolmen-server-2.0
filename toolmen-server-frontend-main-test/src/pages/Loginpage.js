import React, { useState, useContext } from "react";
import { Form, Input, Button, Checkbox, Divider, notification } from "antd";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaUserAlt } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { FiLock } from "react-icons/fi";

import NavBar from "../components/NavBar";
import AuthContext from "../context/auth-context";

import minions from "../assets/images/minions.png";
import Footer from "../components/Footer";
const onErrorHandler = (err) => {
  notification["error"]({
    message: "Login Failed!",
    duration: 7,
    description:
      "An error has occurred. Please try again later. If you continue to encounter this problem, contact your admin. Error message: " +
      err.message,
    style: {
      width: 500,
    },
  });
};

const Loginpage = (props) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();

  // const fetchUserData = async (userID, token) => {
  //   try {
  //     const response = await fetch(
  //       // "http://localhost:8080/user/" + String(userID),
  //       process.env.REACT_APP_BACKEND_BASE_URL + "/user/"+ String(userID),
  //       { 
  //         headers: { Authorization: "Bearer " + token },
  //       }
  //     );
  //     const responseData = await response.json();
  //     // console.log("UserID:", userID);
  //     // console.log("Token:", token);
  //     if (!response.ok) {
  //       throw new Error(responseData.message);
  //     }
  //     return responseData;
  //   } catch (err) {
  //     console.log(err);
  //     auth.logout();
  //   }
  // };

  const onLoginHandler = async (values) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL + "/login",
        // "http://localhost:8080" + "/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.getFieldValue("username"),
            password: form.getFieldValue("password"),
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      // const userInfo = await fetchUserData(
      //   responseData.uid,
      //   responseData.access_token
      // );
      auth.login(responseData.uid, responseData.access_token);
      // auth.login(responseData.uid, responseData.access_token, userInfo);
    } catch (err) {
      console.log(err);
      onErrorHandler(err);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const LoginForm = (
    <Form
      name="basic"
      initialValues={{
        remember: true,
      }}
      form={form}
      onFinish={onLoginHandler}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      hideRequiredMark
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input
          size="large"
          prefix={<AiOutlineUser className="text-gray-400 w-5  h-5 mr-2" />}
          placeholder="Username"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password
          size="large"
          prefix={<FiLock className="text-gray-400 ml-0.5 mr-2" />}
          placeholder="Password"
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
  );
  return (
    // <div style={style.bgImageCard} className="h-screen w-screen select-none ">
    //   <div style={style.overlay} className="flex items-center justify-center">
    //     <div className="px-8 pt-8 bg-white/[0.85] rounded-md drop-shadow drop-shadow-[0_0_15px_rgba(0,0,0,0.10)] w-96">
    //

    //     </div>
    //   </div>
    // </div>
    <section className="flex flex-col min-h-screen select-none">
      <NavBar />
      <div className="z-0 bg-gray-100 flex-1 flex items-center justify-center px-6 xl:px-44">
        <div className="rounded-xl w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* 左側圖片 */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <img src={minions} className="w-3/4 object-contain" />
          </div>

          {/* 右側登入表單 */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="px-8 pt-8 bg-white rounded-md drop-shadow drop-shadow-[0_0_15px_rgba(0,0,0,0.20)] hover:drop-shadow-[0_0_25px_rgba(0,0,0,0.30)] transition duration-200 w-96">
              <div className="text-gray-700 font-semibold text-3xl mb-8">
                Welcome to Toolmen
              </div>
              {LoginForm}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

const style = {
  bgImageCard: {
    backgroundImage: `url("https://i.imgur.com/LQvFpI6.jpg")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  overlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
};

export default Loginpage;
