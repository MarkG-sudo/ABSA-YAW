import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
    getUserOrderMetrics,
    getAllOrdersMetricsAdmin
} from "../controller/orderMetrics.js";

const metricsRouter = express.Router();

//  Vendor or Farmer: View own order metrics
metricsRouter.get(
    "/metrics/orders",
    isAuthenticated,
    hasPermission("view_sales"),
    requireRole(["farmer", "buyer"]),
    getUserOrderMetrics
);

//  Admin: View all order metrics, optionally by user/role
metricsRouter.get(
    "/admin/metrics/orders",
    isAuthenticated,
    hasPermission("view_all_orders"),
    requireRole(["admin", "super_admin"]),
    getAllOrdersMetricsAdmin
);

export default metricsRouter;
