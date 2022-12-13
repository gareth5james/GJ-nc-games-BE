const db = require("../../db/connection.js");

exports.selectCommentsByReviewId = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 
        ORDER BY created_at DESC`,
      [id]
    )
    .then((result) => result.rows);
};
