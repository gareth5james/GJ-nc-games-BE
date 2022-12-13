exports.badPath = (request, response) => {
  response.status(404).send({ msg: "Bad path, not found" });
};

exports.customError = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ msg: error.message });
  } else next(error);
};

exports.sqlError = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad data type" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "Item not found" });
  } else next(error);
};
