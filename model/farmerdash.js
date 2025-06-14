import mongoose from "mongoose";

const produceSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    availableFrom: Date,
    availableTill: Date,
}, { timestamps: true });

export const ProduceModel = mongoose.model("Produce", produceSchema);
