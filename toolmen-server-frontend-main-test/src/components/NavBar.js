import React, { useContext, useState } from "react";
import { Button } from "antd";
import { FaMoon, FaBullhorn } from "react-icons/fa";

import  AuthContext from "../context/auth-context";

const NavBar = () => {
  const auth = useContext(AuthContext);

  const [buttonLoading, setButtonLoading] = useState(false)

  const signOutHandler = () => {
    setButtonLoading(true)
    setTimeout(auth.logout, 800);
  };

  return (
    <section className="h-12 z-10 flex items-center justify-between bg-gray-100 shadow-sm px-12 xl:px-44">
      <span className="text-gray-700 font-semibold text-lg">Toolmen Lab</span>
      <div name="Header-Right" className="flex items-center gap-6">
        {/* <FaBullhorn />
        <FaMoon /> */}
        {/* <Button type="text" loading={buttonLoading} onClick={signOutHandler} >
          {buttonLoading? 'signing out':'sign out'}
        </Button> */}
        {auth.isLoggedIn && (
            <Button type="text" loading={buttonLoading} onClick={signOutHandler}>
              {buttonLoading ? "Signing out" : "Sign out"}
            </Button>
          )}
      </div>
    </section>
  );
};

export default NavBar;
