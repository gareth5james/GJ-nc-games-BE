const { selectAllReviews } = require("../models/reviews.js");

exports.getReviews = (request, response, next) => {
  selectAllReviews()
    .then((reviews) => response.status(200).send({ reviews }))
    .catch(next);
};

exports.getReviewById = () => {};
