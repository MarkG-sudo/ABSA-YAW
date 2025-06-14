import express from 'express';
import { hasPermission, isAuthenticated } from '../middlewares/auth.js';
import { upload } from "../middlewares/cloudinary.js";
import { getProfile, registerUser, signInUser, updateProfile } from '../controller/user.js';


const userRouter = express.Router();

//User Routes

// userRouter.get('/users/me', isAuthenticated, hasPermission('get_profile'), getProfile);

// userRouter.get('/users/me/dashboard', isAuthenticated, getUserData);

userRouter.patch('/me', isAuthenticated, hasPermission('update_profile'), updateProfile);

userRouter.post('/register', upload.single("avatar"), registerUser);

userRouter.post('/signIn', signInUser);

export default userRouter;