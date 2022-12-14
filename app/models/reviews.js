const db = require("../../db/connection.js");

exports.selectAllReviews = (category, sort_by = "created_at") => {
  let modularQuery = `SELECT reviews.*, 
  COUNT(comment_id) AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  const queryArray = [];

  if (category) {
    modularQuery += ` WHERE category = $1`;

    queryArray.push(category);
  }

  modularQuery += ` GROUP BY owner, title, reviews.review_id, category, review_img_url,
  reviews.created_at, reviews.votes, designer`;

  if (category) {
    modularQuery += ` ORDER BY $2 DESC;`;
  } else {
    modularQuery += ` ORDER BY $1 DESC;`;
  }

  queryArray.push(`${sort_by}`);

  console.log(modularQuery, queryArray);

  return db.query(modularQuery, queryArray).then((result) => result.rows);
};

exports.selectReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Review not found",
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.reviewExists = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Review not found",
        });
      } else {
        return Promise.resolve(true);
      }
    });
};

exports.updateReviewVotesById = (id, incVotes) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`,
      [incVotes, id]
    )
    .then((result) => result.rows[0]);
};
