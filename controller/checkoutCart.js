import CartModel from "../model/cart.js";
import OrderModel from "../model/order.js";
import ProduceModel from "../model/produce.js";
import VendorAssetModel from "../model/inputs.js";
import { UserModel } from "../model/user.js";
import { mailtransporter } from "../utils/mail.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Checkout entire cart
export const checkoutCart = async (req, res, next) => {
    try {
        const buyerId = req.auth.id;
        const cart = await CartModel.findOne({ buyerId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty." });
        }

        const createdOrders = [];

        for (const cartItem of cart.items) {
            const { itemId, itemModel, quantity } = cartItem;

            const ItemModel = itemModel === "Produce" ? ProduceModel : VendorAssetModel;
            const item = await ItemModel.findById(itemId);
            if (!item) continue;

            const order = await OrderModel.create({
                buyerId,
                itemId,
                itemModel,
                quantity,
                status: "pending",
            });

            createdOrders.push(order);

            const owner = await UserModel.findById(item.userId);
            if (owner) {
                try {
                    let emailHtml = fs.readFileSync(
                        path.join(__dirname, "../utils/order-notification.html"),
                        "utf8"
                    );

                    emailHtml = emailHtml
                        .replace(/{{ownerName}}/g, owner.firstName)
                        .replace(/{{itemName}}/g, item.name)
                        .replace(/{{quantity}}/g, quantity)
                        .replace(/{{buyerName}}/g, req.auth.firstName || "a buyer");

                    await mailtransporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: owner.email,
                        subject: "New Order Received on Agrigain!",
                        html: emailHtml,
                    });
                } catch (err) {
                    console.error("Error sending owner email:", err.message);
                }
            }
        }

        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Checkout successful", orders: createdOrders });
    } catch (error) {
        next(error);
    }
};
