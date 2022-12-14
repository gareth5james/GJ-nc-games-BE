const db = require("../../db/connection.js");

exports.selectAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((result) => {
    return result.rows;
  });
};

exports.categoryExists = (categoryName) => {
  return db
    .query(`SELECT * FROM categories WHERE slug = $1`, [categoryName])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Item not found",
        });
      } else {
        return Promise.resolve(true);
      }
    });
};
