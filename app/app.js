const express = require("express");
const { badPath } = require("./controllers/errors.js");
const { getCategories } = require("./controllers/categories.js");
const { getReviews } = require("./controllers/reviews.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.all("*", badPath);

module.exports = app;
