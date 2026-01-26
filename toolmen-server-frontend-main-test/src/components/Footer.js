import React from "react";

const Footer = () => {
  return (
    // 外層：負責全螢幕寬度、白色背景、毛玻璃效果
    <footer className="relative w-full bg-white/90 backdrop-blur-sm mt-auto">
      
      {/* 裝飾性漸層線：絕對定位在頂部，與白底完美切齊 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      {/* 內層容器：限制內容最大寬度 (max-w-screen-md)，解決「感覺太寬」的問題 */}
      <div className="max-w-screen-md mx-auto py-8 px-4 text-center space-y-3">
        
        {/* 標題 */}
        <div className="text-lg font-bold tracking-wide text-gray-800">
          TOOLMEN SERVER <span className="text-blue-600">2.0</span>
        </div>
        
        {/* 開發者名單 - 使用 flex 在小螢幕自動調整，大螢幕置中 */}
        <div className="text-sm text-gray-600 flex flex-wrap justify-center gap-x-1">
          <span>Built by</span>
          <span className="font-medium text-gray-900">Sheng-Chieh Lai</span>,
          <span className="font-medium text-gray-900">Bo-Lin Chen</span>, &
          <span className="font-medium text-gray-900">Kuan-Ting Yeh</span>
        </div>
        
        {/* 版權宣告 */}
        <div className="text-xs text-gray-400">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;