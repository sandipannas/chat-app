import express from 'express';
import { 
    signup,
    login, 
    logout, 
    updateUserProfilePicture,
    updateUserFullName,
    updateUserPassword, 
} from '../controllers/auth.controller.js';
import { authJWT } from '../middlewares/auth.middleware.js';

const router=express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/updateUser/profilePicture",authJWT,updateUserProfilePicture);

router.put("/updateUser/fullName",authJWT,updateUserFullName);

router.put("/updateUser/password",authJWT,updateUserPassword);

export default router;