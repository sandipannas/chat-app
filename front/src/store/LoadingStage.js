import { create } from "zustand";

export const useLoadingStage = create((set) => ({
    
    isUpdatingName:false,
    setIsUpdatingName:(value)=>{
        set(()=>({
            isUpdatingName:value
        }))
    },

    isUpdatingPassword:false,
    setIsUpdatingPassword:(value)=>{
        set(()=>({
            isUpdatingPassword:value
        }))
    },

    isSigningUp: false,
    setIsSigningUp:(value)=>{
        set(()=>({
        isSigningUp:value
        }))
    },

    isLogingIn: false,
    setIsLogingIn:(value)=>{
        set(()=>({
        isLogingIn:value
        }))
    },

    isUpdatingProfilePicture: false,
    setIsUpdatingProfilePicture:(value)=>{
        set(()=>({
            isUpdatingProfilePicture:value
        }))
    },

    isCheckingAuth: true,
    setIsCheckingAuth:(value)=>{
        set(()=>({
            isCheckingAuth:value
        }))
    },

    isUsersLoading:true,
    setIsUsersLoading:(value)=>{
        set(()=>({
            isUsersLoading:value
        }))
    },
    
    isMessagesLoading:false,
    setIsMessagesLoading:(value)=>{
        set(()=>({
            isMessagesLoading:value
        }))
    },
    
    isSendingMessage:false,
    setIsSendingMessage:(value)=>{
        set(()=>({
            isSendingMessage:value
        }))
    },

}))