import { Schema, model } from "mongoose";

const investmentSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    roi: { type: Number, required: true },
    amountRequired: { type: Number, required: true },
    durationMonths: { type: Number, required: true },
    deadline: { type: Date },
    location: { type: String, required: true },
    status: { type: String, required: true, enum: ['open', 'closed'], default: 'open' },
}, { timestamps: true });

export default model("Investment", investmentSchema);