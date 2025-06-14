import express from "express";
import { createVendorProfile, getVendorProfile, updateVendorProfile } from "../controller/vendor.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";

const vendorRouter = express.Router();

// Vendor profile routes
vendorRouter.post("/profile", isAuthenticated, hasPermission("create_vendor"), requireRole(["vendor"]), createVendorProfile);

vendorRouter.get("/profile", isAuthenticated, hasPermission("get_vendor"),  requireRole(["vendor"]), getVendorProfile);

vendorRouter.patch("/profile", isAuthenticated, hasPermission("update_vendor"), requireRole(["vendor"]), updateVendorProfile);

export default vendorRouter;
