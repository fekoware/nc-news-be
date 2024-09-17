const db = require("../db/connection")

const getEndpoints = (req, res, next) => {

    res.status(200).send({endpoints: endpoints})
}
module.exports = {getEndpoints}