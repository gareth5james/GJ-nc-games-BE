const {
  selectCommentsByReviewId,
  addNewComment,
} = require("../models/comments.js");

const { reviewExists } = require("../models/reviews.js");

exports.getCommentsByReviewId = (request, response, next) => {
  const id = request.params.review_id;

  Promise.all([selectCommentsByReviewId(id), reviewExists(id)])
    .then(([comments]) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

exports.postNewComment = (request, response, next) => {
  const id = request.params.review_id;

  Promise.all([addNewComment(id, request.body), reviewExists(id)])
    .then(([comment]) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};
