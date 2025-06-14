import { InvestorProfileModel } from "../model/investor.js";
import { createInvestorValidator, updateInvestorValidator } from "../validators/investor.js";
import mongoose from "mongoose";

export const createInvestorProfile = async (req, res, next) => {
    try {
        if ((req.auth.role || "").trim() !== "investor") {
            return res.status(403).json({ message: "Access denied. Not an investor." });
        }

        const { error, value } = createInvestorValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const userId = new mongoose.Types.ObjectId(req.auth.id);
        const existing = await InvestorProfileModel.findOne({ userId });
        if (existing) return res.status(400).json({ message: "Profile already exists. Use update instead." });

        const profile = await InvestorProfileModel.create({ ...value, userId });
        res.status(201).json({ message: "Investor profile created.", profile });
    } catch (error) {
        next(error);
    }
};

export const updateInvestorProfile = async (req, res, next) => {
    try {
        if ((req.auth.role || "").trim() !== "investor") {
            return res.status(403).json({ message: "Access denied. Not an investor." });
        }

        const { error, value } = updateInvestorValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const userId = new mongoose.Types.ObjectId(req.auth.id);
        const updated = await InvestorProfileModel.findOneAndUpdate({ userId }, value, { new: true });
        if (!updated) return res.status(404).json({ message: "Investor profile not found." });

        res.status(200).json({ message: "Investor profile updated.", profile: updated });
    } catch (error) {
        next(error);
    }
};

export const getInvestorProfile = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.auth.id);
        const profile = await InvestorProfileModel.findOne({ userId });
        if (!profile) return res.status(404).json({ message: "Investor profile not found." });

        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
};
