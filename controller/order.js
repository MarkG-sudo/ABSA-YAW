import OrderModel from "../model/order.js";
import ProduceModel from "../model/produce.js";
import { createOrderValidator, updateOrderValidator } from "../validators/order.js";

// Create a new order
export const placeOrder = async (req, res, next) => {
    try {
        const { error, value } = createOrderValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        // Ensure the produce exists
        const produce = await ProduceModel.findById(value.produceId);
        if (!produce) {
            return res.status(404).json({ message: "Produce not found." });
        }

        // Optional: check stock, limit orders, etc.

        const newOrder = await OrderModel.create({
            ...value,
            buyerId: req.auth.id,
            status: "pending", // default order status
        });

        res.status(201).json({ message: "Order placed", order: newOrder });
    } catch (err) {
        next(err);
    }
};

// Get all orders for the logged-in buyer
export const getBuyerOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.find({ buyerId: req.auth.id })
            .populate("produceId")
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

        const order = await OrderModel.findOne({ _id: id, buyerId: req.auth.id }).populate("produceId");
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
