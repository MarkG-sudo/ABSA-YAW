import mongoose from "mongoose";

const buyerProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User' },
    fullName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    preferredProduce: { type: [String], default: [] }
}, { timestamps: true });

export const BuyerProfileModel = mongoose.model("BuyerProfile", buyerProfileSchema);
