//logical imports
import {create} from "zustand";
import io from "socket.io-client";
import {axiosInstance} from "../lib/axios";

//ui imports
import toast from "react-hot-toast";

//store imports
import { useAuthStore } from "./AuthStore";
import {useLoadingStage} from "./LoadingStage";

//env variables
const SETUP = import.meta.env.VITE_SETUP;
const BASE_URL =
  SETUP == "DEVELOPMENT"
    ? import.meta.env.VITE_BASE_URL_LOCAL
    : import.meta.env.VITE_BASE_URL_PUBLIC;



export const useChatStore = create((set,get) => ({

  socket:null,
  setSocket:(socket)=>set({socket}),
  connectSocket:async()=>{
    
    const authUser = useAuthStore.getState().authUser;

    if(authUser?._id){

      //console.log("---->user is already logged in");

      if (!get().socket) {
        //console.log("---->socket is not present");
        //console.log("---->trying to create socket");
  
        const connectedSocket= io(BASE_URL, {
          transports: ["websocket"],
          upgrade: false,
          query: { userId: authUser._id },
        });

        //console.log("does the socket going with id",authUser._id);
        set({socket:connectedSocket});

      } else {
        //console.log("---->socket is already present ");
      }
  }else{
    //console.log("---->user is not logged in so the socket is not created");
  }
  },
  disconnectSocket:async()=>{
    const socket = get().socket;
    if(socket){
      //console.log("disconnecting socket");
      socket.off("getOnlineUsers");
      socket.disconnect();
      set({socket:null});
      set({onlineUsers:null});
    }
  },

  people:null,
  setPeople:(people)=>set({people}),
  getPeople:async()=>{

    const setIsUsersLoading = useLoadingStage.getState().setIsUsersLoading;

    setIsUsersLoading(true);

    try {
      //console.log("fetching all users...");
      const res = await axiosInstance.get("/auth/getAllUsers");

      if (res.data) {
        //console.log("all users fetched successfully");
        set({people:res.data});
      } else {
        toast.error("error occured while fetching users");
      }
    } 
    catch (error) {
      //console.log("error occured while fetching users", error);
      toast.error("Error occured while fetching users");
    }
    finally{
      setIsUsersLoading(false);
    }
  },

  onlineUsers:null,
  setOnlineUsers:(onlineUsers)=>set({onlineUsers}),
  getOnlineUsers:async()=>{
    const socket = get().socket;
    if(socket){
      //console.log("getting online users");
      socket.on("getOnlineUsers",(userIds)=>{
        //console.log("online users fetched successfully");
        set({onlineUsers:userIds});
      });
    }
  },
  
  selectedUser:null,
  setSelectedUser:(selectedUser)=>set({selectedUser}),

  messages:null,
  setMessages:(messages)=>set({messages}),
  appendMessage:(message)=>{
    const current = get().messages || []
    if(current.length>0 && current[current.length-1]._id == message._id){
      //console.log("message already exists");
    }
    else{
      set({messages:[...current,message]})
    }
  },
  sendMessage: async (messageToSend) => {

    const appendMessage = get().appendMessage;

    try {
      //console.log("trying to send message");
      const res = await axiosInstance.post(
        "message/sendMessage",
        messageToSend
      );
      
      appendMessage(messageToSend);

      toast.success("sent");
      //console.log("message sent successfully");
    } catch (error) {
      //console.log("error occured while sending message", error);
      toast.error("Error occured while sending message");
    }
  },
  getMessages:async(otherUserId)=>{

    const setIsMessagesLoading = useLoadingStage.getState().setIsMessagesLoading;
    get().setMessages(null);
    setIsMessagesLoading(true);

    try {
      //console.log("fetching messages...");
      //console.log("Debug - otherUserId:", otherUserId);
      const res = await axiosInstance.get(
        `message/getMessages?otherUserId=${otherUserId}`
      );
    
      get().setMessages(res.data);
      //console.log("messages fetched successfully");

    } catch (error) {
      //console.log("error occured while fetching messages", error);
      toast.error("error ocurred while fetching messages");
    }
    finally{
      setIsMessagesLoading(false);
    }
    
  },
  getNewMessages:async()=>{
    const socket = get().socket;
    const selectedUser = get().selectedUser;
    if (socket && selectedUser) {
      //console.log("getting new messages");

      socket.on("newMessage", (newMessage) => {
        //console.log("new message fetched successfully",newMessage);
        get().appendMessage(newMessage);
      });

    }
    else{
      //console.log("socket or selectedUser is not present");
    }
  
  }

  
}));

