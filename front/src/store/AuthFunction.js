//logical imports
import { useCallback } from "react";
import { axiosInstance } from "@/lib/axios";

//store imports
import { useAuthStore } from "./AuthStore";
import { useLoadingStage } from "./LoadingStage";

//ui imports
import toast from "react-hot-toast";


export const useAuthFunctions = () => {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const setIsLogingIn = useLoadingStage((state) => state.setIsLogingIn);
  const setIsSigningUp = useLoadingStage((state) => state.setIsSigningUp);
  const setIsUpdatingName = useLoadingStage((state) => state.setIsUpdatingName);
  const setIsCheckingAuth = useLoadingStage((state) => state.setIsCheckingAuth);
  const setIsUpdatingPassword = useLoadingStage((state) => state.setIsUpdatingPassword);

  const checkAuth = useCallback(async () => {
    //console.log("trying to authenticate the user");

    setIsCheckingAuth();

    try {
      const res = await axiosInstance.get("/auth/me");

     // console.log("the server responded with => ", res.status);
      //console.log("user is authenticated");

      setAuthUser(res.data);
      //console.log("user data => ", res.data);
    } catch (error) {
      //console.log("error occured while checking auth", error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []); //no dependency as it can cause infinite loop

  const signup = useCallback(async (formData) => {
    setIsSigningUp(true);

    try {
     // console.log("trying to signUp");

      const res = await axiosInstance.post("/auth/signup", formData);

     // console.log("Signup response:", res.data);

      if (res.status === 200) {
        // Store token in localStorage as fallback for blocked cookies
        if (res.data.token) {
          localStorage.setItem("jwt", res.data.token);
        }

        setAuthUser(res.data);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
        //console.log("backend error");
      }
    } catch (error) {
      toast.error("Failed to Create Account");
      //console.log("catch error in signUp", error);
    } finally {
      setIsSigningUp(false);
    }
  }, []);

  const login = useCallback(async (formData) => {
    setIsLogingIn(true);

    try {
      //console.log("trying to login ");

      const res = await axiosInstance.post("/auth/login", formData);

      if (res.status === 200) {
        // Store token in localStorage as fallback for blocked cookies
        if (res.data.token) {
          localStorage.setItem("jwt", res.data.token);
        }
        setAuthUser(res.data);

        //setUserId(res.data._id);

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
        //console.log("backend problem");
        setUser((currentUser) => ({
          ...currentUser,
          isLogingIn: false,
        }));
      }
    } catch (error) {
      toast.error("Failed to LogIn");
      //console.log("catch error in login", error);
    } finally {
      setIsLogingIn(false);
    }
  }, []);

  const updateName = useCallback(async (formData) => {
    setIsUpdatingName(true);

    try {
      //console.log("trying to update name");

      const res = await axiosInstance.put(
        "/auth/updateUser/fullName",
        formData
      );

      if (res.status === 201) {
        toast.success("Name Updated");
        setAuthUser(res.data);
      } else {
        toast.error(res.data.message + " backend error ");
      }
    } catch (error) {
      toast.error("Error occured while updating try again");
      //console.log("catch error in update name", error);
    } finally {
      setIsUpdatingName(false);
    }
  }, []);

  const updatePassword = useCallback(async (formData) => {
    setIsUpdatingPassword(true);
    try {
      //console.log("trying to update the password");
      const res = await axiosInstance.put(
        "/auth/updateUser/password",
        formData
      );

      if (res.status === 201) {
        toast.success("Password Updated");
        //console.log("i am setting in update name try 22");

        setAuthUser(res.data);
      } else {
        toast.error(res.data.message);
        //console.log("i am setting in update name " + " backend error ");
      }
    } catch (error) {
      //console.log("error in update password ", error);
      toast.error("Error occured while updating try again");
      setIsUpdatingPassword(false);
    } finally {
      setIsUpdatingPassword(false);
    }
  }, []);

  const updateProfilePicture = useCallback(async (formData) => {
    //console.log("trying to upload profile picture");
    try {
      const res = await axiosInstance.put("/auth/updateUser/profilePicture", formData);
      if(res.status === 201){
        toast.success(res.data.message);
        setAuthUser(res.data.user);
      }else{
       // console.log(res.data.message,"backend error");
      }
    } catch (error) {
      toast.error("Error occured while updating try again");
      //console.log("catch error in update profile picture", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const res = await axiosInstance.post("auth/logout");

      localStorage.removeItem("jwt");
      toast.success(res.data.message);

      //console.log("trying to logout");
      setAuthUser(null);
    } catch (error) {
      localStorage.removeItem("jwt");
      toast.error("Failed to Logout");
    }
  }, []);

  return { checkAuth, signup, login, updateName, updatePassword, updateProfilePicture, logout };
};
