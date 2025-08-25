import React, { useEffect , useRef , useState } from "react";
import { Button } from "@/components/ui/button";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Loader2 } from "lucide-react";
import { ChatStore } from "@/store/ChatStore";
import { AuthStore, UserId } from "@/store/AuthStore";
import { useChatFunctions } from "@/store/ChatFunctions";


const ChatList = () => {
  
  const { authUser } = useRecoilValue(AuthStore);
  const { messages, isMessagesLoading, selectedUser} = useRecoilValue(ChatStore);
  const { getMessages } = useChatFunctions();
  const messagesEndRef = useRef(null);
  
  
  
  
  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      getMessages(selectedUser._id);
    }

  }, [selectedUser]);

  useEffect(()=>{
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])
  
  
  if(isMessagesLoading){
    return(
      <div className='h-hax flex flex-row justify-center'>
        <Loader2 className="size-15 animate-spin self-center">
          Loading
        </Loader2>
      </div>
    )
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="h-min p-4 text-center text-gray-500">
        No messages yet. Start a conversation!
      </div>
    );
  }

  return (
    <div className="h-min">
      {messages.map((chat, index) => {
        
        if (chat.receiverId == selectedUser._id) {
          return (
            <div key={chat._id} className="pl-[20vw] flex justify-end h-min" >
              <div>
                <Button className="h-max m-2 bg-gray-900 text-white whitespace-normal break-all">
                  {chat.text}
                </Button>
              </div>
            </div>
          );
        }
        if (chat.senderId == selectedUser._id) {
          return (
            <div key={chat._id} className="h-min pr-[20vw] " >
              <Button className="h-max m-2 bg-amber-300 whitespace-normal break-all">
                {chat.text}
              </Button>
            </div>
          );
        }

        return <div key={chat._id}>message is present but not displayed</div>;
      })}
    <div ref={messagesEndRef} ></div>
    </div>
  );
};

export default ChatList;
