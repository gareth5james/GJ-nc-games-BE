const express = require("express");
const { badPath } = require("./controllers/errors.js");
const { getCategories } = require("./controllers/categories.js");

const app = express();

app.get("/api/categories", getCategories);

app.all("*", badPath);

module.exports = app;
