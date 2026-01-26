import React from "react";
import { Spin } from "antd";

const Loadingpage = () => {
  return (
    // 修改這裡：加上 flex-col (垂直排列) 和 gap-3 (間距)
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-3">
      <Spin size="large" />
      <span className="text-gray-500 text-lg font-medium tracking-wide">
        Loading...
      </span>
    </div>
  );
};

export default Loadingpage;