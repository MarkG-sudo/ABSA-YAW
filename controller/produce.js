import ProduceModel from "../model/produce.js";
import cloudinary from "../middlewares/cloudinary.js";
import { createProduceValidator, updateProduceValidator } from "../validators/produce.js";

// CREATE produce
export const createProduce = async (req, res, next) => {
    try {
        const userId = req.auth.id;

        // Ensure at least 3 images are uploaded
        if (!req.files || req.files.length < 3) {
            return res.status(400).json({ message: "At least 3 images are required." });
        }

        // Validate input data using Joi
        const { error, value } = createProduceValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        // Format image data for storage
        const imageData = req.files.map(file => ({
            url: file.path,
            public_id: file.filename,
        }));

        // Create new produce entry in the database
        const produce = await ProduceModel.create({
            ...value,
            userId,
            images: imageData,
        });

        res.status(201).json({ message: "Produce created", produce });
    } catch (error) {
        next(error);
    }
};

// GET all produce created by the authenticated farmer
export const getAllProduce = async (req, res, next) => {
    try {
        const userId = req.auth.id;

        // Retrieve all produce documents created by this user
        const produce = await ProduceModel.find({ userId });

        res.status(200).json(produce);
    } catch (error) {
        next(error);
    }
};

// UPDATE produce by ID
export const updateProduce = async (req, res, next) => {
    try {
        const userId = req.auth.id;
        const { id } = req.params;

        // Find produce owned by the user
        const produce = await ProduceModel.findOne({ _id: id, userId });
        if (!produce) return res.status(404).json({ message: "Produce not found." });

        // Validate update data using Joi
        const { error, value } = updateProduceValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        // If new images are uploaded, delete old ones from Cloudinary
        let updatedImages = produce.images;
        if (req.files && req.files.length > 0) {
            for (const img of produce.images) {
                if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
            }

            // Format new image data
            updatedImages = req.files.map(file => ({
                url: file.path,
                public_id: file.filename,
            }));
        }

        // Update fields and images
        Object.assign(produce, value);
        produce.images = updatedImages;

        // Save updated document
        const updated = await produce.save();
        res.status(200).json({ message: "Produce updated", produce: updated });
    } catch (error) {
        next(error);
    }
};

// DELETE produce by ID
export const deleteProduce = async (req, res, next) => {
    try {
        const userId = req.auth.id;
        const { id } = req.params;

        // Find the user's produce to delete
        const produce = await ProduceModel.findOne({ _id: id, userId });
        if (!produce) return res.status(404).json({ message: "Produce not found." });

        // Delete all associated images from Cloudinary
        for (const img of produce.images) {
            if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
        }

        // Remove produce document from the database
        await ProduceModel.deleteOne({ _id: id });

        res.status(200).json({ message: "Produce deleted" });
    } catch (error) {
        next(error);
    }
};
