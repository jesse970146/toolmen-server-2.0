import React, { useContext } from "react";
import {
  Card,
  Button,
  Dropdown,
  Space,
  Menu,
  Tag,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  FaUbuntu,
  FaRunning,
  FaTrashAlt,
  FaLinux,
  FaBan,
  FaRedo,
  FaAngleDown,
} from "react-icons/fa";

import { SiJupyter } from "react-icons/si";
import { AiOutlinePoweroff } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";

import { ReactComponent as UbuntuLogo } from "../assets/images/ubuntu-logo.svg";
import  AuthContext  from "../context/auth-context";

const WorkspaceItem = (props) => {
  const auth = useContext(AuthContext);
  const workspace = props.w;
  const onDeleteHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL+ "/workspace/" + workspace.name,
        { method: "DELETE", headers: { Authorization: "Bearer " + auth.token } }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      props.sendRequest();
    } catch (err) {
      console.log(err);
    }
  };
  const confirm = () => {
    onDeleteHandler();
  };

  const onRestartHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL+ "/workspace/" + workspace.name,
        { method: "PUT", headers: { Authorization: "Bearer " + auth.token } }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      props.sendRequest();
    } catch (err) {
      console.log(err);
    }
  };


  const onStopHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL + "/api/workspace/stop/" + workspace.name,
        { method: "POST" }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      props.sendRequest();
    } catch (err) {
      console.log(err);
    }
  };

  const onStartHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_BASE_URL + "/api/workspace/start/" + workspace.name,
        { method: "POST" }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      props.sendRequest();
    } catch (err) {
      console.log(err);
    }
  };

  let PowerButton = <></>;
  let ResetButton = <></>;
  let BigLogo = <></>;
  let LinkButtons = <></>;
  let StatusTag = <></>;
  // http://ml.workspace.toolmen.bime.ntu.edu.tw/admin-test0220/vnc/vnc.html?path=/admin-test0220/websockify
  const baseURL = "https://server.toolmen.bime.ntu.edu.tw/" + workspace.name  
    
  const onJupyterHandler = () => {
    window.open(baseURL + "/jupyter/");
  };
  const onDesktopHandler = () => {
    window.open(baseURL + "/vnc/vnc.html?path=/" + workspace.name +"/websockify?password=vncpasswd");
  };

  if (workspace.status == "Running") {
    PowerButton = (
      <Button
        danger
        className="flex justify-center items-center w-20 gap-1"
        onClick={() => onStopHandler()}
      >
        <AiOutlinePoweroff className="mt-0.5" />
        Stop
      </Button>
    );
    ResetButton = (
      <Button className="flex justify-center items-center px-4 gap-1 text-gray-700 "
        onClick={() => onStopHandler()}
      >
        <VscDebugRestart className="mt-0.5" />
        Restart
      </Button>
    );
    BigLogo = (
      <div className="w-48 h-44 text-gray-700 flex flex-col items-center justify-center pr-2 mt-3">
        <FaUbuntu className="w-20 h-20" />
        {/* <p className="font-semibold text-xs mt-1">Ubuntu 20.04 LTS</p> */}
        <p className="font-semibold text-sm mt-2">{workspace.server}</p>
      </div>
    );
    LinkButtons = (
      <>
        <Button
          type=""
          className="flex items-center font-semibold text-gray-700 rounded justify-center px-4 gap-2"
         
          // href={baseURL + "tree"}
          // target="_blank"
          onClick={() => {
            onJupyterHandler();
          }}
        >
          <SiJupyter />
          Jupyter
        </Button>
        <Button
          type=""
          className="flex items-center font-semibold text-gray-700 rounded justify-center px-4 gap-2"
          // flex justify-center items-center px-4 text-gray-700
          // href={baseURL + "tools/vnc?password=vncpassword"}
          // target="_blank"
          onClick={() => {
            onDesktopHandler();
          }}
        >
          <FaLinux />
          Desktop
        </Button>
      </>
    );
    StatusTag = (
      <Tag
        color="processing"
        className="rounded-full w-20 flex justify-center items-center gap-1"
        icon={<FaRunning className="" />}
      >
        Running
      </Tag>
    );
  }
  if (workspace.status != "Running") {
    PowerButton = (
      <Button
        type="primary"
        ghost
        className="flex justify-center items-center w-20 gap-1"
        onClick={() => onStartHandler()}
      >
        <AiOutlinePoweroff className="mt-0.5" />
        Start
      </Button>
    );
    ResetButton = (
      <Button disabled className="flex justify-center items-center px-4 gap-1">
        <VscDebugRestart className="mt-0.5" />
        Reset
      </Button>
    );
    BigLogo = (
      <div className="w-48 h-44 text-gray-700 flex flex-col items-center justify-center pr-2 mt-3">
        <FaUbuntu className="w-20 h-20" />
        {/* <p className="font-semibold text-xs mt-1">Ubuntu 20.04 LTS</p> */}
        <p className="font-semibold text-sm mt-2">{workspace.server}</p>
      </div>
    );
    LinkButtons = (
      <>
        
      </>
    );
    StatusTag = (
      <Tag
        color="default"
        className="rounded-full w-20 flex justify-center items-center gap-1"
        icon={<FaBan className="" />}
      >
        Unusable
      </Tag>
    );
  }

  const menu = (
    <Menu>
      <Menu.Item
        className="flex justify-center items-center px-4 text-gray-700"
        icon={<FaRedo className="" />}
        onClick={onRestartHandler}
      >
        Restart
      </Menu.Item>
      <Popconfirm
        title="Are you sure to delete this workspace?"
        onConfirm={confirm}
        okType="danger"
        okText="Delete"
        cancelText="Cancel"
      >
        <Menu.Item
          danger
          className="flex justify-center items-center px-4"
          icon={<FaTrashAlt className="" />}
          // onClick={() => {}}
        >
          Delete
        </Menu.Item>
      </Popconfirm>
      
    </Menu>
  );

  return (
    <Card
      className="hover:drop-shadow-[0_0_15px_rgba(0,0,0,0.10)] transition duration-200"
      bodyStyle={{ padding: 10 }}
    >
      <div className="flex divide-x">
        <div className="mr-1">
          {BigLogo}
          <div className="flex items-center justify-center gap-2 pb-2">
          </div>
        </div>

        <div className="pl-4 pr-4 py-2 flex flex-col w-full">
          <div className=" flex gap-2 justify-between items-center">
            <div className="font-semibold text-xl flex-1 select-text">
              {workspace.name}
            </div>
            {StatusTag}
            <Dropdown overlay={menu} placement="bottomLeft" trigger={["click"]}>
              <Button className="flex justify-center items-center px-4 gap-2 text-gray-700">
                More
                <FaAngleDown className="" />
              </Button>
            </Dropdown>
          </div>

          <div className="flex-1 flex flex-col justify-begin mt-4 text-gray-500">
            <Row gutter={16}>
              <Col span={5}>
                <span className="font-semibold">Creation time</span>
              </Col>
              <Col span={19}> {workspace.create_time}</Col>
            </Row>
            <Row gutter={16}>
              <Col span={5}>
                <span className="font-semibold">Image</span>
              </Col>
              <Col span={19}> {workspace.image_name}</Col>
            </Row>
            <Row gutter={16}>
              <Col span={5}>
                <span className="font-semibold">Description</span>
              </Col>
              <Col span={19}> {workspace.status} </Col>
            </Row>
          </div>
          <Space>{LinkButtons}</Space>
        </div>
      </div>
    </Card>
  );
};

export default WorkspaceItem;
