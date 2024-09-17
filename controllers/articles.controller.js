const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateArticle,
  checkTopics
} = require("../models/articles.models");

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  const order = req.query.order;
  const sort_by = req.query.sort_by;
  const topic = req.query.topic;

  checkTopics(topic).then(() => {
    return fetchArticles(sort_by, order, topic)
  }).then((articles) => {
    res.status(200).send({ articles });
  })
  .catch((err) => {
    next(err);
  });

  
    
};

const getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

//post

const postComment = (req, res, next) => {
  const username = req.body.username;
  const body = req.body.body;

  const { article_id } = req.params;
  insertComment(username, body, article_id)
    .then((comment) => {
      res.status(201).send({comment});
    })
    .catch((err) => {
      next(err);
    });
};

//patch

const patchArticle = (req, res, next) => {
  article_id = req.params.article_id;
  voteAmount = req.body.vote;

  updateArticle(article_id, voteAmount)
    .then((article) => {
      res.status(200).send({article});
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCommentsByArticleId,
  getArticles,
  getArticleById,
  postComment,
  patchArticle,
};
