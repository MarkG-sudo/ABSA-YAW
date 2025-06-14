import Joi from "joi";

export const createVendorAssetValidator = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
});

export const updateVendorAssetValidator = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    category: Joi.string().optional(),
});
