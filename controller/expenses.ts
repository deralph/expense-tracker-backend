import StatusCodes from "http-status-codes";
import BadRequest from "../error/BadRequest";
import Expenses from "../model/expenses";
import { Request, Response } from "express";

interface Decoded extends Request {
  user: {
    userId: String;
    username: String;
  };
}

const GetAllExpenses = async (req:Request, res:Response) => {
  const { userId, username } = (req as Decoded).user;
  const expenses = await Expenses.find({ createdBy: userId });
  if (!expenses) {
    return res.json({ msg: "no expense found" });
  }
  res
    .status(StatusCodes.OK)
    .json({ expenses, count: expenses.length, user: username });
};
const createExpense = async (req:Request, res:Response) => {
  req.body.createdBy = (req as Decoded).user.userId;
  const expense = await Expenses.create(req.body);
  res.status(StatusCodes.OK).json({ expense });
};
const updateExpense = async (req:Request, res:Response) => {
  const {
    user: { userId },
    params: { id: expenseId },
    body,
  } = (req as Decoded);
  if (!body) {
    throw new BadRequest("no value to update");
  }
  const expense = await Expenses.findOneAndUpdate(
    { _id: expenseId, createdBy: userId },
    body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ expense });
};
const deleteExpense = async (req:Request, res:Response) => {
  const {
    user: { userId },
    params: { id: expenseId },
  } = (req as Decoded);
  const expense = await Expenses.findByIdAndDelete({
    _id: expenseId,
    createdBy: userId,
  });
  if (!expense) {
    throw new BadRequest(`there is no expense with the id : ${expenseId}`);
  }
  res.status(StatusCodes.OK).json({ message: "expense deleted" });
};
const GetSingleExpense = async (req:Request, res:Response) => {
  const {
    user: { userId },
    params: { id: expenseId },
  } = (req as Decoded);
  const expense = await Expenses.findOne({ _id: expenseId, createdBy: userId });
  if (!expense) {
    throw new BadRequest(`there is no expense with tthe id : ${expenseId}`);
  }
  res.status(StatusCodes.OK).json({ expense });
};

export default {
  GetAllExpenses,
  GetSingleExpense,
  createExpense,
  deleteExpense,
  updateExpense,
};
