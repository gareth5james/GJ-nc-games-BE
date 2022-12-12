const db = require("../../db/connection.js");

exports.selectAllCategories = () => {
  return db
    .query(`SELECT * FROM categories;`)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => console.log(error));
};
