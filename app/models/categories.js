const db = require("../../db/connection.js");

exports.selectAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((result) => {
    console.log(result.rows);
    return result.rows;
  });
};
