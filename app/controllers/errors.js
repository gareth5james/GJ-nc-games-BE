exports.badPath = (request, response) => {
  response.status(404).send({ message: "Bad path, not found" });
};
