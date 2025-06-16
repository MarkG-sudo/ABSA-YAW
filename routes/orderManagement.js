// routes/orderReview.js
import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { updateOrderStatus, createReview } from "../controller/orderReview.js";

const orderReviewRouter = express.Router();

// ADMIN: Update order status
orderReviewRouter.patch(
    "/orders/:id/status",
    isAuthenticated,
    hasPermission("update_order_status"),
    requireRole(["admin"]),
    updateOrderStatus
);

// BUYER: Submit review
orderReviewRouter.post(
    "/reviews",
    isAuthenticated,
    hasPermission("create_review"),
    requireRole(["buyer"]),
    createReview
);

export default orderReviewRouter;
