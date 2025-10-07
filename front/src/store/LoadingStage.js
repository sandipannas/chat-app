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
    }
}))