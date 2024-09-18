const express = require("express");
const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");

const apiRouter = express.Router();

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.route("/")
  .get((req, res) => {
    res.status(200).send({ endpoints: require("../endpoints.json") });
  });

module.exports = apiRouter;
