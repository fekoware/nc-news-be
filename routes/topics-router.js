const express = require("express");
const { getTopics, postTopic } = require("../controllers/topics.controller");

const topicsRouter = express.Router();

topicsRouter.route("/")
  .get(getTopics).post(postTopic);  

module.exports = topicsRouter;
