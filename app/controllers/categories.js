const { selectAllCategories } = require("../models/categories.js");

exports.getCategories = (request, response, next) => {
  selectAllCategories()
    .then((categories) => response.status(200).send({ categories }))
    .catch(next);
};
