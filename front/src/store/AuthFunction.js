import { useCallback } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { axiosInstance } from "@/lib/axios";
import { AuthStore, UserId } from "./AuthStore";
import toast from "react-hot-toast";


export const useAuthFunctions = () => {
  const [{ authUser, socket, isCheckingAuth }, setUser] =
    useRecoilState(AuthStore);
  const setUserId = useSetRecoilState(UserId);

  const checkAuth = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      if (authUser == null || authUser.email != res.data.email) {
        setUser((currentUser) => ({
          ...currentUser,
          authUser: res.data,
          isCheckingAuth: false,
        }));
      }
      setUserId(res.data._id);
    } catch (error) {
      console.log("i am setting in checkAuth catch", error);
      setUser((currentUser) => ({
        ...currentUser,
        authUser: null,
        isCheckingAuth: false,
      }));
    }
  }, [authUser]);

  const signup = useCallback(
    async (formData) => {
      try {
        console.log("i am setting in signUp try");
        setUser((currentUser) => ({
          ...currentUser,
          isSigningUp: true,
        }));
        const res = await axiosInstance.post("/auth/signup", formData);
        if (res.status === 201) {
          checkAuth();
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch {
        toast.error("Failed to Create Account");
        console.log("i am setting in signUp catch");
        setUser((currentUser) => ({
          ...currentUser,
          isSigningUp: false,
        }));
      }
    },
    [setUser]
  );

  const login = useCallback(
    async (formData) => {
      try {
        console.log("i am setting in logIn try");
        setUser((currentUser) => ({
          ...currentUser,
          isLogingIn: true,
        }));
        const res = await axiosInstance.post("/auth/login", formData);
        if (res.status === 201) {
          setUser((currentUser) => ({
            ...currentUser,
            authUser: res.data,   // backend should send user info in response
            isLogingIn: false,
          }));
          setTimeout(checkAuth,5000);
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
          console.log("i am setting in logIn else catch");
          setUser((currentUser) => ({
            ...currentUser,
            isLogingIn: false,
          }));
        }
      } catch {
        toast.error("Failed to LogIn");
        console.log("i am setting in login catch");
        setUser((currentUser) => ({
          ...currentUser,
          isLogingIn: false,
        }));
      }
    },
    [setUser]
  );

  const updateName = useCallback(
    async (formData) => {
      try {
        console.log("i am setting in update name try");
        setUser((currentUser) => ({
          ...currentUser,
          isUpdatingProfile: true,
        }));
        const res = await axiosInstance.put(
          "/auth/updateUser/fullName",
          formData
        );
        if (res.status === 201) {
          toast.success("Name Updated");
          console.log("i am setting in update name try 2");
          setUser((currentUser) => ({
            ...currentUser,
            authUser: res.data,
          }));
        } else {
          toast.error(res.data.message);
        }
        console.log("i am setting in update name try 3");
        setUser((currentUser) => ({
          ...currentUser,
          isUpdatingProfile: false,
        }));
      } catch (error) {
        toast.error("Error occured while updating try again");
      }
      console.log("i am setting in update name try 3");
      setUser((currentUser) => ({
        ...currentUser,
        isUpdatingProfile: false,
      }));
    },
    [setUser]
  );

  const updatePassword = useCallback(
    async (formData) => {
      try {
        console.log("i am setting in update name try 11");
        setUser((currentUser) => ({
          ...currentUser,
          isUpdatingProfile: true,
        }));
        const res = await axiosInstance.put(
          "/auth/updateUser/password",
          formData
        );
        if (res.status === 201) {
          toast.success("Password Updated");
          console.log("i am setting in update name try 22");
          setUser((currentUser) => ({
            ...currentUser,
            authUser: res.data,
            isUpdatingProfile: false,
          }));
        } else {
          toast.error(res.data.message);
          console.log("i am setting in update name try 33");
          setUser((currentUser) => ({
            ...currentUser,
            isUpdatingProfile: false,
          }));
        }
      } catch (error) {
        console.log("i am setting in update name try 44");
        toast.error("Error occured while updating try again");
        setUser((currentUser) => ({
          ...currentUser,
          isUpdatingProfile: false,
        }));
      }
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    try {
      const res = await axiosInstance.post("auth/logout");
      toast.success(res.data.message);
      console.log("i am setting in logout");
      setUser((currentUser) => ({
        ...currentUser,
        authUser: null,
      }));
    } catch (error) {
      toast.error("Failed to Logout");
    }
  }, [setUser]);

  return { checkAuth, signup, login, updateName, updatePassword, logout };
};
