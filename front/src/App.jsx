//logical imports
import React, { useEffect , useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

//page components
import LogOut from "./pages/LogOut";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import SingUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import GoogleCallback from "./pages/GoogleCallback";
import Navbar from "./components/functional/Navbar";

//store
import { useChatStore } from "./store/ChatStore";
import { useAuthStore } from "./store/AuthStore";
import { useLoadingStage } from "./store/LoadingStage";
import { useAuthFunctions } from "./store/AuthFunction";

//ui components
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import loading_cat from "./assets/loading_cat.gif";



const App = () => {
  const { checkAuth } = useAuthFunctions();

  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useLoadingStage((state) => state.isCheckingAuth);

  const connectSocket = useChatStore((state) => state.connectSocket);
  const disconnectSocket = useChatStore((state) => state.disconnectSocket);
  const getOnlineUsers = useChatStore((state) => state.getOnlineUsers);



  useEffect(() => {

  //console.log("react trying to render App.jsx");
  //console.log("checking if the user is already logged in");

    if(authUser?._id){
      connectSocket();
      getOnlineUsers();
    }
    else{
      //console.log("user is not logged in");
      checkAuth();
    }
    return () => {
      disconnectSocket();
    };
  }, [authUser]);

  if (isCheckingAuth && !authUser?._id) {
    return (
      <div className="bg-[#fdfdfd] flex flex-col lg:flex lg:flex-row ">
        <div className="h-[50vh] flex flex-col justify-center items-center lg:flex lg:flex-row lg:justify-center lg:w-full  lg:h-screen">
          <Loader2 className="size-25 animate-spin self-center">
            Loading
          </Loader2>
        </div>
        <div className=" lg:bg-[#fdfdfd] lg:h-screen lg:w-screen lg:flex lg:flex-row lg:justify-end">
          <img src={loading_cat} alt="a cute loading cat" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar></Navbar>

      <Routes>
        <Route path="/google/callback" element={<GoogleCallback />} />
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
