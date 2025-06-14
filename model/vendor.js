import mongoose from "mongoose";

const vendorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    businessAddress: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    registrationNumber: {
        type: String,
    },
    businessType: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const VendorProfileModel = mongoose.model("VendorProfile", vendorProfileSchema);
