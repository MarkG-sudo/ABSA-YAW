import Joi from "joi";

export const createProduceValidator = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().required(),
    category: Joi.string().lowercase().valid("grains", "vegetables", "fruits", "roots", "others").optional(),
});

export const updateProduceValidator = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    category: Joi.string().valid("grains", "vegetables", "fruits", "roots", "others").optional(),
});
