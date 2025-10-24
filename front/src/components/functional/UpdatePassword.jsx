import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoadingStage } from "../../store/LoadingStage.js";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useAuthFunctions } from "../../store/AuthFunction";
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const setIsUpdatingPassword = useLoadingStage(
    (state) => state.setIsUpdatingPassword
  );
  const {updatePassword} = useAuthFunctions();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const valid=()=>{
    if(formData.oldPassword.length < 6){
      toast.error("Old Password must be at least 6 characters long");
      return false;
    }
    if(formData.newPassword.length < 6){
      toast.error("New Password must be at least 6 characters long");
      return false;
    }
    return true;
  }
  const handelSubmit = (e) => {
    e.preventDefault();
    if(valid()){
      updatePassword(formData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center z-10 h-screen w-screen backdrop-blur-sm bg-black/70 fixed">
      <Card className="w-full max-w-sm z-10 bg-white">
        <CardHeader>
          <CardTitle>Update Your Password</CardTitle>
          <CardDescription>
            Enter your Old Password and New Password
          </CardDescription>
          <CardAction>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsUpdatingPassword(false);
              }}
            >
              X
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">Old Password</Label>
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
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <div className=" grid grid-cols-[6fr_1fr] gap-3">
                  <Input
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
          </form>
        </CardContent>
        <CardFooter className="flex-col-2 justify-end gap-2">
          <Button type="submit" className="" onClick={(e)=>{handelSubmit(e)}}>
            Update Password
          </Button>
          <Button
            variant="outline"
            className=""
            onClick={(e) => {
              e.preventDefault();
              setIsUpdatingName(false);
            }}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdatePassword;
