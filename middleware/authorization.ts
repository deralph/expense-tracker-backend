import { Request, Response, NextFunction } from "express";

import BadRequest from "../error/BadRequest";
import Unauthorized from "../error/Unauthorized";
import jwt, { JwtPayload } from "jsonwebtoken"

interface Decoded extends Request {
  user: {
    userId: string;
    username: string;
  };
}


const authMiiddleware = (req:Request, res:Response, next:NextFunction) => {
 
  const token = req.cookies.token;
  console.log(token);

  if (!token || token === "user is out") {
    throw new Unauthorized("no token available");
  }

  const secret: string = process.env.JWT_SECRET!;

  const decoded = jwt.verify(token, secret) as JwtPayload;
  if (!decoded) {
    throw new BadRequest("something went wrong");
  }
  (req as Decoded).user = { userId: decoded.userId, username: decoded.username };
  next();
};

export default authMiiddleware;
