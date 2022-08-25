const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { userId: this._id, username: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  // const serialized = serialize("cookieToken", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== "development",
  //   sameSite: "strict",
  //   maxAge: 60 * 60 * 24 * 30,
  // });
  return token;
};

userSchema.methods.checkPassword = async function (comparedPassword) {
  const isMatch = await bcrypt.compare(comparedPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Users", userSchema);
