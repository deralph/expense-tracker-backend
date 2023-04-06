import { StatusCodes } from "http-status-codes"
import { Request, Response,NextFunction,ErrorRequestHandler } from "express";


const errorHandler = async (err:ErrorRequestHandler|any, req:Request, res:Response, next:NextFunction) => {
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

export default errorHandler;
