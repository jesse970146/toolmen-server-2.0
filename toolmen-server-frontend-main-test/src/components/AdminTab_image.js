import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, Table, message, Modal, Space } from "antd";
import { FaPlus } from "react-icons/fa6";
import AuthContext from "../context/auth-context";
import CreateNewImage from "./CreateNewImage";

const AdminTab_image = ({ isActive }) => {
  const auth = useContext(AuthContext);

  // 狀態管理
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // 開啟/關閉 Drawer
  const showDrawer = () => setIsDrawerVisible(true);
  const onClose = () => setIsDrawerVisible(false);

  // 取得 Images 資料
  // showLoading: true 代表要顯示轉圈圈 (初次載入用)
  // showLoading: false 代表背景偷偷更新 (輪詢用)
  const fetchImages = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/images`, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch images");
      }
      setImages(responseData.images || []);
    } catch (err) {
      console.error(err);
      // 只有在非輪詢狀態下才跳出錯誤提示，避免背景執行時一直跳錯誤視窗擾人
      if (showLoading) message.error("Failed to load images");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [auth.token]);

  // 輪詢機制 (Polling)
  useEffect(() => {
    if (!isActive) return;

    fetchImages(true); // 1. 初次載入：顯示 Loading
    const interval = setInterval(() => fetchImages(false), 5000); // 2. 背景輪詢：不顯示 Loading (靜默更新)

    return () => clearInterval(interval);
  }, [isActive, fetchImages]);

  // 刪除 Image
  const handleDeleteImage = (image) => {
    Modal.confirm({
      title: "Delete Image",
      content: (
        <span>
            Are you sure you want to delete Image <b>{image.name}</b>?
        </span>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/image/${image.name}`,
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
          
          message.success("Image deleted successfully");
          fetchImages(true); // 刪除成功後，刷新列表
        } catch (err) {
          console.error(err);
          message.error("Failed to delete Image: " + err.message);
        }
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 300,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 500, // 稍微調整寬度比例
      render: (text) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "Description", // 注意：這裡維持您原本的大小寫，如果後端回傳是 description 請自行修改
      key: "Description",
      width: 500,
      render: (text) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Space>
            <Button
              danger
              size="small" // 讓按鈕看起來精緻一點
              onClick={() => handleDeleteImage(record)}
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
        <div className="text-gray-700 font-semibold text-xl">Image Management</div>
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={showDrawer}
            className="flex items-center gap-2 bg-blue-500"
            icon={<FaPlus />}
          >
            Create New Image
          </Button>
        </div>
      </div>

      <Table 
        dataSource={images} 
        columns={columns} 
        rowKey={(record) => record.name || record.id} // 確保每一行都有唯一 ID
        loading={loading && images.length === 0} // 只有在沒資料且正在載入時才轉圈
        pagination={{ pageSize: 10 }}
      />
      
      <CreateNewImage
        visible={isDrawerVisible}
        onClose={onClose}
        sendRequest={() => fetchImages(true)}
      />
    </>
  );
};

export default AdminTab_image;