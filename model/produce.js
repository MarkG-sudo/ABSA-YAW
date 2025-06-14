import mongoose from "mongoose";

const produceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: String,
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            enum: ["grains", "vegetables", "fruits", "roots", "others"],
            default: "others",
        },
        images: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

const ProduceModel = mongoose.model("Produce", produceSchema);
export default ProduceModel;
