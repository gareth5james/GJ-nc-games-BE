const db = require("../../db/connection.js");

exports.selectAllReviews = (
  category,
  sort_by = "created_at",
  order = "desc"
) => {
  let modularQuery = `SELECT reviews.*, 
  COUNT(comment_id) AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  const sort_by_green = [
    "review_id",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];

  const order_green = ["asc", "desc"];

  if (!sort_by_green.includes(sort_by) || !order_green.includes(order))
    return Promise.reject({ status: 400, message: "Not allowed" });

  const queryArray = [];

  if (category) {
    modularQuery += ` WHERE category = $1`;

    queryArray.push(category);
  }

  modularQuery += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;

  return db.query(modularQuery, queryArray).then((result) => {
    return result.rows;
  });
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
