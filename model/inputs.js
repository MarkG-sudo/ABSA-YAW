import { Schema, model } from "mongoose";

const vendorAssetSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [
        {
            url: String,
            public_id: String,
        },
    ],
}, { timestamps: true });

const VendorAssetModel = model("VendorAsset", vendorAssetSchema);
export default VendorAssetModel;
