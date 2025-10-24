import React from 'react';
import { useEffect } from 'react'
import { useAuthFunctions } from '@/store/AuthFunction';
import { useNavigate } from "react-router-dom"


const LogOut=()=>{
   const {logout} = useAuthFunctions()
   const navigate=useNavigate()

   useEffect(()=>{

   // console.log("react trying to render LogOut.jsx");
   
    logout();
    navigate("/login")
   },[])

   return(
    <div>hello
    </div>

   )
}

export default LogOut;