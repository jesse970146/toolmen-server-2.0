import React, { useState, useEffect, useContext } from "react";
import { Button, Table, Tag, message, Modal} from "antd";

import {
  FaRunning,
  FaBan,
} from "react-icons/fa";

import AuthContext from "../context/auth-context";
import { IoReload } from "react-icons/io5";
const onLaunchHandler = (url) => {
  window.open(url);
};

const RunningTag = (
  <Tag
    color="processing"
    className="rounded-full w-20 flex justify-center items-center gap-1"
    icon={<FaRunning className="" />}
  >
    running
  </Tag>
);

const StoppedTag = (
  <Tag
    color="default"
    className="rounded-full w-20 flex justify-center items-center gap-1"
    icon={<FaBan className="" />}
  >
    stopped
  </Tag>
);

// const columns = [
  
// ];

const AdminTab = ({props, isActive}) => {
  const auth = useContext(AuthContext);
  const [loadedWorkspaces, setLoadedWorkspaces] = useState([]);
  
  const sendRequest = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/workspaces", {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setLoadedWorkspaces(responseData.all_workspaces);
      console.log(responseData.all_workspaces);
    } catch (err) {
      console.log(err);
      message.error("Failed to load workspaces");
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

  const WorkspaceDelete = async (workspace) => {
    Modal.confirm({
      title: "Delete Workspace",
      content: `Are you sure you want to delete workspace "${workspace.name}"?`,
      okText: "Delete",
      okButtonProps: { danger: true },
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
          if (!response.ok) throw new Error(responseData.message);
          message.success("Workspacedeleted successfully");
          sendRequest();
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
        sorter: (a, b) => a.user_name.localeCompare(b.user_name),
        // multiple: 3,
      },
      {
        title: "Workspace name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Image",
        dataIndex: "image_name",
        key: "image_name",
      },
      {
        title: "Server",
        dataIndex: "server",
        key: "server",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      // {
      //   title: "Status",
      //   key: "status",
      //   dataIndex: "status",
      //   render: (status) => {
      //     if (status == "running") {
      //       return RunningTag;
      //     } else if (status == "stopped") {
      //       return StoppedTag;
      //     } else {
      //       return status;
      //     }
      //   },
      //   filters: [
      //     { text: "Running", value: "running" },
      //     { text: "Stopped", value: "stopped" },
      //   ],
      // },
      {
        title: "Create Time",
        dataIndex: "create_time",
        key: "create_time",
        sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time),
      },
      {
        title: "Actions",
        key: "actions",
        width: "10%",
        render: (text, workspace) => {
          // const baseURL =
          //   "http://ml.localhost/" +
          //   workspace.name +
          //   "/login?token=" +
          //   workspace.token +
          //   "&next=/" +
          //   workspace.name +
          //   "/";
          return (
            <Button
              key="delete"
                danger
                onClick={() => WorkspaceDelete(workspace)}
              >
                Delete
            </Button>
          );
        },
      },
  ];


  return (
    <>
      <div className="flex w-full justify-between items-center mb-4">
        <div className="text-gray-700 font-semibold text-xl"></div>
        {/* <Button
          type="primary"
          onClick={sendRequest}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          <IoReload />
          Reload Table
        </Button> */}
      </div>
      <Table dataSource={loadedWorkspaces} columns={columns} />;
    </>
  );
};
export default AdminTab;
