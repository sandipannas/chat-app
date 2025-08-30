import React ,{useEffect }from "react";
import { useRecoilState , useRecoilValue } from "recoil";
import { useChatFunctions } from "@/store/ChatFunctions";
import { ChatStore } from "@/store/ChatStore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
    const [{people , isUsersLoading , selectedUser} , setChat] = useRecoilState(ChatStore);
    const { getUsers , getMessages } = useChatFunctions();
    const {onlineUsers} = useRecoilValue(ChatStore);
    const navigate = useNavigate();

    useEffect(()=>{
        console.log("useEffect running");
        if(people == null){
         getUsers();   
        }
        if(selectedUser && messages == null){
            getMessages(selectedUser._id);
        }

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
        <div className="flex flex-col content-start overflow-y-auto gap-3 scrollbar-hide">
            {people && people.map((user)=>{



                if(selectedUser && selectedUser._id==user._id){
                    return(
                        <Button className={`w-full h-15 bg-black/80 text-amber-300 scale-97 ${onlineUsers && onlineUsers.includes(user._id) ? "border-r-15 border-green-500" : "border-r-15 border-amber-300"}`} key={user._id}>{user.fullName}</Button>
                    )
                }
                

                

                return(<>
                    <Button className={`w-full h-15 bg-gray-300 text-black backdrop-blur-sm ${onlineUsers && onlineUsers.includes(user._id) ? "border-r-15 border-green-500" : "border-r-15 border-amber-300"}`} key={user._id}
                    onClick={()=>{
                        setChat((currentChat)=>({
                            ...currentChat,
                            selectedUser:user,
                        }))
                        getMessages(user._id);
                    }}>
                        {user.fullName}
                      </Button>
                </>)
            })}
        </div>
    );
};

export default UserList;
