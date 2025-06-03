import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {},
    role: { type: String, default: 'buyer', enum: ['buyer', 'vendor', 'farmer', 'investor'] }

}, {
    timestamps: true
});
userSchema.plugin(toJSON);

export const UserModel = model('User', userSchema);