import React, { useContext, useState } from "react";
import {
  Card,
  Button,
  Dropdown,
  Menu,
  Tag,
  Tooltip,
  message,
  Modal,
  Input,
  Typography,
  Space
} from "antd";
import {
  FaUbuntu,
  FaTrashAlt,
  FaLinux,
  FaRedo,
  FaEllipsisV,
  FaBan,
  FaCheckCircle,
  FaSync,
  FaExclamationTriangle,
} from "react-icons/fa";

import { SiJupyter } from "react-icons/si";
import AuthContext from "../context/auth-context";

const { Text, Paragraph } = Typography;

const WorkspaceItem = ({ w: workspace, sendRequest }) => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- 狀態設置 ---
  const getStatusConfig = (status) => {
    switch (status) {
      case "Running":
        return { color: "success", icon: <FaCheckCircle />, bg: "bg-green-50" };
      case "Creating":
      case "Restarting":
      case "Pending":
        return { color: "processing", icon: <FaSync className="animate-spin" />, bg: "bg-blue-50" };
      default:
        return { color: "default", icon: <FaBan />, bg: "bg-gray-100" };
    }
  };

  const statusConfig = getStatusConfig(workspace.status);
  const isRunning = workspace.status === "Running";

  // --- API Actions ---
  const handleAction = async (url, method, isDelete = false) => {
    const setLoadingState = isDelete ? setDeleteLoading : setLoading;
    setLoadingState(true);
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + url, {
        method: method,
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Action failed");
      message.success(isDelete ? "Workspace deleted successfully" : "Success");
      if (isDelete) setIsDeleteModalOpen(false);
      sendRequest();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Something went wrong");
    } finally {
      setLoadingState(false);
    }
  };

  const onRestartHandler = () => handleAction("/workspace/" + workspace.name, "PUT");
  const confirmDelete = () => {
    if (deleteInput === workspace.name) handleAction("/workspace/" + workspace.name, "DELETE", true);
  };

  // Links
  const baseURL = "https://server.toolmen.bime.ntu.edu.tw/" + workspace.name;
  const onJupyterHandler = () => window.open(baseURL + "/jupyter/", "_blank");
  const onDesktopHandler = () => window.open(baseURL + `/vnc/vnc.html?path=/${workspace.name}/websockify?password=vncpasswd`, "_blank");

  // Menu
  const menu = (
    <Menu>
      <Menu.Item key="restart" icon={<FaRedo />} onClick={onRestartHandler} disabled={workspace.status === "Creating" || loading} className="text-sm">
        Restart
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" danger icon={<FaTrashAlt />} onClick={() => { setDeleteInput(""); setIsDeleteModalOpen(true); }} className="text-sm">
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Card
        loading={loading}
        className="flex flex-col h-full hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border-gray-200"
        bodyStyle={{ padding: "0", display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* Header */}
        <div className={`px-5 py-4 flex justify-between items-center border-b ${isRunning ? "bg-green-50/60" : "bg-gray-50"}`}>
          <Tag color={statusConfig.color} className="m-0 rounded-full px-3 py-1 text-sm font-medium border-0 flex items-center gap-2">
            {statusConfig.icon} {workspace.status} 
          </Tag>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button type="text" shape="circle" icon={<FaEllipsisV className="text-gray-500 text-lg" />} />
          </Dropdown>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col items-center">
          <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${isRunning ? "bg-orange-50 text-orange-500" : "bg-gray-100 text-gray-400"}`}>
            <FaUbuntu size={52} className={workspace.status === "Creating" ? "animate-pulse" : ""} />
          </div>
          
          <div className="text-center w-full mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-1 truncate w-full px-2" title={workspace.name}>
              {workspace.name}
            </h3>
            <p className="text-sm text-gray-500 font-mono inline-block bg-gray-100 px-3 py-1 rounded-md">
              {workspace.server || "Server Node"}
            </p>
          </div>
          
          <div className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="grid grid-cols-[70px_1fr] gap-y-2 gap-x-4 text-sm">
              <div className="text-gray-500 font-medium text-right">Status</div>
              <div className={`font-semibold text-left truncate ${statusConfig.color === 'processing' ? 'text-blue-600' : 'text-gray-800'}`}>
                {workspace.status}
              </div>
              <div className="text-gray-500 font-medium text-right">Created</div>
              <div className="font-semibold text-gray-800 text-left truncate" title={workspace.create_time}>
                {workspace.create_time}
              </div>
              <div className="text-gray-500 font-medium text-right">Image</div>
              <div className="text-left">
                <Tooltip title={workspace.image_name}>
                  <div className="font-semibold text-gray-800 truncate cursor-help">
                    {workspace.image_name}
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-white mt-auto">
          {isRunning ? (
            <div className="flex gap-4 animate-fade-in">
              <Button 
                block 
                className="flex items-center justify-center gap-2 bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 hover:border-orange-300 h-11 text-base font-medium shadow-sm hover:shadow"
                onClick={onJupyterHandler}
              >
                <SiJupyter size={18} /> Jupyter
              </Button>
              <Button 
                block 
                className="flex items-center justify-center gap-2 h-11 text-base font-medium text-gray-600 shadow-sm hover:shadow hover:text-gray-800 hover:border-gray-400"
                onClick={onDesktopHandler}
              >
                <FaLinux size={18} /> Desktop
              </Button>
            </div>
          ) : (
            <div className="h-11 flex items-center justify-center text-gray-400 italic text-sm select-none">
               {workspace.status === "Creating" ? "Initializing..." : ""}
            </div>
          )}
        </div>
      </Card>

      {/* Delete Modal */}
      <Modal
        title={<div className="flex items-center gap-2 text-red-600 text-lg"><FaExclamationTriangle /><span>Delete Workspace</span></div>}
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button key="cancel" size="large" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>,
          <Button key="delete" type="primary" danger size="large" loading={deleteLoading} onClick={confirmDelete} disabled={deleteInput !== workspace.name}>Delete</Button>,
        ]}
      >
        <Space direction="vertical" className="w-full py-2">
          <div className="bg-red-50 border border-red-100 p-4 rounded-md text-red-800 text-base">
            Warning: This action <strong>cannot</strong> be undone. All data in 
            {/* 修改這裡：加入 whitespace-nowrap 強制不換行 */}
            <span className="font-mono mx-1 bg-white px-1.5 py-0.5 rounded border border-red-200 font-bold whitespace-nowrap">
              {workspace.name}
            </span> 
            will be permanently lost.
          </div>
          <Paragraph className="mb-0 mt-4 text-gray-600 text-base">
            {/* 這裡也加上 whitespace-nowrap 以防萬一 */}
            Please type <Text strong copyable className="text-base whitespace-nowrap">{workspace.name}</Text> to confirm.
          </Paragraph>
          <Input size="large" placeholder={workspace.name} value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} status={deleteInput && deleteInput !== workspace.name ? "error" : ""} onPressEnter={confirmDelete} className="text-base font-mono mt-2"/>
        </Space>
      </Modal>
    </>
  );
};

export default WorkspaceItem;