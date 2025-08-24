import {
  atom
} from "recoil";

export const ChatStore = atom({
  key: "ChatStore",
  default: {
    people: null,
    onlineUsers: null,
    selectedUser: null,
    messages: null,
    isUsersLoading: true,
    isMessagesLoading: false,
    isSendingMessage: false,
  },
});


