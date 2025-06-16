import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    produceId: { type: Schema.Types.ObjectId, ref: "Produce", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
}, {
    timestamps: true
});

const ReviewModel = model("Review", reviewSchema);
export default ReviewModel;
