const express = require("express");
const { badPath, sqlError, customError } = require("./controllers/errors.js");
const { getCategories } = require("./controllers/categories.js");
const { getReviews, getReviewById } = require("./controllers/reviews.js");
const { getCommentsByReviewId } = require("./controllers/comments.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.all("*", badPath);

app.use(customError);
app.use(sqlError);

module.exports = app;
