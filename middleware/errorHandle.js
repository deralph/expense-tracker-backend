const { StatusCodes } = require("http-status-codes");

const errorHandler = async (err, req, res, next) => {
  const errObject = {
    statusCode: err.statusCode || 400,
    msg: err.message || "something went wrong please try again later",
  };
  if (err.name === "CastError") {
    errObject.msg = `There's no expense with the id : ${err.value}`;
    errObject.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.name === "ValidationError") {
    errObject.msg = `The input entered in is not surported`;
    errObject.statusCode = StatusCodes.NOT_ACCEPTABLE;
  }
  return res.status(errObject.statusCode).json({ errObject });
};

module.exports = errorHandler;
