const db = require("../../db/connection.js");

exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => result.rows);
};

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "User not found",
        });
      } else {
        console.log(result.rows[0]);
        return result.rows[0];
      }
    });
};
