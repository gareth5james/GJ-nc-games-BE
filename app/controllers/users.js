const { selectAllUsers } = require("../models/users.js");

exports.getUsers = (request, response, next) => {
  selectAllUsers().then((users) => response.status(200).send({ users }));
};
