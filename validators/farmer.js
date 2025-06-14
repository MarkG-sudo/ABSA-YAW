import Joi from 'joi';

export const createFarmerValidator = Joi.object({
    farmSize: Joi.string().required().messages({
        "string.empty": "Farm size is required."
    }),
    cropTypes: Joi.array().items(Joi.string()).min(1).required().messages({
        "array.min": "At least one crop type must be specified.",
        "any.required": "Crop types are required."
    }),
    region: Joi.string().required().messages({
        "string.empty": "Region is required."
    }),
    experienceYears: Joi.number().min(0).required().messages({
        "number.base": "Experience must be a number.",
        "any.required": "Experience is required."
    })
});

export const updateFarmerValidator = Joi.object({
    farmSize: Joi.string().optional(),
    cropTypes: Joi.array().items(Joi.string()).optional(),
    region: Joi.string().optional(),
    experienceYears: Joi.number().min(0).optional()
});
