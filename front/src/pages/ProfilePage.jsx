//logical imports
import React,{useRef,useState,useEffect} from "react";

//store
import { useAuthStore } from "@/store/AuthStore";
import { useAuthFunctions } from "../store/AuthFunction";
import {useLoadingStage} from "../store/LoadingStage";

//page components
import UpdateName from "../components/functional/UpdateName";
import UpdatePassword from "../components/functional/UpdatePassword";

//ui components
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import uploadPic from "../assets/uploadPic.png"
import { Button } from "@/components/ui/button";
import Squares from "../blocks/Backgrounds/Squares/Squares";



const ProfilePage = () => {

  const [uploadedImage , setUploadedImage]  = useState(null);

  const fileInputRef = useRef(null);
  const authUser = useAuthStore((state) => state.authUser);

  const isUpdatingName= useLoadingStage((state)=>state.isUpdatingName);
  const setIsUpdatingName= useLoadingStage((state)=>state.setIsUpdatingName);

  const isUpdatingPassword= useLoadingStage((state)=>state.isUpdatingPassword);
  const setIsUpdatingPassword= useLoadingStage((state)=>state.setIsUpdatingPassword);

  const isUpdatingProfilePicture = useLoadingStage((state)=>state.isUpdatingProfilePicture);
  const setIsUpdatingProfilePicture = useLoadingStage((state)=>state.setIsUpdatingProfilePicture);

  const {updateProfilePicture} = useAuthFunctions();

  const handelFileChange = (e) => {
    setIsUpdatingProfilePicture(true);
    const file = e.target.files[0];
    if(file){
      setUploadedImage(file);
      handelFileUpload(file);
    }
  };

  const handelFileUpload = (file) => {
    if(file){
      const formData = new FormData();
      formData.append("profilePicture",file);
      updateProfilePicture(formData);
    }
    setIsUpdatingProfilePicture(false);
  }

  useEffect(()=>{

    //console.log("react trying to render ProfilePage.jsx");
    
  },[])

 

  return (
    <div className="h-screen flex justify-center relative">
      <div
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          zIndex: 0,
        }}
      >
        <Squares
          speed={0.3}
          squareSize={40}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="#E0E0E0"
          hoverFillColor="#B2BEB5"
        />
      </div>
      {isUpdatingName ? <UpdateName/> : <></>}
      {isUpdatingPassword ? <UpdatePassword/> : <></>}
      <Card className="w-full max-w-sm self-center z-1 text-gray-700 backdrop-blur-sm backdrop-opacity-70 ">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription></CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              {isUpdatingProfilePicture ? <Loader2 className="animate-spin" /> : 
              <Button
                className=" h-50 w-full border self-center border-black hover:scale-105"
                style={{
                  backgroundImage:`${(authUser && authUser.profilePicture!="")?`url(${authUser.profilePicture})`:``}`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center", 
                  backgroundSize: "cover",
                }}
                onClick={(e)=>{
                  e.preventDefault();
                  fileInputRef.current.click();
                }}
              >
                {(authUser.profilePicture=="")?"Upload Profile Picture":""}
              </Button>
              }

              <input type="file" accept="image/*" ref={fileInputRef} onChange={handelFileChange} style={{display:"none"}}/>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="grid grid-cols-[2fr_1fr] gap-3">
                    <Button >{authUser.fullName}</Button>
                    <Button 
                    onClick={(e)=>{
                      e.preventDefault();
                      setIsUpdatingName(true);
                    }}
                    >Update</Button>
                    </div>
                    <Label htmlFor="email">Email</Label>
                    <Button >{authUser.email}</Button>
                    <Label htmlFor="password">Password</Label>
                    <Button 
                    onClick={(e)=>{
                      e.preventDefault();
                      setIsUpdatingPassword(true);
                    }}
                    >Update Password</Button>
                  </div>
                </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
