import React, { useEffect,useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SingUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import ProfilePage from "./pages/ProfilePage";
import LogOut from "./pages/LogOut";
import { AuthStore} from "./store/AuthStore";
import { useAuthFunctions } from "./store/AuthFunction";
import { useRecoilState } from "recoil";
import { Toaster } from "react-hot-toast";
import {Loader2} from "lucide-react"
import Navbar from "./components/functional/Navbar";


const App = () => {

  const {checkAuth} = useAuthFunctions();
  const [{ authUser, isCheckingAuth } , setUser] = useRecoilState(AuthStore);

   
  //at the start of the app check if the user is authenticated
  useEffect(() => {
    checkAuth();
  },[]); // Remove authUser dependency to prevent infinite loops

  if (isCheckingAuth && !authUser) {
    return (<div className="h-100 flex flex-row justify-center">
    <Loader2 className="size-15 animate-spin self-center">
      Loading
    </Loader2>
  </div>)
  }


  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SingUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LogInPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/logout"
          element={authUser ? <LogOut /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};
export default App;
