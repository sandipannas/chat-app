import React, { useEffect,useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
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


const App = () => {
  window.WebSocket = window.WebSocket || globalThis.WebSocket;
  const {checkAuth} = useAuthFunctions();
  const [{ authUser, isCheckingAuth },setUser] = useRecoilState(AuthStore);
  const [socket, setSocket] = useState(null);

   // only on mount/unmount
  
  useEffect(() => {
    checkAuth();
    console.log("useEffect running, authUser:", authUser);
  
    if (authUser && socket && !socket.connected) {
      console.log("connecting socket...");
      socket.connect();
      setUser(currentUser => ({
        ...currentUser,
        socket,
      }));
    }
  
  
  }, [authUser, socket, setUser]);

  if (isCheckingAuth && !authUser) {
    return (<div className="h-100 flex flex-row justify-center">
    <Loader2 className="size-15 animate-spin self-center">
      Loading
    </Loader2>
  </div>)
  }


  return (
    <div>
      <Navbar />
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
