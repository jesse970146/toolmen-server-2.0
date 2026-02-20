import React from "react";
import { Spin } from "antd";

const Loadingpage = ({ isDark }) => {
  return (
    // 1. 確保加上 bg-white 
    // 2. 確保 dark 類別被正確注入
    <div className={`flex flex-col justify-center items-center gap-4 h-screen w-screen transition-colors duration-500 
      ${isDark ? 'dark bg-slate-900' : 'bg-white'}`}>
      
      <Spin size="large" />
      
      <span className="text-gray-500 dark:text-gray-400 text-lg font-medium tracking-wide animate-pulse">
        Loading...
      </span>
    </div>
  );
};
export default Loadingpage;