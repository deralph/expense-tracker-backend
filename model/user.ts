import  { Schema, model } from "mongoose";

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Unauthorized from "../error/Unauthorized";

export interface Iuser {
  name?: string;
  email: string;
  password: string | any;
  createdAt?: Date;
}

interface res{
  _id: string
    name: string
    email: string
    password: string
    createdAt: string
    __v?: number
}
export interface IuserModel extends Iuser {
  // findByCredentials: (email: String,password:string) => any;
  checkPassword: (comparedPassword:string) => boolean;
  createJWT: () => string;
  createUser: (body: Iuser) => any;
  findOne: (email:string) => any;
   }

const userSchema:Schema<IuserModel> = new Schema({
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

const secret: string = process.env.JWT_SECRET!;

userSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { userId: this._id, username: this.name },
    secret,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  return token;
};

userSchema.methods.checkPassword = async function (comparedPassword:string) {
  const isMatch = await bcrypt.compare(comparedPassword, this.password);
  return isMatch;
};

userSchema.methods.createUser = async function (body: Iuser) {
  return await this.create(body);
};
userSchema.methods.findOne = async function (email:string) {
  return await this.find({email});
};

export default model("Users", userSchema);
