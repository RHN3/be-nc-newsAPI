const fs = require("fs");
const express = require("express");
const app = express();

const { getTopics, getEndpoints } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");

const endpoints = require("./endpoints.json");

app.get("/api", (req, res, next) => {
  return res.status(200).send(endpoints);
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code && err.msg) {
    res.status(err.code).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
