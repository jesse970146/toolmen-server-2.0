import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, Alert, Progress, message, Tooltip, Typography } from "antd";
import { PlusOutlined, BugOutlined } from "@ant-design/icons"; // 引入 Ant Icons

import WorkspaceList from "./WorkspaceList";
import CreateNewWorkspace from "./CreateNewWorkspace";
import AuthContext from "../context/auth-context";

const { Text } = Typography;

const WorkspaceTab = ({ isActive }) => {
  const auth = useContext(AuthContext);
  
  // 狀態管理 (改為 camelCase)
  const [imageList, setImageList] = useState([]);
  const [nodeList, setNodeList] = useState([]);
  const [loadedWorkspaces, setLoadedWorkspaces] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 通用的 Fetch 處理函式 (DRY 原則)
  const fetchData = useCallback(async (endpoint, setter) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}${endpoint}`, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Request failed");
      }
      setter(responseData);
    } catch (err) {
      console.error(err);
      // 可以在這裡加入 message.error(err.message) 但為了避免輪詢時一直報錯，暫時保留 console
    }
  }, [auth.token]);

  // 載入 Workspaces 的具體動作
  const fetchWorkspaces = useCallback(async () => {
    // 這裡不設 loading，避免輪詢時畫面閃爍
    await fetchData(`/workspaces/${auth.userID}`, (data) => {
      setLoadedWorkspaces(data.workspaces || []);
    });
  }, [fetchData, auth.userID]);

  // 載入 Drawer 需要的資源 (Image & Node)
  const fetchResources = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchData("/images", (data) => setImageList(data.images || [])),
        fetchData("/node", (data) => setNodeList(data.nodes || []))
      ]);
    } catch (error) {
      message.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  // 處理輪詢 (Polling)
  useEffect(() => {
    if (!isActive) return;

    fetchWorkspaces(); // 初次立即呼叫
    const interval = setInterval(fetchWorkspaces, 5000); // 每 5 秒輪詢

    return () => clearInterval(interval);
  }, [isActive, fetchWorkspaces]);

  // 開啟 Drawer
  const showDrawer = () => {
    fetchResources(); // 開啟時才讀取資源，節省流量
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  // 計算 Quota
  const currentCount = loadedWorkspaces.length;
  const maxQuota = auth.userInfo.quota || 0;
  const isQuotaReached = currentCount >= maxQuota;
  const quotaPercent = Math.round((currentCount / maxQuota) * 100);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 pb-12 pt-6 flex flex-col gap-6">
      
      {/* 控制列 & 狀態顯示 */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-gray-100 pb-4">
        
        {/* 左側：Quota 顯示 */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <div className="flex items-baseline gap-2">
            <Text strong className="text-xl text-gray-700">My Workspaces</Text>
            <Text type="secondary" className="text-sm">
              ({currentCount} / {maxQuota})
            </Text>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-64">
            <Progress 
              percent={quotaPercent} 
              size="small" 
              status={isQuotaReached ? "exception" : "active"} 
              showInfo={false}
              strokeColor={isQuotaReached ? "#ff4d4f" : "#1890ff"}
            />
            {isQuotaReached && (
              <span className="text-red-500 text-xs whitespace-nowrap">Limit Reached</span>
            )}
          </div>
        </div>

        {/* 右側：動作按鈕 */}
        <div>
           <Tooltip title={isQuotaReached ? "You have reached the maximum number of workspaces" : "Create a new workspace environment"}>
            <Button
              type="primary"
              onClick={showDrawer}
              disabled={isQuotaReached}
              size="large"
              // 1. 移除 flex items-center (由內部 div 接手控制)
              // 2. 加上 border-transparent 避免 disabled 時邊框造成的 1px 位移
              className={`rounded-md shadow-sm border-transparent ${
                isQuotaReached 
                  ? 'bg-gray-400 text-gray-100 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {/* 3. 使用內部容器強制對齊 */}
              <div className="flex items-center justify-center gap-1.5 h-full">
                {/* 4. 圖示：加上 flex 確保它不會被當作文字處理 */}
                <span className="flex items-center">
                  <PlusOutlined />
                </span>
                
                {/* 5. 文字：加上 leading-none (行高設為 1) 消除文字上下的隱形空間，這是防抖動的關鍵 */}
                <span className="leading-none pb-[1px]">
                  Create New Workspace
                </span>
              </div>
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* 列表內容 */}
      <div className="min-h-[200px]">
        <WorkspaceList items={loadedWorkspaces} sendRequest={fetchWorkspaces} />
      </div>

      {/* 抽屜組件 */}
      <CreateNewWorkspace
        onClose={onClose}
        visible={drawerVisible}
        sendRequest={fetchWorkspaces}
        ImageList={imageList} // 保持傳給子組件的 prop 名稱不變 (若子組件未改)
        NodeList={nodeList}
      />
    </section>
  );
};

export default WorkspaceTab;