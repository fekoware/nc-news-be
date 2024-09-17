const { deleteComment } = require("../models/comments.models")


const removeComment = (req, res, next) => {

    const comment_id = req.params.comment_id

    deleteComment(comment_id).then(() => {

        res.status(204).send()
    }).catch((err) => {
        next(err)
    })
}
module.exports = { removeComment }