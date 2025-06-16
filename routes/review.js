import express from "express";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { submitReview, getProduceReviews } from "../controller/review.js";

const reviewRouter = express.Router();

reviewRouter.post(
    "/reviews",
    isAuthenticated,
    hasPermission("submit_review"),
    requireRole(["buyer"]),
    submitReview
);

reviewRouter.get(
    "/reviews/:produceId",
    isAuthenticated,
    getProduceReviews
);

export default reviewRouter;
