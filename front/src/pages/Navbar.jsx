import { AuthStore } from "@/store/AuthStore";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";
import PillNav from "../blocks/Components/PillNav/PillNav";

const Navbar = () => {
  const { authUser, isCheckingAuth } = useRecoilValue(AuthStore);
  const [logo, setLogo] = useState("");
  const location = useLocation();

  if (authUser && !isCheckingAuth) {
    return (
        <div className=" flex justify-center">
          <PillNav
            logo={logo}
            logoAlt="Company Logo"
            items={[
              { label: "Home", href:"/" },
              { label: "Profile", href: "/profile" },
              { label: "Logout", href: "/logout" },
            ]}
            activeHref={location.pathname}
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#000000"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            initialLoadAnimation="false"
          />
        </div>
    );
  } else {
    return <></>;
  }
};

export default Navbar;
