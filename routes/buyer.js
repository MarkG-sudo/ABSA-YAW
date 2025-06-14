import express from "express";
import { createBuyerProfile, getBuyerProfile, updateBuyerProfile } from "../controller/buyer.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";

const buyerRouter = express.Router();

buyerRouter.post('/profile', isAuthenticated, hasPermission('create_buyer'), requireRole(["buyer"]), createBuyerProfile);
buyerRouter.get('/profile', isAuthenticated, hasPermission('get_buyer'), requireRole(["buyer"]), getBuyerProfile);
buyerRouter.patch('/profile', isAuthenticated, hasPermission('update_buyer'), requireRole(["buyer"]), updateBuyerProfile);

export default buyerRouter;
