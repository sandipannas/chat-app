//logical imports
import React, { useEffect, useState } from "react";

//store imports
import { useAuthStore } from "../store/AuthStore";
import { useChatStore } from "../store/ChatStore";

//pages imports
import ChatList from "@/components/functional/ChatList";
import UserList from "@/components/functional/UserList";

//ui imports
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Squares from "../blocks/Backgrounds/Squares/Squares";


const HomePage = () => {

  const authUser = useAuthStore((state) => state.authUser);
  const socket = useChatStore((state) => state.socket);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const setMessages = useChatStore((state) => state.setMessages);


  const sendMessage = useChatStore((state) => state.sendMessage);

  const [messageToSend, setMessageToSend] = useState({
    text: "",
    image: "",
  });

  const handleSend = () => {
    if (!socket) {
      toast.error("Socket not connected");
    }
    if (!selectedUser) {
      toast.error("Please select a user");
    }
    if (messageToSend.text.trim() == "" && messageToSend.image.trim() == "") {
      toast.error("Message can't be empty");
    } else {
      sendMessage({
        receiverId: selectedUser._id,
        text: messageToSend.text,
        image: messageToSend.image,
      });
    }

    setMessageToSend({
      text: "",
      image: "",
    });
  };

  useEffect(() => {
    //console.log("react trying to render HomePage.jsx");
  }, []);

  if(!authUser?._id){
    return <div>loading</div>;
  }

  return (
    <div className="relative">
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
      <div className="grid grid-cols-1 z-10 relative lg:h-auto lg:w-auto lg:grid lg:grid-cols-[3fr_5fr] lg:gap-5">
        <Card
          className={`${
            selectedUser ? "hidden" : ""
          }  lg:block mt-18 ml-3 mr-3 h-[88vh]  lg:relative lg:mt-18.5 lg:ml-5 z-3 backdrop-blur-sm`}
        >
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>People</CardDescription>
          </CardHeader>
          <CardContent className="h-max lg:h-[74vh] lg:mt-5 overflow-y-auto scrollbar-hide">
            <UserList></UserList>
          </CardContent>
        </Card>

        <Card
          className={`${
            selectedUser ? "" : "hidden"
          } lg:block mt-18 ml-3 mr-3 h-[88vh] lg-relative lg:h-[88vh] lg:mt-18.5 lg:mr-5 lg:z-3 backdrop-blur-sm`}
        >
          {!selectedUser ? (
            <div></div>
          ) : (
            <>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>{selectedUser.fullName}</CardTitle>
                <CardDescription></CardDescription>
                <Button
                  className="self-end bg-red-500 hover:bg-red-700 text-white"
                  onClick={() =>{
                    setSelectedUser(null)
                    setMessages(null)
                  }}
                >
                  X
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 overflow-y-auto scrollbar-hide h-[70vh] gap-5">
                <ChatList></ChatList>
              </CardContent>
              <CardFooter>
                <div className="w-full grid grid-cols-[6fr_1fr] gap-3">
                  <Input
                    type="text"
                    value={messageToSend.text}
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
