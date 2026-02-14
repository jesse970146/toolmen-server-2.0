import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, Table, message, Modal, Space } from "antd";
import AuthContext from "../context/auth-context";


const AdminTabWorkspace = ({ isActive }) => {
  const auth = useContext(AuthContext);

  // 狀態管理
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10); 
  const onShowSizeChange = (current, size) => {
    setPageSize(size);
  };


  // 取得 Workspace 列表
  const fetchWorkspaces = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/workspaces`, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch workspaces");
      }
      setWorkspaces(responseData.all_workspaces || []);
    } catch (err) {
      console.error(err);
      if (showLoading) message.error("Failed to load workspaces");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [auth.token]);

  // 輪詢機制
  useEffect(() => {
    if (!isActive) return;

    fetchWorkspaces(true); // 初次載入
    const interval = setInterval(() => fetchWorkspaces(false), 5000); // 每 5 秒靜默更新

    return () => clearInterval(interval);
  }, [isActive, fetchWorkspaces]);

  // 刪除 Workspace
  const handleDeleteWorkspace = (workspace) => {
    Modal.confirm({
      title: "Delete Workspace",
      content: (
        <span>
            Are you sure you want to delete workspace <b>{workspace.name}</b>?
        </span>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/workspace/${workspace.name}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth.token,
              },
            }
          );
          const responseData = await response.json();
          
          if (!response.ok) {
            throw new Error(responseData.message);
          }
          
          message.success("Workspace deleted successfully");
          fetchWorkspaces(true); // 刪除成功後刷新
        } catch (err) {
          console.error(err);
          message.error("Failed to delete Workspace: " + err.message);
        }
      },
    });
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user_name",
      key: "user_name",
      width: 150, // 設定寬度，確保橫拉時有足夠空間
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: "Workspace Name",
      dataIndex: "name",
      key: "name",
      width: 200, 
    },
    {
      title: "Image",
      dataIndex: "image_name",
      key: "image_name",
      width: 200,
    },
    {
      title: "Server",
      dataIndex: "server",
      key: "server",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Create Time",
      dataIndex: "create_time",
      key: "create_time",
      width: 200,
      sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100, // 固定寬度
      fixed: 'right', // (選用) 如果你希望 Actions 欄位固定在最右邊不被捲動，可以加上這行
      render: (_, workspace) => (
        <Space>
          <Button
            danger
            size="small"
            onClick={() => handleDeleteWorkspace(workspace)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex w-full justify-between items-center mb-4">
        <div className="text-gray-700 font-semibold text-xl">Workspace Management</div>
      </div>
      
      <Table 
        dataSource={workspaces} 
        columns={columns} 
        rowKey={(record) => record.name || record.id} 
        loading={loading && workspaces.length === 0}
        pagination={{ pageSize: pageSize, showSizeChanger: true, onShowSizeChange: onShowSizeChange, defaultCurrent: 1 }} // ✅ 加上分頁設定
        scroll={{ x: 1000 }} // ✅ 這裡加上了橫向捲動設定
      />
    </>
  );
};

export default AdminTabWorkspace;