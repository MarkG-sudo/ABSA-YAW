import { Schema, model } from 'mongoose';
import { toJSON } from "@reis/mongoose-to-json";


const farmerProfileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    farmSize: String,
    cropTypes: [String],
    region: String,
    experienceYears: Number,
}, { 
    timestamps: true 
});
farmerProfileSchema.plugin(toJSON);

export const FarmerProfileModel = model('FarmerProfile', farmerProfileSchema);
