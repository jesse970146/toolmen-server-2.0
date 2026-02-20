import React from "react";
import { Empty } from "antd";
import WorkspaceItem from "./WorkspaceItem";

const WorkspaceList = ({ items, sendRequest }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 mx-4 dark:bg-slate-800/50 dark:border-gray-600">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="flex flex-col items-center">
              <span className="text-gray-500 font-medium text-lg dark:text-gray-400">
                No workspaces found
              </span>
              <span className="text-gray-400 text-sm mt-1 dark:text-gray-500">
                Click the "Create New Workspace" button to get started.
              </span>
            </div>
          }
        />
      </div>
    );
  }

  return (
    // 修改重點：
    // 1. md:grid-cols-2 (平板顯示 2 個)
    // 2. xl:grid-cols-3 (大螢幕顯示 3 個) -> 以前是 4 個，現在改 3 個讓空間更大
    // 3. gap-8 (增加卡片間距)
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
      {items.map((item) => (
        <WorkspaceItem
          key={item.id || item.name} 
          w={item}
          sendRequest={sendRequest}
        />
      ))}
    </div>
  );
};

export default WorkspaceList;