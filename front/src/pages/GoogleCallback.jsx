import React from "react";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios.js"; 
import { useNavigate, useLocation } from "react-router-dom";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);

      window.history.replaceState({}, document.title, "/");

      navigate("/");
    } else {
      navigate("/login");
    }
  }, [location, navigate]);
  
    return <div>Logging in with Google...</div>;
  };
  
  export default GoogleCallback;