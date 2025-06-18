import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'items.itemModel' },
            itemModel: { type: String, required: true, enum: ['Produce', 'VendorAsset'] },
            quantity: { type: Number, default: 1 }
        }
    ]
}, { timestamps: true });

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;