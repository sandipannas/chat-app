//logical imports
import React, { useEffect , useRef } from "react";

//store imports
import { useChatStore } from "@/store/ChatStore";
import { useLoadingStage } from "@/store/LoadingStage";

//ui imports
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";


const ChatList = () => {
  

  const getMessages = useChatStore((state)=>state.getMessages);
  const getNewMessages = useChatStore((state)=>state.getNewMessages);

  const messages = useChatStore((state)=>state.messages);
  const selectedUser = useChatStore((state)=>state.selectedUser);
  const isMessagesLoading = useLoadingStage((state)=>state.isMessagesLoading);
  
  const messagesEndRef = useRef(null);
  
  
  
  
  useEffect(() => {

    //console.log("react trying to render ChatList.jsx");
    
    if (selectedUser && selectedUser._id) {
      getMessages(selectedUser._id);
      getNewMessages();
    }
    

  }, [selectedUser]);

  useEffect(()=>{
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser])
  
  
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
