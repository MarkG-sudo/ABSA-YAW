import Joi from "joi";

export const createVendorValidator = Joi.object({
    businessName: Joi.string().required(),
    businessAddress: Joi.string().required(),
    contactNumber: Joi.string().required(),
    registrationNumber: Joi.string().optional(),
    businessType: Joi.string().optional(),
});

export const updateVendorValidator = Joi.object({
    businessName: Joi.string().optional(),
    businessAddress: Joi.string().optional(),
    contactNumber: Joi.string().optional(),
    registrationNumber: Joi.string().optional(),
    businessType: Joi.string().optional(),
});
