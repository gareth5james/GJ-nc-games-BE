const reviewsRouter = require("express").Router();

const {
  getCommentsByReviewId,
  postNewComment,
} = require("../controllers/comments.js");

const {
  getReviews,
  getReviewById,
  patchReviewVotesById,
  postReview,
} = require("../controllers/reviews.js");

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewVotesById);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postNewComment);

module.exports = reviewsRouter;
