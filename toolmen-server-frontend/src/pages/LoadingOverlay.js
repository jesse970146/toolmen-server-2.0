import React from "react";
import { Spin } from "antd";

const LoadingOverlay = () => {
  return (
    // fixed inset-0 讓它蓋滿全螢幕
    // bg-white/50 + backdrop-blur 讓背景變半透明模糊，保留「還在原本頁面」的感覺
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/20 dark:bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
        <Spin size="large" />
        <div className="mt-4 font-semibold text-gray-700 dark:text-gray-300">Logging in...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
