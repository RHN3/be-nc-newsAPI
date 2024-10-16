const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = () => {
  return db
    .query(
      `
   SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.article_id) AS comment_count 
   FROM articles 
   LEFT JOIN comments ON comments.article_id = articles.article_id
   GROUP BY articles.article_id
   ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = async (article_id) => {
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
