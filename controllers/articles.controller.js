const {
  selectArticleById,
  selectArticles,
  selectComments,
  updateComments,
  updateArticle,
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  const { sort_by, order_by } = req.query;
  return selectArticles(sort_by, order_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  return selectComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  return updateComments(article_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  return updateArticle(article_id, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
