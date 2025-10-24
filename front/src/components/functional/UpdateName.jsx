import React from "react";
import { useEffect } from "react";
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
import { useAuthFunctions } from "../../store/AuthFunction";
import { useState } from "react";

const UpdateName = () => {
  const setIsUpdatingName = useLoadingStage((state) => state.setIsUpdatingName);

  const { updateName } = useAuthFunctions();

  const [formData, setFormData] = useState({
      newFullName: "",
  });

    const validateFormData = () => {
        if (formData.newFullName.trim() == "") {
          toast.error("Name Required");
          return false;
        }
      return true;
    };
  
    const handelSubmitName = (e) => {
      e.preventDefault();
      if (validateFormData()) {
          updateName(formData);
          setIsUpdatingName(false);
          setFormData({
            newFullName: "",
          });
        }
      }
  
  

  return (
    <div className="flex flex-col items-center justify-center z-10 h-screen w-screen backdrop-blur-sm bg-black/70 fixed">
      <Card className="w-full max-w-sm z-10 bg-white">
        <CardHeader>
          <CardTitle>Update Your Name</CardTitle>
          <CardDescription>Enter your name to update</CardDescription>
          <CardAction>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsUpdatingName(false);
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
                <Label htmlFor="name">Name</Label>
                <Input type="text" placeholder="" required 
                onChange={(e)=>{
                  setFormData((currentData)=>({
                    ...currentData,
                    newFullName: e.target.value,
                  }))
                }}/>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col-2 justify-end gap-2">
          <Button type="submit" className="shadow-lg shadow-outline"
          onClick={(e)=>{
            handelSubmitName(e);
          }}>
            Update Name
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

export default UpdateName;
