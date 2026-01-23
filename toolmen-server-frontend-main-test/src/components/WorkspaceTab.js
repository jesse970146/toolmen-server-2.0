import React, { useState, useEffect, useContext } from "react";
import { Button, Card } from "antd";

import WorkspaceList from "./WorkspaceList";
import CreateNewWorkspace from "./CreateNewWorkspace";
import GpuUsage from "./GpuUsage";

import AuthContext from "../context/auth-context";
import { IoReload } from "react-icons/io5";
const WorkspaceTab = ({isActive}) => {
  const auth = useContext(AuthContext);
  // console.log("🔍 isActive:", isActive);
  //fetch image
  const [ImageList, setImageList] = useState([]);
  const sendImageRequest = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/image", {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setImageList(responseData.images);
      console.log(responseData.images);
    } catch (err) {
      console.log(err);
    }
  };

  //
  const [NodeList, setNodeList] = useState([]);
  const sendNodeRequest = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/node", {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setNodeList(responseData.nodes);
      console.log(responseData.nodes);
    } catch (err) {
      console.log(err);
    }
  };
  //


  const [loadedWorkspaces, setLoadedWorkspaces] = useState([]);

  const sendRequest = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/workspace", {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setLoadedWorkspaces(responseData.workspaces);
      // console.log(loadedWorkspaces);
      console.log(responseData.workspaces);
    } catch (err) {
      console.log(err);
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

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    sendNodeRequest();
    sendImageRequest();
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <section className="w-full flex gap-8 pb-12 pt-4">
      <section className="flex-auto flex flex-col gap-6">
        <div style={style.bgImageCard} className=" h-12 w-full rounded-md">
          <div
            style={style.overlay}
            className="flex items-center justify-between px-4 h-12 rounded-md"
          >
            <span className="text-white">
              Please note that this service is still under development.
            </span>
            <Button
              ghost
              size="small"
              shape="round"
              onClick={() => window.open("https://forms.gle/kLpS3czCssVTpQjz6", "_blank")}
            >
              Report a bug / Wish list
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center h-8">
          <div className="text-xl font-semibold text-gray-700 flex flex-col">
            {loadedWorkspaces.length} of {auth.userInfo.quota} workspaces
            created
            {loadedWorkspaces.length >= auth.userInfo.quota && (
              <span className="text-gray-500 font-normal text-xs">
                You have reached the maximum number of workspaces
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={showDrawer}
              disabled={loadedWorkspaces.length >= auth.userInfo.quota}
              className=" flex justify-center items-center rounded-md gap-1 bg-blue-500"
            >
              <div>+ Create New Workspace</div>
            </Button>
          </div>
          <CreateNewWorkspace
            onClose={onClose}
            visible={visible}
            sendRequest={sendRequest}
            ImageList={ImageList}
            NodeList={NodeList}
          />
        </div>
        <WorkspaceList items={loadedWorkspaces} sendRequest={sendRequest} />
      </section>

    </section>
  );
};

const style = {
  bgImageCard: {
    backgroundImage: `url("https://images.unsplash.com/photo-1597649260558-e2bd7d35f043?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80")`,
    backgroundPosition: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
  },
};

export default WorkspaceTab;
