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
import { useRecoilValue } from "recoil";
import { AuthStore } from "@/store/AuthStore";
import { useAuthFunctions } from "@/store/AuthFunction";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const LogInPage = () => {
  const { login } = useAuthFunctions();
  const navigate = useNavigate();
  const handelSignUpClick = () => {
    navigate("/signup");
  };


  const { isLogingIn } = useRecoilValue(AuthStore);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (formData.password == "") {
      toast.error("Password required");
      return false;
    }
    if (formData.email == "") {
      toast.error("Email required");
      return false;
    }
    return true;
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      login(formData);
    } else {
      toast.error("Can't Login, try again");
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
      <Card className="w-full max-w-sm self-center z-1 text-gray-700 backdrop-blur-sm backdrop-opacity-70 ">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={handelSignUpClick}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="shadow-md"
                  onChange={(e) =>
                    setFormData((currentFormData) => ({
                      ...currentFormData,
                      email: e.target.value,
                    }))
                  }
                  required
                />
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
                <div className="grid grid-cols-[6fr_1fr] gap-3">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="shadow-md"
                    onChange={(e) =>
                      setFormData((currentFormData) => ({
                        ...currentFormData,
                        password: e.target.value,
                      }))
                    }
                    required
                  />

                  <Button
                    className="shadow-outline shadow-lg hover:rounded-md hover:border-red-500 hover:border"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? <LuEyeClosed /> : <LuEye />}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full shadow-outline shadow-md hover:rounded-md hover:border-green-500 hover:border"
            onClick={handelSubmit}
            disabled={isLogingIn}
          >
            {isLogingIn ? (
              <>
                <Loader2 className="size-5 animate-spin">Loading...</Loader2>
              </>
            ) : (
              "Login"
            )}
          </Button>
          <Button variant="outline" className="w-full shadow-lg">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LogInPage;
