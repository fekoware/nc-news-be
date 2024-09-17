const db = require("../db/connection");

const deleteComment = (comment_id) => {
  


    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id]).then((result) => { 


       
    })
}

module.exports = { deleteComment }