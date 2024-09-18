const express = require("express");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchArticle
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();


articlesRouter.route("/")
  .get(getArticles);  

articlesRouter.route("/:article_id")
  .get(getArticleById)  
  .patch(patchArticle); 

articlesRouter.route("/:article_id/comments")
  .get(getCommentsByArticleId)  
  .post(postComment);  

module.exports = articlesRouter;
