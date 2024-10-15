const db = require("../db/connection");

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
