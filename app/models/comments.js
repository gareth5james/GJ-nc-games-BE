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

exports.addNewComment = (id, comment) => {
  return db
    .query(
      `INSERT INTO comments 
  (body, review_id, author, votes, created_at)
  VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [comment.body, id, comment.username, 0, new Date(Date.now())]
    )
    .then((result) => result.rows[0]);
};
