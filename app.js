const express = require("express");
const app = express();

const { getTopics, getEndpoints } = require("./controllers/topics.controller");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
