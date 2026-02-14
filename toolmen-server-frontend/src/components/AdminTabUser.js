import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, Table, Dropdown, message, Modal, } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FaPlus } from "react-icons/fa6";
import AuthContext from "../context/auth-context";
import CreateNewUser from "./CreateNewUser";
import EditUser from "./EditUser";

const AdminTabUser = ({ isActive }) => {
  const auth = useContext(AuthContext);

  // 狀態管理
  const [users, setUsers] = useState([]);
  const [labList, setLabList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10); 
  const onShowSizeChange = (current, size) => {
    setPageSize(size);
  };
  
  // Drawer 狀態
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false);
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // 取得 Labs 列表 (為了 CreateNewUser 選單用)
  const fetchLabs = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/labs`, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message);
      setLabList(responseData.labs || []);
    } catch (err) {
      console.error("Failed to fetch labs:", err);
      message.error("Failed to load lab list");
    }
  }, [auth.token]);

  // 開啟 Create User Drawer (先抓 Lab 資料再開)
  const showCreateUserDrawer = async () => {
    await fetchLabs();
    setIsCreateDrawerVisible(true);
  };

  const closeCreateUserDrawer = () => setIsCreateDrawerVisible(false);

  // 開啟 Edit User Drawer
  const showEditUserDrawer = (user) => {
    setEditingUser(user);
    setIsEditDrawerVisible(true);
  };

  const closeEditUserDrawer = () => {
    setIsEditDrawerVisible(false);
    setEditingUser(null);
  };

  // 取得 Users 列表
  // showLoading: true (轉圈圈), false (靜默更新)
  const fetchUsers = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users`, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message);
      setUsers(responseData.all_users || []);
    } catch (err) {
      console.error(err);
      if (showLoading) message.error("Failed to load users");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [auth.token]);

  // 輪詢機制
  useEffect(() => {
    if (!isActive) return;

    fetchUsers(true); // 初次載入
    const interval = setInterval(() => fetchUsers(false), 5000); // 每 5 秒靜默更新

    return () => clearInterval(interval);
  }, [isActive, fetchUsers]);

  // 刪除使用者
  const handleDeleteUser = (user) => {
    Modal.confirm({
      title: "Delete User",
      content: (
        <span>
          Are you sure you want to delete user <b>{user.username}</b>?
        </span>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/user/${user.id}`,
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
          
          message.success("User deleted successfully");
          fetchUsers(true); // 刷新列表
        } catch (err) {
          console.error(err);
          message.error("Failed to delete user: " + err.message);
        }
      },
    });
  };

  // 重設密碼
  const handleResetPassword = (user) => {
    Modal.confirm({
      title: "Reset User Password",
      content: (
        <span>
            Are you sure you want to reset the password for <b>{user.username}</b>?
        </span>
      ),
      okText: "Reset",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/user/${user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth.token,
              },
              body: JSON.stringify({ event: "forgetPassword" }),
            }
          );
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
          }
          message.success(`Password for ${user.username} has been reset.`);
        } catch (err) {
          console.error(err);
          message.error("Failed to reset password: " + err.message);
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      width: 150,
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Admin",
      dataIndex: "is_admin",
      key: "is_admin",
      width: 100,
      align: 'center',
      sorter: (a, b) => b.is_admin - a.is_admin,
      render: (value) => (value ? "✅" : "❌"),
    },
    {
      title: "LAB",
      dataIndex: "lab_name",
      key: "lab_name",
      width: 150,
      sorter: (a, b) => (a.lab_name || "").localeCompare(b.lab_name || ""),
    },
    {
      title: "Active",
      dataIndex: "actived",
      key: "actived",
      width: 100,
      align: 'center',
      render: (value) => (value ? "✅" : "❌"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (value) => value || "unknown",
    },
    {
      title: "Quota",
      dataIndex: "quota",
      key: "quota",
      width: 100,
      sorter: (a, b) => a.quota - b.quota,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: 'right',
      render: (_, user) => {
        // Dropdown Menu 內容
        const items = [
          {
            key: 'edit',
            label: 'Edit User',
            onClick: () => showEditUserDrawer(user),
          },
          {
            key: 'forget',
            label: 'Reset Password',
            onClick: () => handleResetPassword(user),
          },
          {
            key: 'delete',
            label: 'Delete',
            danger: true, // v5 可以直接設定危險按鈕 (紅色)
            onClick: () => handleDeleteUser(user),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex w-full justify-between items-center mb-4">
        <div className="text-gray-700 font-semibold text-xl">User Management</div>
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={showCreateUserDrawer}
            className="flex items-center gap-2 bg-blue-500"
            icon={<FaPlus />}
          >
            Create New User
          </Button>
        </div>
      </div>

      <Table
        rowKey="id"
        dataSource={users}
        columns={columns}
        loading={loading && users.length === 0} // 只有初次沒資料時顯示轉圈
        pagination={{ pageSize: pageSize, showSizeChanger: true, onShowSizeChange: onShowSizeChange, defaultCurrent: 1 }} // ✅ 加上分頁設定
        scroll={{ x: 1000 }} // 如果欄位太多，允許橫向捲動
      />

      <CreateNewUser
        visible={isCreateDrawerVisible}
        onClose={closeCreateUserDrawer}
        sendRequest={() => fetchUsers(true)}
        LabList={labList}
      />

      <EditUser
        visible={isEditDrawerVisible}
        onClose={closeEditUserDrawer}
        user={editingUser}
        sendRequest={() => fetchUsers(true)}
      />
    </>
  );
};

export default AdminTabUser;