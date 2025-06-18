import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
    createInvestmentListing,
    getAllInvestments,
    applyToInvestment,
    getMyApplications,
    getAllInvestorApplications,
} from "../controller/investment.js";

const investmentRouter = express.Router();

investmentRouter.post(
    "/admin/investments",
    isAuthenticated,
    hasPermission("create_investment"),
    requireRole(["admin","super_admin"]),
    createInvestmentListing
);

investmentRouter.get("/investments", getAllInvestments);

investmentRouter.post(
    "/investments/:id/apply",
    isAuthenticated,
    hasPermission("apply_investment"),
    requireRole(["investor"]),
    applyToInvestment
);

investmentRouter.get(
    "/investor/applications",
    isAuthenticated,
    requireRole(["investor"]),
    getMyApplications
);

investmentRouter.get(
    "/admin/investor-applications",
    isAuthenticated,
    requireRole(["admin", "super_admin"]),
    getAllInvestorApplications
);

export default investmentRouter;