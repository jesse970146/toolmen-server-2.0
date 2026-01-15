import React, { useContext } from "react";
import { Empty } from "antd";

import WorkspaceItem from "./WorkspaceItem";

import AuthContext  from "../context/auth-context";

const WorkspaceList = (props) => {
  const auth = useContext(AuthContext);

  if (props.items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-8">
        <Empty description={false} />
        <div className="text-md font-semibold text-gray-500 mt-2">
          There is no workspace here. Create one now!
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-6">
        {props.items.map((item) => (
          <WorkspaceItem
            key={item.name}
            w={item}
            sendRequest={props.sendRequest}
          />
        ))}
      </div>
    );
  }
};

export default WorkspaceList;
