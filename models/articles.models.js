const db = require("../db/connection");
const { topicData } = require("../db/data/test-data");

const fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;

      
      ;`,
      [id]
    )
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

const fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p
) => {
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
    queryStr += ` WHERE articles.topic = $${queryParams.length}`;
  }

  queryStr += ` GROUP BY articles.article_id
          ORDER BY articles.${sort_by} ${order}
          LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};`;

  const offset = (p - 1) * limit;
  queryParams.push(limit, offset);

  return db
    .query(queryStr, queryParams)
    .then((result) => {
      resultArray = [];
      const total_count = result.rows.length;
      resultArray.push(total_count);
      resultArray.push(result.rows);
      return resultArray;
    })
    .catch((err) => {
      next(err);
    });
};

const fetchCommentsByArticleId = (articleId, order = "desc", limit = 10, p) => {
  const allowedOrders = ["asc", "desc"];

  if (!allowedOrders.includes(order)) {
    return Promise.reject({ status: 400, message: "BNad Request" });
  }

  let queryStr = `SELECT * from comments WHERE article_id = $1 ORDER BY created_at ${order} `;

  let queryParams = [articleId];

  const offset = (p - 1) * limit;

  queryStr += `LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  };`;

  queryParams.push(limit, offset);

  return db.query(queryStr, queryParams).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ message: "Not Found", status: 404 });
    }
    console.log(result, "inside model");
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

const insertArticle = (author, title, body, topic, article_img_url = null) => {
  return db
    .query(
      `INSERT INTO articles (author,
title,
body,
topic,
article_img_url)
VALUES ($1, $2, $3, $4, $5)
 RETURNING *`,
      [author, title, body, topic, article_img_url]
    )
    .then((result) => {
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
  insertArticle,
};
