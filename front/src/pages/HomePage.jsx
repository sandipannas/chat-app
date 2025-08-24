import React, { useEffect, useState } from "react";
import Squares from "../blocks/Backgrounds/Squares/Squares";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { Loader2 } from "lucide-react";
import { ChatStore } from "../store/ChatStore";
import ChatList from "@/components/functional/ChatList";
import UserList from "@/components/functional/UserList";
import { AuthStore } from "@/store/AuthStore";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useChatFunctions } from "../store/ChatFunctions.js";
const SETUP = import.meta.env.VITE_SETUP;
const BASE_URL = SETUP=="DEVELOPMENT"?import.meta.env.VITE_BASE_URL_LOCAL:import.meta.env.VITE_BASE_URL_PUBLIC;

const HomePage = () => {
  const { people, isUsersLoading, selectedUser, onlineUsers } =
    useRecoilValue(ChatStore);
  const [{ authUser }, setUser] = useRecoilState(AuthStore);
  const setChat = useSetRecoilState(ChatStore);
  const [socket, setSocket] = useState(null);
  const [messageToSend, setMessageToSend] = useState({
    text: "",
    image: "",
  });

  const {sendMessage , getMessages , getUsers } = useChatFunctions();

  const handleSend = () => {
    if (messageToSend.text.trim() == "" && messageToSend.image.trim() == "") {
      toast.error("Message can't be empty");
    } else {
      sendMessage({
        receiverId: selectedUser._id,
        text: messageToSend.text,
        image: messageToSend.image,
      });
    }
  };

  
  useEffect(() => {
    if (!authUser?._id) return;
    
    console.log("creating socket...");
    const newSocket = io(BASE_URL, {
      transports: ["websocket"],
      upgrade: false,
      query: { userId: authUser._id },
    });
    
    setSocket(newSocket);

    console.log("useEffect running, authUser:", authUser);

    if (authUser && socket && !socket.connected) {
      console.log("connecting socket...");
      socket.connect();
      setUser((currentUser) => ({
        ...currentUser,
        socket,
      }));
    }

    return () => {
      console.log("cleaning up socket...");
      newSocket.disconnect();
    };
  }, []);


  if (socket) {
    socket.on("getOnlineUsers", (userIds) => {
      setChat((currentChat) => ({
        ...currentChat,
        onlineUsers: userIds,
      }));
    });
    console.log(onlineUsers);
  }

  if (socket && selectedUser) {
    socket.on("newMessage", (newMessage) => {
      setChat((currentChat) => {
        const exists = currentChat.messages.some(
          (msg) => msg._id === newMessage._id
        );
        if (exists) {
          return currentChat;
        }

        return {
          ...currentChat,
          messages: [...currentChat.messages, newMessage],
        };
      });
    });
  }

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          zIndex: 0,
        }}
      >
        <Squares
          speed={0.2}
          squareSize={50}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="#E0E0E0"
          hoverFillColor="#B2BEB5"
        />
      </div>
      <div className="grid grid-cols-[3fr_5fr] gap-5">
        <Card className="h-[88vh] mt-18.5 ml-5 z-3 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>People</CardDescription>
          </CardHeader>
          <CardContent className="h-max overflow-y-auto" >
            <UserList></UserList>
          </CardContent>
        </Card>

        <Card className="h-[88vh] mt-18.5 mr-5 z-3 backdrop-blur-sm">
          {!selectedUser ? (
            <div></div>
          ) : (
            <>
              <CardHeader>
                <CardTitle>{selectedUser.fullName}</CardTitle>
                <CardDescription>{selectedUser.email}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 overflow-y-auto h-[70vh] gap-5">
                <ChatList></ChatList>
              </CardContent>
              <CardFooter>
                <div className="w-full grid grid-cols-[6fr_1fr] gap-3">
                  <Input
                    type="text"
                    className="direction:rtl text-right text-aling"
                    onChange={(e) => {
                      setMessageToSend({
                        text: e.target.value,
                        image: "",
                      });
                    }}
                  ></Input>
                  <Button
                    className="w-full shadow-md shadow-outline hover:rounded-md hover:border-green-500 hover:border"
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
