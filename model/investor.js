import mongoose from "mongoose";

const investorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },
    companyName: { type: String, required: true },
    investmentFocus: { type: String, required: true },
    contactEmail: { type: String, required: true },
    phone: { type: String },
    portfolioSize: { type: String },
}, { timestamps: true });

export const InvestorProfileModel = mongoose.model("InvestorProfile", investorProfileSchema);
