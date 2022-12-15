const { selectAllUsers } = require("../models/users.js");

exports.getUsers = (request, response, next) => {
  selectAllUsers()
    .then((users) => response.status(200).send({ users }))
    .catch(next);
};

exports.getUserByUsername = (request, response, next) => {
  selectUserByUsername();
};
