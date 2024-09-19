const { deleteComment, incVotes } = require("../models/comments.models")


const removeComment = (req, res, next) => {

    const comment_id = req.params.comment_id

    deleteComment(comment_id).then(() => {

        res.status(204).send()
    }).catch((err) => {
        next(err)
    })
}

const updateVotes = (req, res, next) => {
    const {inc_votes} = req.body
    const {comment_id} = req.params

    incVotes(inc_votes, comment_id).then((comment) => {
        console.log(comment)
        res.status(200).send(comment)
    })
    
    
}
module.exports = { removeComment, updateVotes}