const apiRouter = require("express").Router();
const categoriesRouter = require("../routers/categoriesRouter");
const reviewsRouter = require("../routers/reviewsRouter");
const commentsRouter = require("../routers/commentsRouter");
const usersRouter = require("../routers/usersRouter");

const { getApi } = require("../controllers/api");

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.route("/").get(getApi);

module.exports = apiRouter;
