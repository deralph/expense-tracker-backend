const { StatusCodes } = require("http-status-codes");
const customError = require("./customError");

class Unauthorized extends customError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
