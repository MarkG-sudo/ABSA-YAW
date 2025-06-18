import Joi from "joi";

export const addToCartValidator = Joi.object({
    itemId: Joi.string().required(),
    itemModel: Joi.string().valid("Produce", "VendorAsset").required(),
    quantity: Joi.number().min(1).default(1)
});

export const updateCartItemValidator = Joi.object({
    quantity: Joi.number().min(1).required()
});
