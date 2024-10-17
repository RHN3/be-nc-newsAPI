const db = require("../db/connection");

exports.removeComments = (comment_id) => {
  return db
    .query(
      `
        DELETE FROM comments
        WHERE comment_id=$1
        RETURNING *
        ;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ code: 404, msg: "Not found" });
      }
    });
};
