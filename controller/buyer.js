import { BuyerProfileModel } from "../model/buyer.js";
import { createBuyerValidator, updateBuyerValidator } from "../validators/buyer.js";
import mongoose from "mongoose";

// Create Buyer Profile
export const createBuyerProfile = async (req, res, next) => {
    try {
        if ((req.auth.role || "").trim() !== "buyer") {
            return res.status(403).json({ message: "Access denied. Not a buyer." });
        }

        const { error, value } = createBuyerValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const userId = new mongoose.Types.ObjectId(req.auth.id);
        const existingProfile = await BuyerProfileModel.findOne({ userId });

        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists. Use update instead." });
        }

        const profile = await BuyerProfileModel.create({ ...value, userId });
        res.status(201).json({ message: "Buyer profile created.", profile });
    } catch (error) {
        next(error);
    }
};

// Update Buyer Profile
export const updateBuyerProfile = async (req, res, next) => {
    try {
        if ((req.auth.role || "").trim() !== "buyer") {
            return res.status(403).json({ message: "Access denied. Not a buyer." });
        }

        const { error, value } = updateBuyerValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const userId = new mongoose.Types.ObjectId(req.auth.id);
        const updated = await BuyerProfileModel.findOneAndUpdate({ userId }, value, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Buyer profile not found." });
        }

        res.status(200).json({ message: "Buyer profile updated.", profile: updated });
    } catch (error) {
        next(error);
    }
};

// Get Buyer Profile
export const getBuyerProfile = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.auth.id);
        const profile = await BuyerProfileModel.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ message: "Buyer profile not found." });
        }

        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
};
