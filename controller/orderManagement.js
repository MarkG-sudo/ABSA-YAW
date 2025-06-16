
import OrderModel from "../model/order.js";
import ReviewModel from "../model/review.js";
import { createReviewValidator } from "../validators/review.js";

// ADMIN: Update order status (e.g., shipped, delivered, cancelled)
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const updated = await OrderModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Order not found." });

        res.status(200).json({ message: "Order status updated.", order: updated });
    } catch (err) {
        next(err);
    }
};

// BUYER: Leave a review on a delivered order
export const createReview = async (req, res, next) => {
    try {
        const { error, value } = createReviewValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const order = await OrderModel.findOne({
            _id: value.orderId,
            buyerId: req.auth.id,
            status: "delivered"
        });

        if (!order) {
            return res.status(403).json({ message: "You can only review delivered orders." });
        }

        const review = await ReviewModel.create({
            ...value,
            buyerId: req.auth.id
        });

        res.status(201).json({ message: "Review submitted.", review });
    } catch (err) {
        next(err);
    }
};