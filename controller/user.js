const { StatusCodes } = require("http-status-codes");
const { BadRequest, Unauthorized } = require("../error");
const User = require("../model/user");

const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();

  // res.setHeader("Set-Cookie", token);
  res
    .status(StatusCodes.ACCEPTED)
    .cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV == "development",
      // secure: true,
      sameSite: "none",
      // origin: "http://localhost:3000",
      maxAge: 60 * 60 * 24 * 30 * 1000,
    })
    .json({ username: user.name, isPosted: true, sucess: true });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequest("email and password can't be vacant");

  const user = await User.findOne({ email });

  if (!user) throw new Unauthorized("invalid credentials");

  const checkPassword = await user.checkPassword(password);

  if (!checkPassword) throw new Unauthorized("invalid credentials");

  const token = user.createJWT();

  // res.setHeader("Set-Cookie", token);
  res
    .status(StatusCodes.ACCEPTED)
    // .setHeader("Set-Cookie", token)
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
      // domain: "http://localhost:3000",
      // secure: true,
      sameSite: "none",
      // maxAge: 60 * 60 * 24 * 30,
    })
    .json({ username: user.name, isPosted: true, sucess: true });
};
const logout = async (req, res) => {
  return res
    .status(StatusCodes.ACCEPTED)
    .cookie("token", "user is out", {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 30),
      sameSite: none,
    })
    .json({ msg: "user logged out", sucess: true });
};
module.exports = {
  register,
  login,
  logout,
};
