const { selectAllReviews, selectReviewById } = require("../models/reviews.js");

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
