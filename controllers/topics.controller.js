const { selectTopics } = require("../models/topics.model");
const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  return res.status(200).send(endpoints);
};

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
