const db = require("../db/connection");
const { topicData } = require("../db/data/test-data");

const fetchArticleById = (id) => {
  return db
    .query(`SELECT articles.*, COUNT(comments.article_id) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;

      
      ;`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ message: "Not Found", status: 404 });
      }

      return result.rows[0];
    });
};

const checkTopics = (topic) => {
  return db
    .query(
      `SELECT * FROM topics
      WHERE slug = $1`,
      [topic]
    )
    .then((result) => {

      if (result.rows.length > 0 || topic === undefined) {
        return result.rows.slug;
      } else if (result.rows.length === 0) {
        return Promise.reject({ status: 400, message: "Bad Request" });
      }
    });
};

const fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const allowedOrders = ["asc", "desc"];

  const allowedSortBy = [
    "comment_count",
    "votes",
    "author",
    "body",
    "created_at",
    "article_img_url",

  ];


  if (!allowedOrders.includes(order) || !allowedSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }
  let queryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) 
      AS comment_count from articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryParams = [];

  if (topic) {
    queryParams.push(topic);
    queryStr += ` WHERE articles.topic = $1`;
  }

  queryStr += ` GROUP BY articles.article_id
        ORDER BY articles.${sort_by} ${order};`;

  return db
    .query(queryStr, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      next(err);
    });
};

const fetchCommentsByArticleId = (articleId, order = "desc") => {
  const allowedOrders = ["asc", "desc"];

  if (!allowedOrders.includes(order)) {
    return Promise.reject({ status: 400, message: "BNad Request" });
  }

  return db
    .query(
      `SELECT * from comments WHERE article_id = $1 ORDER BY created_at ${order}`,
      [articleId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ message: "Not Found", status: 404 });
      }
      return result.rows;
    });
};

const insertComment = (username, body, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ message: "Bad Request", status: 404 });
      }
      return result.rows[0];
    });
};

const updateArticle = (article_id, voteAmount) => {
  return db
    .query(
      `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`,
      [voteAmount, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ message: "Bad Request", status: 400 });
      }

      return result.rows[0];
    });
};

module.exports = {
  fetchCommentsByArticleId,
  fetchArticles,
  fetchArticleById,
  insertComment,
  updateArticle,
  checkTopics,
};
