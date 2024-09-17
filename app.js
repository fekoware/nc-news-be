const cors = require('cors');
const express = require("express");
const db = require("./db/connection");
const { getTopics } = require("./controllers/topics.controller");
const endpoints = require("./endpoints.json");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchArticle,
} = require("./controllers/articles.controller");

const { removeComment } = require("./controllers/comments.controller");

const { getUsers } = require("./controllers/users.controller");

const app = express();
app.use(cors());

app.use(express.json());

//get

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getUsers);

//post & patch
app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

//delete

app.delete("/api/comments/:comment_id", removeComment);

//error handling
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);

  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  }
  next(err);
  if (err.code === "23503") {
    res.status(404).send({ message: "Bad Request" });
  }
  next(err);
});

module.exports = app;
