import React, { useState, useEffect, useRef  } from "react";
import { Empty, Button } from "antd";

import GaugeChart from "react-advanced-gauge-chart";

import webSocket from "socket.io-client";

const GpuUsage = () => {
  const [gpuData, setGpuData] = useState([]);

  

  useEffect(() => {
    const ws = webSocket("http://localhost:7890/ws/dataPush")
    ws.emit("sub", "")
    ws.on("push_data", (message) => {
      setGpuData(pre => JSON.parse(message)[0]);
      console.log(JSON.parse(message)[0])
    });
 
  }, []);


  return (
    <div className="w-full ">
      <div className="text-gray-700 font-semibold mb-4">
        GeForce GTX 1070 Ti 
      </div>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <GaugeChart
            id="gauge-chart1"
            style={{ width: 180, margin: 0, padding: 0 }}
            nrOfLevels={20}
            colors={["#FFC371", "#FF5F6D"]}
            animDelay={50}
            animateDuration={2000}
            // hideText={true}
            textColor="#333333"
            needleColor="#CCCCCC"
            needleBaseColor="#AAAAAA"
            arcWidth={0.3}
            percent={gpuData.mem / 100}
          />
          <div>Memory</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <GaugeChart
            id="gauge-chart2"
            style={{ width: 180 }}
            nrOfLevels={20}
            colors={["#FFC371", "#FF5F6D"]}
            animDelay={50}
            animateDuration={2000}
            needleColor="#CCCCCC"
            needleBaseColor="#AAAAAA"
            // hideText={true}
            textColor="#333333"
            arcWidth={0.3}
            percent={gpuData.sm / 100}
          />
          <div>Utility</div>
          
        </div>
      </div>
      
    </div>
  );
};
export default GpuUsage;
