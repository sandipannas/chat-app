import { useCallback } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { axiosInstance } from "@/lib/axios";
import { AuthStore, UserId } from "./AuthStore";
import toast from "react-hot-toast";

export const useAuthFunctions = () => {
  const setUser = useSetRecoilState(AuthStore);
  const setUserId = useSetRecoilState(UserId);

  const checkAuth = useCallback(async () => {
    console.log("trying to authenticate the user");

    setUser((currentUser) => {
      //no unneccessary setting of state
      if (currentUser.isCheckingAuth == false) {
        return {
          ...currentUser,
          isCheckingAuth: true,
        };
      }
      return currentUser;
    });

    try {
      const res = await axiosInstance.get("/auth/me");
      console.log("the server responded with => ", res.status);

      console.log("user is authenticated");

      setUser((currentUser) => {
        //no need to set if authUser already exist
        if (
          res.data &&
          (currentUser.authUser == null ||
            currentUser.authUser._id != res.data._id)
        ) {
          
          return {
            ...currentUser,
            authUser: res.data,
            isCheckingAuth: false,
          };
        } else {
          console.log("same userdata already exist");
          //no unneccessary setting of state
          if (currentUser.isCheckingAuth == true) {
            return {
              ...currentUser,
              isCheckingAuth: false,
            };
          } else {
            return currentUser;
          }
        }
      });

      setUserId(res.data._id);
    } catch (error) {
      console.log("error occured while checking auth", error);
      //no unneccessary setting of state
      
      setUser((currentUser) => {
        if (currentUser.isCheckingAuth == true) {
          return {
            ...currentUser,
            authUser: null,
            isCheckingAuth: false,
          };
        } else {
          return currentUser;
        }
      });
    }
  }, []); //no dependency as it can cause infinite loop

  const signup = useCallback(
    async (formData) => {
      try {
        console.log("i am setting in signUp try");
        setUser((currentUser) => ({
          ...currentUser,
          isSigningUp: true,
        }));
        const response = await axiosInstance.post("/auth/signup", formData);
        console.log("Signup response:", response.data);
        
        if (response.status === 200) {
            // Store token in localStorage as fallback for blocked cookies
            if (response.data.token) {
                localStorage.setItem('jwt', response.data.token);
            }
            setUser((currentUser) => ({
              ...currentUser,
              authUser: response.data,
              isSigningUp: false,
            }));
            setUserId(response.data._id);
            toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
          console.log("i am setting in signUp catch");
          setUser((currentUser) => ({
            ...currentUser,
            isSigningUp: false,
          }));
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
        if (res.status === 200) {
          // Store token in localStorage as fallback for blocked cookies
          if (res.data.token) {
            localStorage.setItem('jwt', res.data.token);
          }
          setUser((currentUser) => ({
            ...currentUser,
            authUser: res.data, // backend should send user info in response
            isLogingIn: false,
          }));
          setUserId(res.data._id);
          
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
      // Clear token from localStorage
      localStorage.removeItem('jwt');
      toast.success(res.data.message);
      console.log("i am setting in logout");
      setUser((currentUser) => ({
        ...currentUser,
        authUser: null,
      }));
      setUserId("");
    } catch (error) {
      // Clear token even if logout request fails
      localStorage.removeItem('jwt');
      toast.error("Failed to Logout");
    }
  }, [setUser]);

  return { checkAuth, signup, login, updateName, updatePassword, logout };
};
