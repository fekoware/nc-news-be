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

const fetchUser = (username) => {


  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      console.log(result.rows)
        console.log("inside model")
      if (result.rows.length === 0) {
        return Promise.reject({ message: "Username Not Found", status: 404 });
      }

      console.log("inside model result")
      return result.rows[0];
    });
};

module.exports = { fetchUsers, fetchUser };
