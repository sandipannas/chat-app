import React, { useEffect , useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Loader2 } from "lucide-react";
import { ChatStore } from "@/store/ChatStore";
import { AuthStore } from "@/store/AuthStore";


const ChatList = () => {
  console.log("trying to load the messages section")
  const { authUser } = useRecoilValue(AuthStore);
  const { messages, isMessagesLoading} = useRecoilValue(ChatStore);
  const messagesEndRef = useRef(null);
  
  console.log("ChatList Debug:", { 
    messages, 
    messagesLength: messages?.length, 
    authUserId: authUser?._id,
    isMessagesLoading 
  });
  
  useEffect(()=>{
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])
  
  //if messages are loading
  if(isMessagesLoading){
    return(
      <div>
        <Loader2 className="size-15 animate-spin self-center">
          Loading
        </Loader2>
      </div>
    )
  }

  // Handle null or empty messages
  if (!messages || messages.length === 0) {
    return (
      <div className="h-min p-4 text-center text-gray-500">
        No messages yet. Start a conversation!
      </div>
    );
  }

  return (
    <div className="h-min">
      {messages.map((chat) => {

        if (chat.receiverId == authUser._id){
          console.log(chat+" received");
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
        if (chat.senderId == authUser._id) {
          console.log(chat+" sent");
          return (
            <div key={chat._id} className="h-min pr-[20vw] " >
              <Button className="h-max m-2 bg-amber-300 whitespace-normal break-all">
                {chat.text}
              </Button>
            </div>
          );
        }
        
        return null;

      })}
    <div ref={messagesEndRef} ></div>
    </div>
  );
};

export default ChatList;
