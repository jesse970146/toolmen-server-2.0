import React from "react";
// 注意這裡路徑變了，多了一個 /client
import { createRoot } from "react-dom/client"; 
import "./index.css"; // 這是你的 CSS 檔，保留原本的即可
import App from "./App";
// import reportWebVitals from "./reportWebVitals"; // 如果你有用這個就保留

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <React.StrictMode> // 如果不想看到重複渲染的 log，這行可以先註解
    <App />
  // </React.StrictMode>
);