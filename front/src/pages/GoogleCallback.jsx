import React from "react";
import { useEffect,useState } from "react";
import { axiosInstance } from "../lib/axios.js"; 
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);

      window.history.replaceState({}, document.title, "/");
      setTimeout(() => {
        setLoading(false);
        navigate("/"); // go to homepage
      }, 400);
    } else {
      navigate("/");
    }
  }, [location, navigate]);
  
    return <div>Logging in with Google...</div>;
  };
  
  export default GoogleCallback;