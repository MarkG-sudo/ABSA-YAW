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

// Add virtual field to populate the vendor profile based on userId
vendorAssetSchema.virtual("vendorProfile", {
    ref: "VendorProfile",         
    localField: "userId",        
    foreignField: "userId",       
    justOne: true                
});

// Enable virtuals when converting to JSON or object
vendorAssetSchema.set("toJSON", { virtuals: true });
vendorAssetSchema.set("toObject", { virtuals: true });
  

const VendorAssetModel = model("VendorAsset", vendorAssetSchema);
export default VendorAssetModel;
