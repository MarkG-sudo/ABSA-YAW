import Joi from "joi";


export const createInvestmentValidator = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Title is required."
    }),
    description: Joi.string().optional(),
    roi: Joi.number().min(0).required().messages({
        "number.base": "ROI must be a number.",
        "any.required": "ROI is required."
    }),
    amountRequired: Joi.number().min(0).required().messages({
        "number.base": "Amount is required.",
        "any.required": "Amount is required."
    }),
    durationMonths: Joi.number().min(1).required().messages({
        "number.base": "Duration must be a number.",
        "any.required": "Duration is required."
    }),
    deadline: Joi.date().optional(),
    location: Joi.string().required().messages({
        "string.empty": "Location is required."
    }),
    status: Joi.string().lowercase().valid("open", "closed").required().messages({
        "any.only": "Status must be 'open' or 'closed'.",
        "any.required": "Status is required."
    })
});


export const updateInvestmentValidator = Joi.object({
    title: Joi.string().messages({
        "string.empty": "Title cannot be empty."
    }),
    description: Joi.string(),
    roi: Joi.number().min(0).messages({
        "number.base": "ROI must be a number."
    }),
    amountRequired: Joi.number().min(0).messages({
        "number.base": "Amount must be a number."
    }),
    durationMonths: Joi.number().min(1).messages({
        "number.base": "Duration must be a number."
    }),
    deadline: Joi.date(),
    location: Joi.string().messages({
        "string.empty": "Location cannot be empty."
    }),
    status: Joi.string().lowercase().valid("open", "closed").messages({
        "any.only": "Status must be 'open' or 'closed'."
    })
}).min(1).messages({
    "object.min": "At least one field must be updated."
});


export const investorApplicationValidator = Joi.object({
    principal: Joi.number().required(),
    paymentMethod: Joi.string().valid("bank", "mobile_money").required(),
    paymentDetails: Joi.object({
        accountNumber: Joi.string().optional(),
        accountName: Joi.string().optional(),
        mobileNumber: Joi.string().optional(),
        mobileName: Joi.string().optional(),
        bank: Joi.string().optional(),
        branch: Joi.string().optional(),
        swiftCode: Joi.string().optional(),
    }),
    nextOfKin: Joi.string().optional(),
    contactDetails: Joi.object({
        phone: Joi.string().required(),
        email: Joi.string().required(),
        address: Joi.string().required()
    }).required(),
});