import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
    createInvestmentListing,
    getAllInvestments,
    applyToInvestment,
    getMyApplications,
    getMyInvestments,
    getAllInvestorApplications,
    updateInvestmentApplicationStatus,
    updateInvestment,deleteInvestment
} from "../controller/investment.js";

const investmentRouter = express.Router();

investmentRouter.post(
    "/admin/investments",
    isAuthenticated,
    hasPermission("create_investment"),
    requireRole(["admin","super_admin"]),
    createInvestmentListing
);

investmentRouter.get(
    "/admin/investor-applications",
    isAuthenticated,
    requireRole(["admin", "super_admin"]),
    getAllInvestorApplications
);

investmentRouter.patch(
    "/admin/investments/:id",
    isAuthenticated,
    requireRole(["admin", "super_admin"]),
    hasPermission("manage_investments"),
    updateInvestment
);

investmentRouter.delete(
    "/admin/investments/:id",
    isAuthenticated,
    requireRole(["admin", "super_admin"]),
    hasPermission("manage_investments"),
    deleteInvestment
);

investmentRouter.patch(
    "/applications/:id/status",
    isAuthenticated,
    requireRole(["admin", "super_admin"]),
    hasPermission("approve_user_investment"),
    updateInvestmentApplicationStatus
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
    "/investor/investments",
    isAuthenticated,
    requireRole(["investor"]),
    getMyInvestments
);



export default investmentRouter;