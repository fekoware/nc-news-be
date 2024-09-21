const db = require("../db/connection");
const { fetchTopics, insertTopic } = require("../models/topics.models");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const postTopic = (req, res, next) => {
  slug = req.body.slug;
  description = req.body.description;

  insertTopic(slug, description)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, postTopic };
