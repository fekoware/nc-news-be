const express = require("express");
const { removeComment, updateVotes } = require("../controllers/comments.controller");

const commentsRouter = express.Router();


commentsRouter.route("/:comment_id")
  .delete(removeComment).patch(updateVotes); 



module.exports = commentsRouter;
