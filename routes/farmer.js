import express from "express";
import { createFarmerProfile, getFarmerProfile, updateFarmerProfile } from "../controller/farmer.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";



const farmerRouter = express.Router();


// Farmer profile routes
farmerRouter.post('/profile', isAuthenticated, hasPermission('create_farmer'), requireRole(["farmer"]), createFarmerProfile);
farmerRouter.get('/profile', isAuthenticated, hasPermission('get_farmer'), requireRole(["farmer"]), getFarmerProfile);
farmerRouter.patch('/profile', isAuthenticated, hasPermission('update_farmer'), requireRole(["farmer"]), updateFarmerProfile);

export default farmerRouter;
