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

  //function to connect socket
  connectSocket:async()=>{
    
    const authUser = useAuthStore.getState().authUser;

    if(authUser?._id){
      //user is already logged in

      if (!get().socket) { //does the user already have a socket connection
        //socket is not present and we will try to create a socket connection
  
        const connectedSocket= io(BASE_URL, {
          transports: ["websocket"],
          upgrade: false,
          query: { userId: authUser._id },
        });

        set({socket:connectedSocket}); //set the socket int the store

      }
    }
  },

  //function to disconnect socket
  disconnectSocket:async()=>{
    const socket = get().socket;

    if(socket){  // if there is a socket connection then disconnect it
      socket.off("getOnlineUsers");
      socket.off("newMessage");
      socket.disconnect();
      set({socket:null});
      set({onlineUsers:null});
    }
  },


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  people:null,
  setPeople:(people)=>set({people}),

  //function to get all users that are registered in the app
  getPeople:async()=>{

    const setIsUsersLoading = useLoadingStage.getState().setIsUsersLoading;
    setIsUsersLoading(true); //loading till we fetch the users from the backend

    try {
      const res = await axiosInstance.get("/auth/getAllUsers");

      if (res.data) { // if data is fetched or not
        set({people:res.data});
      } else {
        toast.error("error occured while fetching users");
      }
    } 
    catch (error) {
      //error occured while fetching users
      toast.error("Error occured while fetching users");
    }
    finally{
      setIsUsersLoading(false);
    }
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onlineUsers:null,
  setOnlineUsers:(onlineUsers)=>set({onlineUsers}),

  //function to get all online users that are currently connected to the socket
  getOnlineUsers:async()=>{
    const socket = get().socket; //get freshly created socket from the store
    if(socket){
      socket.off("getOnlineUsers");
      socket.on("getOnlineUsers",(userIds)=>{ //getting online users
        //it will return an array but we have to use the array in a function
        set({onlineUsers:userIds});
      });
    }
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  selectedUser:null,
  setSelectedUser:(selectedUser)=>set({selectedUser}),

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  messages:null,
  setMessages:(messages)=>set({messages}),

  appendMessage:(message)=>{
    const current = get().messages || []
      set({messages:[...current,message]})
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
      const res = await axiosInstance.get(
        `message/getMessages?otherUserId=${otherUserId}`
      );
    
      get().setMessages(res.data);

    } catch (error) {
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

      socket.off("newMessage");
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

