const db = require("../db/connection");

const deleteComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((result) => {});
};

const incVotes = (vote, comment_id) => {
  return db
    .query(
      `
        UPDATE comments
        SET votes = $1
        WHERE comment_id = $2 RETURNING *`,
      [vote, comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ message: "Bad Request", status: 400 });
      }

      return result.rows[0];
    });
};

module.exports = { deleteComment, incVotes };
