const db = require("../../db/connection.js");

exports.selectAllReviews = () => {
  return db
    .query(
      `SELECT reviews.*, 
    COUNT(comment_id) AS comment_count FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id 
    GROUP BY owner, title, reviews.review_id, category, review_img_url,
    reviews.created_at, reviews.votes, designer
    ORDER BY reviews.created_at DESC;`
    )
    .then((result) => result.rows);
};

exports.selectReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `No review with ID ${id} in the database`,
        });
      } else {
        return result.rows[0];
      }
    });
};
