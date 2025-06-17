import Joi from "joi";

export const createOrderValidator = Joi.object({
    itemId: Joi.string().required(),
    itemModel: Joi.string().valid("Produce", "VendorAsset").required(),
    quantity: Joi.number().min(1).required()
});

export const updateOrderValidator = Joi.object({
    status: Joi.string().valid("confirmed", "shipped", "delivered"),
    paymentStatus: Joi.string().valid("paid"),
    deliveryTracking: Joi.string(),
    review: Joi.string(),
    rating: Joi.number().min(1).max(5)
});
