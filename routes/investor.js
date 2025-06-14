import express from "express";
import { createInvestorProfile, getInvestorProfile, updateInvestorProfile } from "../controller/investor.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";

const investorRouter = express.Router();

investorRouter.post('/profile', isAuthenticated, hasPermission('create_investor'), requireRole(['investor']), createInvestorProfile);
investorRouter.get('/profile', isAuthenticated, hasPermission('get_investor'), requireRole(['investor']), getInvestorProfile);
investorRouter.patch('/profile', isAuthenticated, hasPermission('update_investor'), requireRole(['investor']), updateInvestorProfile);

export default investorRouter;
