import React ,{useEffect }from "react";
import { useRecoilState } from "recoil";
import { useChatFunctions } from "@/store/ChatFunctions";
import { ChatStore } from "@/store/ChatStore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const UserList = () => {
    const [{people , isUsersLoading} , setChat] = useRecoilState(ChatStore);
    const { getUsers , getMessages } = useChatFunctions();
    useEffect(()=>{
        console.log("useEffect running");
        if(people == null){
         getUsers();   
        }
        //if(selectedUser && messages == null){
        //    getMessages(selectedUser._id);
        //}

        return ()=>{
         setChat({
            selectedUser:null,
            messages:null,
            isUsersLoading:true,
         });   
        }
    },[])


    if(isUsersLoading){
        return(
            <div>
                <Loader2 className="size-15 animate-spin self-center">
                    Loading
                </Loader2>
            </div>
        )
    }

    return (
        <div className="flex flex-col content-start overflow-y-auto gap-3">
            {people && people.map((user)=>{
                return(
                    <Button className="w-full h-15 bg-black/80 text-amber-300 backdrop-blur-sm" key={user._id}
                    onClick={()=>{
                        setChat((currentChat)=>({
                            ...currentChat,
                            selectedUser:user,
                        }))
                        getMessages(user._id);
                    }}>
                        {user.fullName}
                      </Button>
                )
            })}
        </div>
    );
};

export default UserList;
