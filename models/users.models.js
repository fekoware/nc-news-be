const db = require("../db/connection");
const fetchUsers = () => {
  return db
    .query("SELECT * FROM users")
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { fetchUsers };
