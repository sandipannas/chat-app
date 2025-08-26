import React, { useState } from "react";
import Squares from "../blocks/Backgrounds/Squares/Squares";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useRecoilValue } from "recoil";
import { AuthStore } from "../store/AuthStore";
import { useAuthFunctions } from "@/store/AuthFunction";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const {signup}=useAuthFunctions()
  const {isSigningUp }=useRecoilValue(AuthStore)
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: "",
  });

  const navigate = useNavigate();
  const handelLogInClick = () => {
    navigate("/login");
  };
  
  const validateForm = () => {
    if (formData.fullName.trim() == "") {
      toast.error("Full Name required");
      return false;
    }
    if (formData.password == "") {
      toast.error("Password required");
      return false;
    }
    if (formData.confirmPassword == "") {
      toast.error("Confirm Password required");
      return false;
    }
    if (formData.email == "") {
      toast.error("Email required");
      return false;
    }
    if (formData.password != formData.confirmPassword) {
      toast.error("Password and Confirm Password does not match");
      return false;
    }
    return true;
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup(formData);
    } else {
      toast.error("Can't Singup, try again");
    }
  };

  
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
      <Card className=" scale-100  h-min lg:h-auto lg:w-full lg:max-w-sm self-center z-10 text-gray-700 shadow-lg backdrop-blur-sm backdrop-opacity-70 ">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={handelLogInClick}>
              Log In
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder=""
                  className="shadow-md"
                  required
                  onChange={(e) =>
                    setFormData((currentFormData) => ({
                      ...currentFormData,
                      fullName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="shadow-md"
                  required
                  onChange={(e) =>
                    setFormData((currentFormData) => ({
                      ...currentFormData,
                      email: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="grid grid-cols-[6fr_1fr] gap-3">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      setFormData((currentFormData) => ({
                        ...currentFormData,
                        password: e.target.value,
                      }))
                    }
                    className="shadow-md"
                    required
                  />

                  <Button
                    className="shadow-lg shadow-outline hover:rounded-md hover:border-red-500 hover:border"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? <LuEyeClosed /> : <LuEye />}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="shadow-md"
                  onChange={(e) =>
                    setFormData((currentFormData) => ({
                      ...currentFormData,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            onClick={handelSubmit}
            disabled={isSigningUp}
            className="w-full shadow-md shadow-outline hover:rounded-md hover:border-green-500 hover:border"
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin">Loading...</Loader2>
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          <Button variant="outline" className="w-full shadow-md ">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
