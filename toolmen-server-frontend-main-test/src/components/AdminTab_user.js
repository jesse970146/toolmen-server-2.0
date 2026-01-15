import React, { useState, useEffect, useContext } from "react";
import { Button, Table, Tag, Dropdown, Menu, message, Modal, notification } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FaRunning, FaBan } from "react-icons/fa";
import AuthContext from "../context/auth-context";
import CreateNewUser from "./CreateNewUser";
import EditUser from "./EditUser";
import { IoReload } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
const AdminTab_user = ({isActive}) => {
  const auth = useContext(AuthContext);
  const [loadedUsers, setLoadedUser] = useState([]);
  const [CreateNewUserVisible, setCreateNewUserVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [EditUserVisible, setEditUserVisible] = useState(false);

  const showCreateNewUserDrawer = () => {
    sendLabRequest();
    setCreateNewUserVisible(true);
  }

  const onCloseCreateNewUser = () => setCreateNewUserVisible(false);

  // const showEditUserDrawer = () => setEditUserVisible(true);
  const onCloseEditUser = () => setEditUserVisible(false);
  const showEditUserDrawer = (user) => {
    setEditingUser(user);       // 記住這位使用者
    setEditUserVisible(true); // 打開 Drawer
  };

  const [LabList, setLabList] = useState([]);
  const sendLabRequest = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/lab", {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      // console.log(responseData)
      setLabList(responseData.labs);
      console.log(responseData.labs);
    } catch (err) {
      console.log(err);
    }
  };





  const sendRequest = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/user`, {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message);
      setLoadedUser(responseData.all_users);
      console.log(responseData.all_users)
    } catch (err) {
      console.error(err);
      message.error("Failed to load users");
    }
  };
  useEffect(() => {
      if (!isActive) return;
  
      sendRequest(); // 初次呼叫
      const interval = setInterval(sendRequest, 5000); // 每 5 秒輪詢
  
      return () => clearInterval(interval); // 當 isActive 變為 false 時停止
    }, [isActive]);

  useEffect(() => {
    sendRequest();
  }, []);

  const onErrorHandler = (err) => {
        notification["error"]({
          message: "Workspace Creation Failed!",
          duration: 7,
          description:
          (
            <>
              An error has occurred. Please try again later.
            </>
          ),
            // "An error has occurred. Please try again later. <br /> Error message: " +
            // err.message,
          style: {
            width: 500,
          },
        });
      };

  const UserDelete = async (user) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete user "${user.username}"?`,
      okText: "Delete",
      okButtonProps: { danger: true },
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
          const responseData = await response.json();
          if (!response.ok) throw new Error(responseData.message);
          message.success("User deleted successfully");
          sendRequest();
        } catch (err) {
          console.error(err);
          message.error("Failed to delete user: " + err.message);
        }
      },
    });
  };

  const UserForgetpassword = async (user) => {
    Modal.confirm({
      title: "Reset User's Password",
      content: `Are you sure you want to reset the password?`,
      okText: "Reset",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
            const response = await fetch(
              process.env.REACT_APP_BACKEND_BASE_URL+ "/user/" +
                (user.id || "no-input"),
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + auth.token,
                },
                body: JSON.stringify({
                  event: "forgetPassword"
                }),
              }
            );
            const responseData = await response.json();
            if (!response.ok) {
              throw new Error(responseData.message);
            }
          } catch (err) {
            onErrorHandler(err);
            console.log(err);
          }
      },
    });
  };

  
  const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: "User",
    dataIndex: "username",
    key: "username",
    sorter: (a, b) => a.username.localeCompare(b.username),
    multiple: 3,
  },
  {
    title: "Admin ?",
    dataIndex: "is_admin",
    key: "is_admin",
    sorter: (a, b) => b.is_admin - a.is_admin, // ✅ 讓 true 在前面
    render: (value) => (value ? "✅" : "❌"),
  },
  {
    title: "LAB",
    dataIndex: "lab_name",
    key: "lab_name",
    sorter: (a, b) => a.lab_name.localeCompare(b.lab_name),
  },
  {
    title: "Actived",
    dataIndex: "actived",
    key: "actived",
    // sorter: (a, b) => a.lab_name.localeCompare(b.lab_name),
    render: (value) => (value ? "✅" : "❌"),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (value) => (value ? value : "unknown"),
  },
  {
    title: "Quota",
    dataIndex: "quota",
    key: "quota",
    // sorter: (a, b) => a.quota - b.quota,
  },
  {
    title: "Actions",
    key: "actions",
    width: "10%",
    render: (text, user) => {
      const menu = (
        <Menu>
          <Menu.Item key="edit" onClick={() => showEditUserDrawer(user)}>
            Edit User
          </Menu.Item>
          <Menu.Item key="forget" onClick={() => UserForgetpassword(user)}>
            Reset Password
          </Menu.Item>
          <Menu.Item key="delete" danger onClick={() => UserDelete(user)}>
            Delete
          </Menu.Item>
        </Menu>
      );

      return (
        <Dropdown overlay={menu}>
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
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-700 font-semibold text-xl"></div>
        <div className="flex gap-2">
          <div className="flex-1 gap-2">
          <Button type="primary" 
            onClick={showCreateNewUserDrawer} 
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            <FaPlus />
            Create New User
          </Button>
          {/* <Button
            type="primary"
            onClick={sendRequest}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            <IoReload />
            Reload Table
          </Button> */}
          </div>
        </div>
      </div>

      <Table
        rowKey="id"
        dataSource={loadedUsers}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />

      <CreateNewUser
        onClose={onCloseCreateNewUser}
        visible={CreateNewUserVisible}
        sendRequest={sendRequest}
        LabList={LabList}
      />
      <EditUser
        onClose={onCloseEditUser}
        visible={EditUserVisible}
        user={editingUser}
        sendRequest={sendRequest}
        
      />
    </>
  );
};

export default AdminTab_user;
