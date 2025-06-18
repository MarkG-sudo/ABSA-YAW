import OrderModel from "../model/order.js";
import { createOrderValidator, updateOrderValidator } from "../validators/order.js";
import ProduceModel from "../model/produce.js";
import VendorAssetModel from "../model/inputs.js";
import { UserModel } from "../model/user.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { mailtransporter } from "../utils/mail.js";

// Path setup for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new order
export const placeOrder = async (req, res, next) => {
    try {
        const { error, value } = createOrderValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const { itemId, itemModel, quantity } = value;

        if (!["Produce", "VendorAsset"].includes(itemModel)) {
            return res.status(400).json({ message: "Invalid item model." });
        }

        const ItemModel = itemModel === "Produce" ? ProduceModel : VendorAssetModel;
        const item = await ItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: `${itemModel} not found.` });
        }

        const newOrder = await OrderModel.create({
            ...value,
            buyerId: req.auth.id,
            status: "pending",
        });

        // Notify vendor or farmer
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
            } catch (mailErr) {
                console.error("Error sending order notification email:", mailErr.message);
            }
        }

        res.status(201).json({ message: "Order placed", order: newOrder });
    } catch (err) {
        next(err);
    }
};

// Get all orders for the logged-in buyer
export const getBuyerOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.find({ buyerId: req.auth.id })
            .populate("itemId") 
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

// Get a single order by ID
export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await OrderModel.findOne({ _id: id, buyerId: req.auth.id })
            .populate("itemId");

        if (!order) return res.status(404).json({ message: "Order not found." });

        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

// Update order (e.g., cancel or confirm receipt)
export const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error, value } = updateOrderValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const order = await OrderModel.findOneAndUpdate(
            { _id: id, buyerId: req.auth.id },
            value,
            { new: true }
        );

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order updated", order });
    } catch (err) {
        next(err);
    }
};

// Delete/cancel an order
export const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await OrderModel.findOne({ _id: id, buyerId: req.auth.id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        await OrderModel.deleteOne({ _id: id });

        res.status(200).json({ message: "Order cancelled successfully" });
    } catch (err) {
        next(err);
    }
};
