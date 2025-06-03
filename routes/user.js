import express from 'express';
import { hasPermission, isAuthenticated } from '../middlewares/auth.js';
import { getProfile, registerUser, signInUser, updateProfile } from '../controller/user.js';


const userRouter = express.Router();

//User Routes

userRouter.get('/users/me', isAuthenticated, hasPermission('get_profile'), getProfile);

// userRouter.get('/users/me/dashboard', isAuthenticated, getUserData);

userRouter.patch('/users/me', isAuthenticated, hasPermission('update_profile'), updateProfile);

userRouter.post('/users/register', registerUser);

userRouter.post('/users/signIn', signInUser);

export default userRouter;