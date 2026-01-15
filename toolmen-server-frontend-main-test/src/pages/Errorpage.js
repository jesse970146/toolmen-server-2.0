import React, { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Spin, Space, Statistic, Button } from "antd";

import AuthContext from "../context/auth-context";

import dory from "../assets/images/dory.png";

const { Countdown } = Statistic;

const Errorpage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const time = parseInt(searchParams.get("time")) * 1000 || 5000;

  const returnToHomepage = () => {
    window.location.replace("/")
  }

  useEffect(() => {
    setTimeout(() => {
      returnToHomepage();
    }, time - 300);
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center px-16 py-16 select-none">
      <div className="rounded-xl  w-full h-full flex items-center">
        <div className="w-[48rem]  px-44">
          <img src={dory} />
        </div>
        <div className="flex flex-col">
          <div className="text-6xl font-semibold text-gray-700">OOPS!</div>
          <div className="text-4xl font-semibold text-gray-700">
            An Error Occurred!
          </div>
          <span className="flex items-center text-lg text-gray-700 gap-2 mt-4">
            
            You will be redirected to the homepage in
            <Countdown value={Date.now() + time} format="s" /> seconds.
          </span>
          <Button type="primary"  className="bg-blue-500 w-40 rounded-md mt-8" onClick={() => {returnToHomepage()}}>Return to Homepage</Button>
        </div>
      </div>
    </div>
  );
};

export default Errorpage;
