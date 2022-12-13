const { selectCommentsByReviewId } = require("../models/comments.js");
const { reviewExists, selectReviewById } = require("../models/reviews.js");

exports.getCommentsByReviewId = (request, response, next) => {
  const id = request.params.review_id;

  Promise.all([selectCommentsByReviewId(id), reviewExists(id)])
    .then(([comments]) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};
