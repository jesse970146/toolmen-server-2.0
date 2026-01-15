import React from "react";
import { Spin } from "antd";

const Loadingpage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default Loadingpage;
