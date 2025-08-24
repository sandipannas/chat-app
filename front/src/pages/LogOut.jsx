import React from 'react';
import { useEffect } from 'react'
import { useAuthFunctions } from '@/store/AuthFunction';
import { useNavigate } from "react-router-dom"


const LogOut=()=>{
   const {logout} = useAuthFunctions()
   const navigate=useNavigate()

   useEffect(()=>{
    logout();
    navigate("/login")
   },[])

   return(
    <div>hello
    </div>

   )
}

export default LogOut;