import ReviewModel from "../model/review.js";
import { createReviewValidator } from "../validators/review.js";

export const submitReview = async (req, res, next) => {
    try {
        const buyerId = req.auth.id;
        const { error, value } = createReviewValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const existing = await ReviewModel.findOne({
            buyerId,
            produceId: value.produceId
        });
        if (existing) {
            return res.status(400).json({ message: "You have already reviewed this produce." });
        }

        const review = await ReviewModel.create({
            ...value,
            buyerId
        });

        res.status(201).json({ message: "Review submitted", review });
    } catch (err) {
        next(err);
    }
};

export const getProduceReviews = async (req, res, next) => {
    try {
        const { produceId } = req.params;
        const reviews = await ReviewModel.find({ produceId }).populate("buyerId", "firstName lastName");
        res.status(200).json(reviews);
    } catch (err) {
        next(err);
    }
};