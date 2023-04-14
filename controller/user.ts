import { StatusCodes } from "http-status-codes"
import BadRequest from "../error/BadRequest";
import Unauthorized from "../error/Unauthorized";
import User, { Iuser } from "../model/user"
import { Request, Response } from "express";


const register = async (req:Request, res:Response) => {
  const user = await User.create(req.body);
  if (!user) throw new Unauthorized("username already exist");
  const token = user.createJWT();

  res
    .status(StatusCodes.ACCEPTED)
    .cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV == "development",
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 30 * 1000,
    })
    .json({ username: user.name, isPosted: true, sucess: true });
};
const login = async (req:Request, res:Response) => {
  const { email, password }:Iuser = req.body;
  console.log({ email, password })

  if (!email || !password){
  console.log('it happened here')
    throw new BadRequest("email and password can't be vacant");
}
  const user = await User.findOne({email});
  console.log(user)

  if (!user) throw new Unauthorized("invalid credentials");

  const checkPassword = await user.checkPassword(password);
  console.log(checkPassword)

  if (!checkPassword) throw new Unauthorized("invalid credentials");

  const token = user.createJWT();

  res
    .status(StatusCodes.ACCEPTED)
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
      secure: true,
      sameSite: "none",
    })
    .json({ username: user.name, isPosted: true, sucess: true });
};
const logout = async (req:Request, res:Response) => {
  return res
    .status(StatusCodes.ACCEPTED)
    .cookie("token", "user is out", {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 30),
      sameSite: "none",
      secure: true,
    })
    .json({ msg: "user logged out", sucess: true });
};
export default {
  register,
  login,
  logout,
};
