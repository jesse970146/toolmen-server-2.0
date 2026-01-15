import React, { useState, useEffect, useContext } from "react";
import { Button, Table, Tag, message, Modal} from "antd";

import {
  FaRunning,
  FaBan,
} from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import AuthContext from "../context/auth-context";
import CreateNewImage from "./CreateNewImage";

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

const AdminTab_image = ({props, isActive}) => {

  const auth = useContext(AuthContext);
  const [loadedImage, setLoadedImage] = useState([]);
  const [Visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  const sendRequest = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/image", {
        headers: { Authorization: "Bearer " + auth.token },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setLoadedImage(responseData.images);
      console.log(responseData.images);
    } catch (err) {
      console.log(err);
      message.error("Failed to load images");
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

  const ImageDelete = async (image) => {
    Modal.confirm({
      title: "Delete Image",
      content: `Are you sure you want to delete Image "${image.name}"?`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/image/`+ image.name,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth.token,
              },
              // body: JSON.stringify({
              //   name: image.name
              //   // disabled: form.getFieldValue("disabled"),
              // }),
            }
          );
          const responseData = await response.json();
          if (!response.ok) throw new Error(responseData.message);
          message.success("Image deleted successfully");
          sendRequest();
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
        // multiple: 3,
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
        width: 1000,
          render: (text) => (
            <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
              {text}
            </div>
          ),
      },
      {
        title: "Description",
        dataIndex: "Description",
        key: "Description",
        width: 1000,
          render: (text) => (
            <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
              {text}
            </div>
          ),
      },
      {
        title: "Actions",
        key: "actions",
        width: "10%",
        render: (text, image) => {
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
                onClick={() => ImageDelete(image)}
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
        <div className="flex gap-2">
        
        <Button type="primary" 
          onClick={showDrawer} 
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          <FaPlus />
          Create New Image
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
      <Table dataSource={loadedImage} columns={columns} />;
      <CreateNewImage
        onClose={onClose}
        visible={Visible}
        sendRequest={sendRequest}
      />
    </>
  );
};
export default AdminTab_image;
