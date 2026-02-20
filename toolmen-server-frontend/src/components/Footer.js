import React from "react";

const Footer = () => {
  return (
    // 外層：
    // 1. py-8 改為 py-4 (高度減半)
    // 2. 加入 dark:bg-slate-900 支援深色模式
    <footer className="relative w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm mt-auto border-t-0 transition-colors duration-300">
      
      {/* 漸層線 (保持不變) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600/40 dark:via-purple-500/40 dark:to-blue-600/40"></div>
      
      {/* 內層容器：
          1. py-8 改為 py-4 (減少上下留白)
          2. space-y-3 改為 space-y-1 (減少文字行距) 
      */}
      <div className="max-w-screen-md mx-auto py-4 px-4 text-center space-y-1">
        
        {/* 標題與版本號 */}
        <div className="text-base font-bold tracking-wide text-gray-800 dark:text-gray-200">
          TOOLMEN SERVER <span className="text-blue-600 dark:text-blue-400 text-sm">2.0</span>
        </div>
        
        {/* 開發者名單 - 字體改小一點 (text-xs) */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap justify-center gap-x-1 items-center">
          <span>Built by</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">Sheng-Chieh Lai</span>,
          <span className="font-medium text-gray-700 dark:text-gray-300">Bo-Lin Chen</span>, &
          <span className="font-medium text-gray-700 dark:text-gray-300">Kuan-Ting Yeh</span>
        </div>
        
        {/* 版權宣告 - 顏色調淡 */}
        <div className="text-[10px] text-gray-400 dark:text-gray-600 scale-90">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;