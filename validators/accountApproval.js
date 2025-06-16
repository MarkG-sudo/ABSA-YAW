import Joi from "joi";

export const updateUserStatusValidator = Joi.object({
    status: Joi.string().valid("approved", "suspended").required(),
});
