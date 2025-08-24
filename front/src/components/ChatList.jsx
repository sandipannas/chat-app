import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Loader2 } from "lucide-react";
import { ChatStore, useGetUsers } from "../store/ChatStore";
import { UserId } from "../store/AuthStore";

const ChatList = () => {
  const { selectedUser, messages, onlineUsers } = useRecoilValue(ChatStore);
  const userId = useRecoilValue(UserId);
  //console.log(messages)
  //console.log(userId)
  return (
    <div className="h-min">
      {messages.map((obb) => {
        if (obb.receiverId == selectedUser._id && obb.senderId == userId) {
          return (
            <div className="pl-[20vw] flex justify-end h-min" >
              <div>
                <Button className="h-max m-2 bg-gray-900 text-white whitespace-normal break-all">
                  {obb.text}
                </Button>
              </div>
            </div>
          );
        }
        if (obb.senderId == selectedUser._id && obb.receiverId == userId) {
          return (
            <div className="h-min pr-[20vw] " >
              <Button className="h-max m-2 bg-amber-300 whitespace-normal break-all">
                {obb.text}
              </Button>
            </div>
          );
        } else {
          return <></>;
        }
      })}
    </div>
  );
};

export default ChatList;
