import { axiosInstance } from "@/lib/axios";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import toast from "react-hot-toast";
import { ChatStore } from "./ChatStore";

export const useChatFunctions = () => {
  const setChat = useSetRecoilState(ChatStore);

  const getUsers = useCallback(async () => {
    setChat((currentChat) => ({
      ...currentChat,
      isUsersLoading: true,
    }));

    try {
      console.log("fetching users...");
      const res = await axiosInstance.get("/auth/getAllUsers");

      if (res.data) {
        console.log("users fetched successfully");
        setChat((currentChat) => ({
          ...currentChat,
          people: res.data,
        }));
      } else {
        toast.error("error occured while fetching users");
      }
    } catch (error) {
      console.log("error occured while fetching users", error);
      toast.error("Error occured while fetching users");
    }
    setChat((currentChat) => ({
      ...currentChat,
      isUsersLoading: false,
    }));
  }, []);

  const getMessages = useCallback(async (otherUserId) => {
    setChat((currentChat) => ({
      ...currentChat,
      isMessagesLoading: true,
    }));

    try {
      console.log("fetching messages...");
      console.log("Debug - otherUserId:", otherUserId);
      const res = await axiosInstance.get(
        `message/getMessages?otherUserId=${otherUserId}`
      );
      console.log("Debug - messages response:", res.data);

      setChat((currentChat) => ({
        ...currentChat,
        messages: res.data,
      }));
      console.log("messages fetched successfully");
    } catch (error) {
      console.log("error occured while fetching messages", error);
      toast.error("error ocurred while fetching messages");
    }
    setChat((currentChat) => ({
      ...currentChat,
      isMessagesLoading: false,
    }));
  }, []);

  const sendMessage = useCallback(async (messageToSend) => {
    setChat((currentChat) => ({
      ...currentChat,
      isSendingMessage: true,
    }));

    try {
      console.log("trying to send message");
      const res = await axiosInstance.post(
        "message/sendMessage",
        messageToSend
      );

      setChat((currentChat) => ({
        ...currentChat,
        messages: [...currentChat.messages, messageToSend],
      }));

      toast.success("sent");
      console.log("message sent successfully");
    } catch (error) {
      console.log("error occured while sending message", error);
      toast.error("Error occured while sending message");
    }

    setChat((currentChat) => ({
      ...currentChat,
      isSendingMessage: false,
    }));
  }, []);

  return {
    getUsers,
    getMessages,
    sendMessage,
  };
};
