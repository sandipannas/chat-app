import React from "react";
import { useRecoilValue } from "recoil";
import { AuthStore } from "@/store/AuthStore";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {authUser} = useRecoilValue(AuthStore);

    if(!authUser){
        return (
            <></>
        );
    }

    return (
        <div className="m-4 w-[100vw] flex flex-row gap-7 justify-center fixed top-0 z-50">
            <Button 
                className={`shadow-xl hover:bg-gray-300 hover:scale-110 focus:bg-gray-700 focus:text-amber-300 focus:scale-120 ${
                    location.pathname === "/" ? "bg-gray-700 text-amber-300 scale-120" : "bg-white"
                }`} 
                onClick={()=>navigate("/")}
            >
                Home
            </Button>
            <Button 
                className={`shadow-xl hover:bg-gray-300 hover:scale-110 focus:bg-gray-700 focus:text-amber-300 focus:scale-120 ${
                    location.pathname === "/profile" ? "bg-gray-700 text-amber-300 scale-120" : "bg-white"
                }`} 
                onClick={()=>navigate("/profile")}
            >
                Profile
            </Button>
            <Button className="text-red-500 shadow-xl bg-white hover:bg-red-500 hover:text-white hover:scale-110" onClick={()=>navigate("/logout")}>Logout</Button>
        </div>
    );
};

export default Navbar;
