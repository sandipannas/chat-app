//logical imports
import React ,{useEffect }from "react";

//store imports
import { useChatStore } from "@/store/ChatStore";
import { useAuthStore } from "@/store/AuthStore";
import { useLoadingStage } from "@/store/LoadingStage";

//ui imports
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserList = () => {

    const authUser = useAuthStore((state)=>state.authUser);
   
    const people = useChatStore((state)=>state.people);
    const setPeople = useChatStore((state)=>state.setPeople);
    const getPeople = useChatStore((state)=>state.getPeople);

    const messages = useChatStore((state)=>state.messages);

    const isUsersLoading = useLoadingStage((state)=>state.isUsersLoading);
    const setIsUsersLoading = useLoadingStage((state)=>state.setIsUsersLoading);

    const selectedUser = useChatStore((state)=>state.selectedUser);
    const setSelectedUser = useChatStore((state)=>state.setSelectedUser);

    const onlineUsers = useChatStore((state)=>state.onlineUsers);

    const getMessages = useChatStore((state)=>state.getMessages);



    useEffect(() => {

       // console.log("react trying to render UserList.jsx");
       
        if(!authUser?._id){
            return;
        }
        if (!people || people.length == null) {
            getPeople();
        }
        if (selectedUser?._id && messages == null) {
            getMessages(selectedUser._id);
        }
    }, [people,onlineUsers,authUser])


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
            {Array.isArray(people) && people.length > 0 ? 
            
            people.map((user) => {
                const isSelected = selectedUser?._id === user._id; //returns yes or no
                const isOnline = onlineUsers?.includes(user._id); //return yes or no
                
                return (
                    <Button 
                        key={user._id}
                        className={`w-full h-15 ${isSelected ? 'bg-black/80 text-amber-300' : 'bg-gray-300 text-black'} ${isOnline ? 'border-r-15 border-green-500' : 'border-r-15 border-amber-300'}`}
                        onClick={() => {
                            if (!isSelected) {
                                setSelectedUser(user);
                                getMessages(user._id);
                            }
                        }}
                    >
                        {user.fullName}
                    </Button>
                );
            }) 
            : 
            (
                <div className="text-center p-4 text-gray-500">
                    {isUsersLoading ? 'Loading users...' : 'No users found'}
                </div>
            )}
        </div>
    );
};

export default UserList;
