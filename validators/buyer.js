import Joi from "joi";

export const createBuyerValidator = Joi.object({
    fullName: Joi.string().required(),
    deliveryAddress: Joi.string().required(),
    contactNumber: Joi.string().required(),
    preferredProduce: Joi.array().items(Joi.string()).optional()
});

export const updateBuyerValidator = Joi.object({
    fullName: Joi.string().optional(),
    deliveryAddress: Joi.string().optional(),
    contactNumber: Joi.string().optional(),
    preferredProduce: Joi.array().items(Joi.string()).optional()
});
