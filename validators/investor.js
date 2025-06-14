import Joi from "joi";

export const createInvestorValidator = Joi.object({
    companyName: Joi.string().required(),
    investmentFocus: Joi.string().required(),
    contactEmail: Joi.string().email().required(),
    phone: Joi.string().optional(),
    portfolioSize: Joi.string().optional(),
});

export const updateInvestorValidator = Joi.object({
    companyName: Joi.string().optional(),
    investmentFocus: Joi.string().optional(),
    contactEmail: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    portfolioSize: Joi.string().optional(),
});
