const { selectAllCategories } = require("../models/categories.js");

exports.getCategories = (request, response, next) => {
  selectAllCategories()
    .then((categories) => response.send({ categories }))
    .catch(next);
};
