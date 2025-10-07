import React from "react";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios.js"; 
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
  
      if (token) {
        localStorage.setItem("jwt", token);

        navigate("/");
      }
    }, []);
  
    return <div>Logging in with Google...</div>;
  };
  
  export default GoogleCallback;