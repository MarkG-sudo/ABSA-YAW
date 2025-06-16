import Joi from "joi";

export const createReviewValidator = Joi.object({
    produceId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow("")
});
