import React,{ useState } from "react";
import Squares from "../blocks/Backgrounds/Squares/Squares";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRecoilValue } from "recoil";
import { AuthStore} from "@/store/AuthStore";
import { useAuthFunctions } from "@/store/AuthFunction";
import { LuEye , LuEyeClosed } from "react-icons/lu";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { updateName,updatePassword }=useAuthFunctions()
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    newFullName: "",
    oldPassword: "",
    newPassword: ""
  });

  const validateFormData = (name) => {
    if (name) {
      if (formData.newFullName.trim() == "") {
        toast.error("Name Required");
        return false;
      }
    } else {
      if (
        formData.oldPassword.trim() == "" ||
        formData.newPassword.trim() == ""
      ) {
        toast.error("Both Old and New password required");
        return false;
      }
    }
    return true;
  };

  const handelSubmit = (name, e) => {
    e.preventDefault();
    if (validateFormData(name)) {
      if (name) {
        updateName(formData);
        setIsNameDialogOpen(false);
        setFormData({
          newFullName: "",
          oldPassword: "",
          newPassword: ""
        })
      } else {
        updatePassword(formData);
        setIsPasswordDialogOpen(false);
        setFormData({
          newFullName: "",
          oldPassword: "",
          newPassword: ""
        })
      }
    }
  };

  const { authUser } = useRecoilValue(AuthStore);

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
      <Card className="w-full max-w-sm self-center z-1 text-gray-700 backdrop-blur-sm backdrop-opacity-70 ">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription></CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <Dialog open={isNameDialogOpen}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="grid grid-cols-[2fr_1fr] gap-3">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="w-full shadow-outline shadow-md hover:rounded-md hover:border-green-500 hover:border"
                    >
                      {authUser.fullName}
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsNameDialogOpen(true);
                      }}
                      className="shadow-md shadow-outline hover:rounded-md hover:border-red-500 hover:border"
                    >
                      Update
                    </Button>

                    <DialogContent className="sm:max-w-[425px] text-gray-700 backdrop-blur-sm bg-white">
                      <DialogHeader>
                        <DialogTitle>Update Name</DialogTitle>
                        <DialogDescription>
                          Enter your name to Update.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="newFullName">Name</Label>
                          <Input
                            type="text"
                            onChange={(e) =>
                              setFormData((currentData) => ({
                                ...currentData,
                                newFullName: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter className='flex flex-row justify-end'>
                        
                          <Button variant="outline"
                          onClick={(e)=>{
                            e.preventDefault();
                            setIsNameDialogOpen(false)}
                            }>Cancel</Button>
              
                        <DialogClose>
                          <Button
                            type="submit"
                            className="shadow-lg shadow-outline"
                            onClick={(e) => {
                              handelSubmit(true, e);
                            }}
                          >
                            Save changes
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </div>
                </div>
              </Dialog>
              <Dialog open={isPasswordDialogOpen}>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>

                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="w-full shadow-outline shadow-md hover:rounded-md hover:border-green-500 hover:border"
                  >
                    {authUser.email}
                  </Button>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <div>
                  
                      <Button
                        variant="outline"
                        onClick={(e)=>{
                          e.preventDefault();
                          setIsPasswordDialogOpen(true)}}
                        className="w-full shadow-md shadow-outline hover:rounded-md hover:border-red-500 hover:border"
                      >
                        Update Password
                      </Button>
              

                    <DialogContent className="sm:max-w-[425px] text-gray-700 backdrop-blur-sm bg-white">
                      <DialogHeader>
                        <DialogTitle>Update Password</DialogTitle>
                        <DialogDescription>
                          Enter old password , then new password to Update
                          password .
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="old-password">Old Password</Label>
                          <div className=" grid grid-cols-[6fr_1fr] gap-3">
                            <Input
                              type={showOldPassword ? "text" : "password"}
                              onChange={(e) =>
                                setFormData((currentData) => ({
                                  ...currentData,
                                  oldPassword: e.target.value,
                                }))
                              }
                            />

                            <Button
                              className="shadow-lg shadow-outline hover:rounded-md hover:border-red-500 hover:border"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowOldPassword(!showOldPassword);
                              }}
                            >
                              {showOldPassword ? <LuEyeClosed /> : <LuEye />}
                            </Button>
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="new-password">New Password</Label>
                          <div className=" grid grid-cols-[6fr_1fr] gap-3">
                            <Input
                              id="new-password"
                              type={showNewPassword ? "text" : "password"}
                              onChange={(e) =>
                                setFormData((currentData) => ({
                                  ...currentData,
                                  newPassword: e.target.value,
                                }))
                              }
                            />

                            <Button
                              className="shadow-lg shadow-outline hover:rounded-md hover:border-red-500 hover:border"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowNewPassword(!showNewPassword);
                              }}
                            >
                              {showNewPassword ? <LuEyeClosed /> : <LuEye />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <DialogFooter className='flex flex-row justify-end'>
                        
                          <Button variant="outline"
                          onClick={(e)=>{
                            e.preventDefault();
                            setIsPasswordDialogOpen(false)}}>Cancel</Button>
                      
                        <Button
                          className="shadow-lg shadow-outline"
                          onClick={(e) => {
                            handelSubmit(false, e);
                          }}
                        >
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </div>
                </div>
              </Dialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
