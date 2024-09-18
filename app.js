const cors = require('cors');
const express = require("express");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(cors());
app.use(express.json());

// Mount the routers
app.use("/api", apiRouter);

// Error handling
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  }
  if (err.code === "23503") {
    res.status(404).send({ message: "Bad Request" });
  }
  next(err);
});

module.exports = app;
