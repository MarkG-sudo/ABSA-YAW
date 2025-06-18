import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controller/cart.js";

const cartRouter = express.Router();

cartRouter.post("/cart", isAuthenticated, requireRole(["buyer", "farmer"]), addToCart);
cartRouter.get("/cart", isAuthenticated, requireRole(["buyer", "farmer"]), getCart);
cartRouter.patch("/cart/:itemId", isAuthenticated, requireRole(["buyer", "farmer"]), updateCartItem);
cartRouter.delete("/cart/:itemId", isAuthenticated, requireRole(["buyer", "farmer"]), removeCartItem);
cartRouter.delete("/cart", isAuthenticated, requireRole(["buyer", "farmer"]), clearCart);

export default cartRouter;
