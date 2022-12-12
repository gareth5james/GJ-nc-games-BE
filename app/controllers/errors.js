exports.badPath = (request, response) => {
  response.status(404).send({ message: "Bad path, not found" });
};

exports.customError = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else next(error);
};

exports.sqlError = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Bad data type" });
  } else next(error);
};
