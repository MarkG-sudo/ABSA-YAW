import { Schema, model } from "mongoose";

const investorApplicationSchema = new Schema({
    investmentId: { type: Schema.Types.ObjectId, ref: "Investment", required: true },
    investorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    principal: Number,
    paymentMethod: { type: String, enum: ['bank', 'mobile_money'] },
    paymentDetails: {
        accountNumber: String,
        accountName: String,
        mobileNumber: String,
        mobileName: String,
        bank: String,
        branch: String,
        swiftCode: String
    },
    nextOfKin: String,
    contactDetails: {
        phone: String,
        email: String,
        address: String
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

// Add virtual to reference investor profile
investorApplicationSchema.virtual("investorProfile", {
    ref: "InvestorProfile",
    localField: "investorId",
    foreignField: "userId", 
    justOne: true
});

// Enable virtuals in responses
investorApplicationSchema.set("toObject", { virtuals: true });
investorApplicationSchema.set("toJSON", { virtuals: true });

export default model("InvestorApplication", investorApplicationSchema);