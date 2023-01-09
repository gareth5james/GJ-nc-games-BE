const express = require("express");
const { badPath, sqlError, customError } = require("./controllers/errors.js");

const apiRouter = require("./routers/apiRouter.js");

const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", badPath);
app.use(customError);
app.use(sqlError);

module.exports = app;
