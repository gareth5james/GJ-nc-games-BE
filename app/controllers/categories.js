const { selectAllCategories } = require("../models/categories.js");

exports.getCategories = (request, response, next) => {
  console.log("got to the controller");
  selectAllCategories()
    .then((categories) => response.send({ categories }))
    .catch(next);
};
