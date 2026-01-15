import React, { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Spin } from "antd";

import AuthContext from "../context/auth-context";



const LoginWatingpage = () => {
  const auth = useContext(AuthContext);

  const [searchParams, setSearchParams] = useSearchParams();
  
  const uid = searchParams.get("uid")
  const access_token = searchParams.get("access_token")
  

  useEffect(()=> {
    auth.login(uid, access_token);
  }, [])

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default LoginWatingpage;
