import VendorAssetModel from "../model/inputs.js";
import cloudinary from "../middlewares/cloudinary.js";
import { createVendorAssetValidator, updateVendorAssetValidator } from "../validators/inputs.js";

// CREATE
export const createVendorAsset = async (req, res, next) => {
    try {
        const userId = req.auth.id;

        const { error, value } = createVendorAssetValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        if (!req.files || req.files.length < 3) {
            return res.status(400).json({ message: "At least 3 images are required." });
        }

        const imageData = req.files.map(file => ({
            url: file.path,
            public_id: file.filename,
        }));

        const asset = await VendorAssetModel.create({
            ...value,
            userId,
            images: imageData,
        });

        res.status(201).json({ message: "Vendor asset created", asset });
    } catch (error) {
        next(error);
    }
};

// GET ALL
export const getAllVendorAssets = async (req, res, next) => {
    try {
        const userId = req.auth.id;
        const assets = await VendorAssetModel.find({ userId });
        res.status(200).json(assets);
    } catch (error) {
        next(error);
    }
};

// UPDATE
export const updateVendorAsset = async (req, res, next) => {
    try {
        const userId = req.auth.id;
        const { id } = req.params;

        const asset = await VendorAssetModel.findOne({ _id: id, userId });
        if (!asset) return res.status(404).json({ message: "Asset not found." });

        const { error, value } = updateVendorAssetValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        let updatedImages = asset.images;
        if (req.files && req.files.length > 0) {
            for (const img of asset.images) {
                if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
            }
            updatedImages = req.files.map(file => ({
                url: file.path,
                public_id: file.filename,
            }));
        }

        asset.name = value.name ?? asset.name;
        asset.description = value.description ?? asset.description;
        asset.price = value.price ?? asset.price;
        asset.category = value.category ?? asset.category;
        asset.images = updatedImages;

        const updated = await asset.save();
        res.status(200).json({ message: "Vendor asset updated", asset: updated });
    } catch (error) {
        next(error);
    }
};

// DELETE
export const deleteVendorAsset = async (req, res, next) => {
    try {
        const userId = req.auth.id;
        const { id } = req.params;

        const asset = await VendorAssetModel.findOne({ _id: id, userId });
        if (!asset) return res.status(404).json({ message: "Asset not found." });

        for (const img of asset.images) {
            if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
        }

        await VendorAssetModel.deleteOne({ _id: id });
        res.status(200).json({ message: "Vendor asset deleted" });
    } catch (error) {
        next(error);
    }
};
