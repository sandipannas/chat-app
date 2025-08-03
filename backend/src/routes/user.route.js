import express from 'express';
import { 
    signup,
    login, 
    logout, 
    updateUserProfilePicture,
    updateUserFullName,
    updateUserPassword,
    getAllUsers,
    getCurrentUser 
} from '../controllers/user.controller.js';
import { authJWT } from '../middlewares/auth.middleware.js';

const router=express.Router();

///user

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/updateUser/profilePicture",authJWT,updateUserProfilePicture);

router.put("/updateUser/fullName",authJWT,updateUserFullName);

router.put("/updateUser/password",authJWT,updateUserPassword);

router.get("/me", authJWT, getCurrentUser);
//message

router.get("/getAllUsers",authJWT,getAllUsers);

export default router;