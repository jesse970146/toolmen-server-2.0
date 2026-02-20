import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Statistic, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import dory from "../assets/images/dory.png";

const { Countdown } = Statistic;

const Errorpage = () => {
  const [searchParams] = useSearchParams();

  // 取得時間參數，預設為 5 秒
  const paramTime = searchParams.get("time");
  const delay = paramTime ? parseInt(paramTime) * 1000 : 5000;
  // 設定倒數計時的終點時間
  const deadline = Date.now() + delay;

  const returnToHomepage = () => {
    // 使用 replace 避免使用者按上一頁又回到錯誤頁面
    window.location.replace("/");
  };

  useEffect(() => {
    // 設定計時器自動跳轉
    const timer = setTimeout(() => {
      returnToHomepage();
    }, delay);

    // 清除計時器 (如果使用者在時間到之前手動按鈕離開，避免報錯)
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50 px-4 py-8 select-none dark:bg-slate-800">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-5xl transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:bg-slate-900 dark:border-gray-700">
        
        {/* 左側圖片區 - RWD 優化: 手機版縮小，電腦版正常 */}
        <div className="w-64 md:w-96 flex-shrink-0 animate-fade-in-up dark:animate-fade-in-up-dark">
          <img 
            src={dory} 
            alt="Error Illustration" 
            className="w-full h-auto object-contain drop-shadow-md dark:drop-shadow-lg"
          />
        </div>

        {/* 右側文字區 */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left dark:text-gray-300 animate-fade-in-up dark:animate-fade-in-up-dark">
          <div className="text-6xl md:text-8xl font-black text-blue-200 mb-2 tracking-wider dark:text-blue-400">
            OOPS!
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 dark:text-gray-100">
            Something went wrong
          </h1>
          
          <div className="flex flex-col md:flex-row items-center text-lg text-gray-500 gap-2 mb-8 font-medium dark:text-gray-400">
            <span>You will be redirected to the homepage in</span>
            <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 dark:bg-blue-900 dark:border-blue-700">
              <Countdown 
                value={deadline} 
                format="s" 
                onFinish={returnToHomepage} // 倒數結束直接觸發跳轉
                valueStyle={{ fontSize: '1.25rem', color: '#3b82f6', fontWeight: 'bold' }}
              />
            </div>
            <span>seconds.</span>
          </div>

          <Button 
            type="primary" 
            size="large"
            icon={<HomeOutlined />}
            className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-full shadow-lg hover:shadow-blue-500/30 border-0 text-base font-semibold transition-all duration-300 transform hover:-translate-y-1"
            onClick={returnToHomepage}
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Errorpage;