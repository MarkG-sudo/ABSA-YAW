import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    produceId: { type: Schema.Types.ObjectId, ref: "Produce", required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: "pending", enum: ["pending", "confirmed", "shipped", "delivered"] },
    paymentStatus: { type: String, default: "unpaid", enum: ["unpaid", "paid"] },
    deliveryTracking: { type: String },
    review: { type: String },
    rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

const OrderModel = model("Order", orderSchema);
export default OrderModel;