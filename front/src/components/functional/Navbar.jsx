//logical imports
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

//store
import { useLoadingStage } from "../../store/LoadingStage";
import { useAuthStore } from "../../store/AuthStore";

//ui components
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const authUser = useAuthStore((state) => state.authUser);

  const isUpdatingName = useLoadingStage((state) => state.isUpdatingName);
  const isUpdatingPassword = useLoadingStage((state) => state.isUpdatingPassword);

  useEffect(()=>{

    //console.log("react trying to render Navbar.jsx");
    
  },[])

  if (!authUser || isUpdatingName || isUpdatingPassword) {
    return <></>;
  }

  return (
    <div className="m-4 w-[100vw] flex flex-row gap-7 justify-center fixed top-0 z-50">
      <Button
        className={`shadow-xl hover:bg-gray-300 hover:scale-110 focus:bg-gray-700 focus:text-amber-300 focus:scale-120 ${
          location.pathname === "/"
            ? "bg-gray-700 text-amber-300 scale-120"
            : "bg-white"
        }`}
        onClick={() => navigate("/")}
      >
        Home
      </Button>
      <Button
        className={`shadow-xl hover:bg-gray-300 hover:scale-110 focus:bg-gray-700 focus:text-amber-300 focus:scale-120 ${
          location.pathname === "/profile"
            ? "bg-gray-700 text-amber-300 scale-120"
            : "bg-white"
        }`}
        onClick={() => navigate("/profile")}
      >
        Profile
      </Button>
      <Button
        className="text-red-500 shadow-xl bg-white hover:bg-red-500 hover:text-white hover:scale-110"
        onClick={() => navigate("/logout")}
      >
        Logout
      </Button>
    </div>
  );
};

export default Navbar;
