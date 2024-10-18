const db = require("../db/connection");
const format = require("pg-format");
const articles = require("../db/data/test-data/articles");

exports.selectArticles = (sort_by = `created_at`, order_by = "DESC") => {
  return db
    .query(
      format(
        `
   SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.article_id) AS comment_count 
   FROM articles 
   LEFT JOIN comments ON comments.article_id = articles.article_id
   GROUP BY articles.article_id
   ORDER BY articles.%I %s;`,
        sort_by,
        order_by
      )
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles WHERE article_id = $1
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectComments = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE article_id=$1
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "Not found" });
      }
      return rows;
    });
};

exports.updateComments = (article_id, reqBody) => {
  if (!Object.keys(reqBody).length) {
    return Promise.reject({ code: 422, msg: "Unprocessable content" });
  }
  return db
    .query(
      format(
        `
    INSERT INTO comments (author,body,article_id)
    VALUES (%L,%L,%L)
    RETURNING *
    `,
        reqBody.username,
        reqBody.body,
        article_id
      )
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticle = (article_id, reqBody) => {
  if (!Object.keys(reqBody).length) {
    return Promise.reject({ code: 422, msg: "Unprocessable content" });
  }
  return db
    .query(
      format(
        `
    UPDATE articles
    SET 
    votes= votes + %L
    WHERE article_id = %L
    RETURNING *
    ;`,
        Object.values(reqBody)[0],
        article_id
      )
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 400, msg: "Bad request" });
      }
      return rows[0];
    });
};
