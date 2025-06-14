import { FarmerProfileModel } from "../model/farmer.js";
import { createFarmerValidator, updateFarmerValidator } from "../validators/farmer.js";

// Create a farmer profile
export const createFarmerProfile = async (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log("Route hit: createFarmerProfile");
        console.log("Received createFarmerProfile request:", req.body);
    }

    try {
        const isFarmer = req.auth?.role?.trim().toLowerCase() === "farmer";
        if (!isFarmer) {
            return res.status(403).json({ message: "Access denied. Not a farmer." });
        }

        const { error, value } = createFarmerValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        const userId = req.auth.id;
        const existingProfile = await FarmerProfileModel.findOne({ userId });

        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists. Use update instead." });
        }

        if (process.env.NODE_ENV === "development") {
            console.log("Creating profile with:", { ...value, userId });
        }

        const profile = await FarmerProfileModel.create({
            userId,
            farmName: value.farmName,
            location: value.location,
            farmSize: value.farmSize,
            cropTypes: value.cropTypes,
            experienceYears: value.experienceYears
           
        });

        res.status(201).json({ message: "Farmer profile created.", profile });
    } catch (error) {
        next(error);
    }
};

// Update a farmer profile
export const updateFarmerProfile = async (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log("Route hit: updateFarmerProfile");
    }

    try {
        const isFarmer = req.auth?.role?.trim().toLowerCase() === "farmer";
        if (!isFarmer) {
            return res.status(403).json({ message: "Access denied. Not a farmer." });
        }

        const { error, value } = updateFarmerValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        const userId = req.auth.id;
        if (process.env.NODE_ENV === "development") {
            console.log("Looking for profile with userId:", userId);
        }

        const updated = await FarmerProfileModel.findOneAndUpdate(
            { userId },
            value,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Farmer profile not found." });
        }

        res.status(200).json({ message: "Farmer profile updated.", profile: updated });
    } catch (error) {
        next(error);
    }
};

// Get farmer profile
export const getFarmerProfile = async (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log("Route hit: getFarmerProfile");
    }

    try {
        const userId = req.auth.id;
        const profile = await FarmerProfileModel.findOne({ userId }).lean();

        if (!profile) {
            return res.status(404).json({ message: "Farmer profile not found." });
        }

        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
};
