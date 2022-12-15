const fs = require("fs/promises");

exports.getApi = (request, response, next) => {
  fs.readFile("./endpoints.json", "utf-8")
    .then((result) =>
      response.status(200).send({ endPoints: JSON.parse(result) })
    )
    .catch(next);
};
