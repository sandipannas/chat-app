import React from "react";
import { useEffect,useState } from "react";
import { axiosInstance } from "../lib/axios.js"; 
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        // try localStorage first
        localStorage.setItem("jwt", token);
        console.log("Stored token in localStorage");
      } catch (e) {
        // fallback for Safari
        sessionStorage.setItem("jwt", token);
        console.log("Stored token in sessionStorage (Safari fallback)");
      }
  
      // replace state to remove token from URL
      window.history.replaceState({}, document.title, "/");
  
      // force reload to re-init app with token
      window.location.reload();
    } else {
      navigate("/");
    }
  }, [location, navigate]);
  
    return <div>Logging in with Google...</div>;
  };
  
  export default GoogleCallback;