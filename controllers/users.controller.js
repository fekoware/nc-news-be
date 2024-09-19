const { use } = require("../app");
const { fetchUsers, fetchUser } = require("../models/users.models");

const getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

const getUser = (req, res, next) => {

  const {username} = req.params

  fetchUser(username).then((user) => {
    res.status(200).send({user});
  })
}

module.exports = { getUsers, getUser};
