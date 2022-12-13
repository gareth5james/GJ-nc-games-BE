const {
  selectAllReviews,
  selectReviewById,
  reviewExists,
  updateReviewVotesById,
} = require("../models/reviews.js");

exports.getReviews = (request, response, next) => {
  selectAllReviews()
    .then((reviews) => response.status(200).send({ reviews }))
    .catch(next);
};

exports.getReviewById = (request, response, next) => {
  selectReviewById(request.params.review_id)
    .then((review) => response.status(200).send({ review }))
    .catch(next);
};

exports.patchReviewVotesById = (request, response, next) => {
  const id = request.params.review_id;

  Promise.all([
    updateReviewVotesById(id, request.body.inc_votes),
    reviewExists(id),
  ])
    .then(([review]) => response.status(200).send({ review }))
    .catch(next);
};
