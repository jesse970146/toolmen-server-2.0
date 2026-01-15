import React, { useState, useEffect } from "react";
import { Empty, Button, Card, Avatar } from "antd";

import { MdOutlineOpenInNew } from "react-icons/md";

const onLaunchHandler = (url) => {
  window.open(url);
};

const APPsTab = (props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <Card
        className="hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.08)] transition duration-200 "
        bodyStyle={{ padding: 15 }}
      >
        <div className="h-80 flex flex-col gap-4">
          <div className="flex items-center gap-2 w-full">
            <Avatar
            className="bg-gray-100"
              size={40}
              src={
                "https://www.v2k8s.com//uploads/communities/ZSJbaepdZTz4fSh0yXg3.png"
              }
            />
            <div className="flex flex-col h-full justify-center gap-0.5">
              <div className="text-gray-700 font-semibold text-lg leading-none">
                KUBESPHERE
              </div>
              <a
                className="text-blue-500 font-light text-xs leading-none"
                href="https://kubesphere.io/"
                target="_blank"
              >
                kubesphere.io
              </a>
            </div>
          </div>
          <div className="flex-1"></div>
          <Button
            type="primary"
            onClick={() => {onLaunchHandler('https://kubesphere.toolmenlab.bime.ntu.edu.tw/')}}
            className="w-full bg-blue-500 rounded-md flex items-center justify-center gap-2"
          >
            Launch Kubesphere
            <MdOutlineOpenInNew />
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default APPsTab;
