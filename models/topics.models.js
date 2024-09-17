const db = require("../db/connection")

const fetchTopics = () => {

    return db.query('SELECT * from topics').then(({rows}) => {
        return rows
    })
}

module.exports = { fetchTopics }