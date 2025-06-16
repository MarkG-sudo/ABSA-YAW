import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { placeOrder, getBuyerOrders, updateOrder } from "../controller/order.js";

const orderRouter = express.Router();

orderRouter.post(
    "/orders",
    isAuthenticated,
    hasPermission("create_order"),
    requireRole(["buyer"]),
    placeOrder
);

orderRouter.get(
    "/orders",
    isAuthenticated,
    hasPermission("get_order"),
    requireRole(["buyer"]),
    getBuyerOrders
);

orderRouter.patch(
    "/orders/:id",
    isAuthenticated,
    hasPermission("update_order"),
    requireRole(["buyer"]),
    updateOrder
);

export default orderRouter;