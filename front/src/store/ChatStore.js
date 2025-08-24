import { axiosInstance } from "@/lib/axios";
import { useCallback } from "react";
import { atom, useSetRecoilState, useRecoilValue , useRecoilState} from "recoil";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthStore } from "./AuthStore";

export const ChatStore=atom({
    key:"ChatStore",
    default:{
        people:[],
        onlineUsers:[],
        selectedUser:null,
        messages:[],
        isUsersLoading:true,
        isMessagesLoading:false,
        isSendingMessage:false
    }
})


export const useGetUsers = () => {
    const setChat=useSetRecoilState(ChatStore);
    
    const getUsers = useCallback(async()=>{
        setChat(currentChat=>({
            ...currentChat,
            isUsersLoading:true
    }))

    try{
        const res = await axiosInstance.get("/auth/getAllUsers");
        if(res.status==200){
            setChat(currentChat=>({
                ...currentChat,
                people:res.data
            }))
        }
        else{
              toast.error("error occured");
        }
    }
    catch(error){
       // toast.error("Error occured while fetching Users")
    }
    setChat(currentChat=>({
        ...currentChat,
        isUsersLoading:false
    }))


    })
    
    
    return getUsers;
}


 export const useGetMessages=()=>{
     const setChat=useSetRecoilState(ChatStore)
     const { authUser } = useRecoilValue(AuthStore);
     const getMessages=useCallback(async()=>{
         setChat(currentChat=>({
             ...currentChat,
             isMessagesLoading:true
         }))
         try{
           const res = await axiosInstance.get(`message/getMessages`)
           
           
           setChat(currentChat=>({
            ...currentChat,
            messages:res.data
           }))
         }
         catch(error){
                //toast.error("error ocurred while fetching messages")
         }
         setChat(currentChat=>({
            ...currentChat,
            isMessagesLoading:false
            
         }))
     })

     return getMessages;
 }



 export const useSendMessage=()=>{
     const [chat,setChat]=useRecoilState(ChatStore)
     const sendMessage=useCallback(async(messageToSend)=>{
         setChat(currentChat=>({
             ...currentChat,
             isSendingMessage:true
         }))
         try{
            console.log(messageToSend)
           const res = await axiosInstance.post('message/sendMessage',messageToSend);
           setChat(currentChat=>({
            ...currentChat,
            messages:[...currentChat.messages,messageToSend]
         }))
           toast.success("")
         }
         catch(error){
            toast.error("Error occured while sending message")
         }
         setChat(currentChat=>({
            ...currentChat,
            isSendingMessage:false
        }))  
     })

     return sendMessage;
 }
