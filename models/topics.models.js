const db = require("../db/connection");

const fetchTopics = () => {
  return db.query("SELECT * from topics").then(({ rows }) => {
    return rows;
  });
};

const insertTopic = (slug, description) => {
  return db
    .query(
      `INSERT INTO topics
        (slug, description)
        VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { fetchTopics, insertTopic };
