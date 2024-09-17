const db = require("../db/connection");
const { fetchTopics } = require("../models/topics.models");

const getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

module.exports = { getTopics };
