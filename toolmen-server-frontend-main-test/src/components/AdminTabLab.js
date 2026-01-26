import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, Table, message, Modal, Space } from "antd";
import { FaPlus } from "react-icons/fa6";
import AuthContext from "../context/auth-context";
import CreateNewLab from "./CreateNewLab";

const AdminTabLab = ({ isActive }) => {
  const auth = useContext(AuthContext);
  
  // 狀態管理
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // 開啟/關閉 Drawer
  const showDrawer = () => setIsDrawerVisible(true);
  const onClose = () => setIsDrawerVisible(false);

  // 取得 Labs 資料
  const fetchLabs = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/labs`, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch labs");
      }
      setLabs(responseData.labs || []);
    } catch (err) {
      console.error(err);
      // 只有在手動刷新時才跳錯誤，避免輪詢時一直跳錯誤訊息騷擾使用者
      if (showLoading) message.error("Failed to load labs");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [auth.token]);

  // 輪詢機制 (Polling)
  useEffect(() => {
    if (!isActive) return;

    fetchLabs(true); // 初次載入顯示 loading
    const interval = setInterval(() => fetchLabs(false), 5000); // 之後背景輪詢不顯示 loading

    return () => clearInterval(interval);
  }, [isActive, fetchLabs]);

  // 刪除 Lab
  const handleDeleteLab = (lab) => {
    Modal.confirm({
      title: "Delete Lab",
      content: (
        <span>
          Are you sure you want to delete Lab <b>{lab.name}</b>?
        </span>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/lab/${lab.name}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth.token,
              },
            }
          );
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
          }
          
          message.success("Lab deleted successfully");
          fetchLabs(true); // 刪除後刷新
        } catch (err) {
          console.error(err);
          message.error("Failed to delete Lab: " + err.message);
        }
      },
    });
  };

  // 表格欄位設定
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 300,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space>
          <Button
            danger
            size="small"
            onClick={() => handleDeleteLab(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* 頂部操作列 */}
      <div className="flex w-full justify-between items-center mb-4">
        <div className="text-gray-700 font-semibold text-xl">Lab Management</div>
        <div className="flex gap-2">
          {/* <Button 
            onClick={() => fetchLabs(true)} 
            icon={<IoReload />}
            loading={loading}
          >
            Reload
          </Button> */}
          <Button
            type="primary"
            onClick={showDrawer}
            className="flex items-center gap-2 bg-blue-500"
            icon={<FaPlus />}
          >
            Create New Lab
          </Button>
        </div>
      </div>

      {/* 資料表格 */}
      <Table
        dataSource={labs}
        columns={columns}
        rowKey={(record) => record.name || record.id} // 確保每一列有唯一 key，避免報錯
        loading={loading && labs.length === 0} // 只有在沒資料且載入中時才顯示 table loading
        pagination={{ pageSize: 10 }}
      />

      {/* 新增 Lab 的 Drawer */}
      <CreateNewLab
        visible={isDrawerVisible}
        onClose={onClose}
        sendRequest={() => fetchLabs(true)}
      />
    </>
  );
};

export default AdminTabLab;