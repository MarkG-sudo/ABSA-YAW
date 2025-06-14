import { VendorProfileModel } from "../model/vendor.js";
import { createVendorValidator, updateVendorValidator } from "../validators/vendor.js";

// Create vendor profile
export const createVendorProfile = async (req, res, next) => {
    try {
        if (req.auth.role !== "vendor") {
            return res.status(403).json({ message: "Access denied. Not a vendor." });
        }

        const { error, value } = createVendorValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        const userId = req.auth.id;
        const existingProfile = await VendorProfileModel.findOne({ userId });

        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists. Use update instead." });
        }

        const profile = await VendorProfileModel.create({
            ...value,
            userId
        });

        res.status(201).json({ message: "Vendor profile created.", profile });
    } catch (error) {
        next(error);
    }
};

// Update vendor profile
export const updateVendorProfile = async (req, res, next) => {
    try {
        if (req.auth.role !== "vendor") {
            return res.status(403).json({ message: "Access denied. Not a vendor." });
        }

        const { error, value } = updateVendorValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        const userId = req.auth.id;
        const updated = await VendorProfileModel.findOneAndUpdate(
            { userId },
            value,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Vendor profile not found." });
        }

        res.status(200).json({ message: "Vendor profile updated.", profile: updated });
    } catch (error) {
        next(error);
    }
};

// Get vendor profile
export const getVendorProfile = async (req, res, next) => {
    try {
        const userId = req.auth.id;
        const profile = await VendorProfileModel.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ message: "Vendor profile not found." });
        }

        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
};
