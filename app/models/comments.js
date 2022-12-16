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

exports.commentExists = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Comment not found",
        });
      } else {
        return Promise.resolve(true);
      }
    });
};

exports.dropComment = (id) => {
  return db
    .query(
      `DELETE FROM comments 
    WHERE comment_id = $1 RETURNING *;`,
      [id]
    )
    .then((response) => {
      return response;
    });
};

exports.updateCommentById = (id, incVotes) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [incVotes, id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
