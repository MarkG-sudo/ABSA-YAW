import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { checkoutCart } from "../controller/checkoutCart.js";

const checkoutRouter = express.Router();

checkoutRouter.post(
    "/checkout",
    isAuthenticated,
    hasPermission("place_orders"),
    requireRole(["buyer", "farmer"]),
    checkoutCart
);

export default checkoutRouter;
