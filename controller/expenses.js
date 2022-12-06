const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../error");
const Expenses = require("../model/expenses");
const GetAllExpenses = async (req, res) => {
  const { userId, username } = req.user;
  const expenses = await Expenses.find({ createdBy: userId });
  if (!expenses) {
    return res.json({ msg: "no expense found" });
  }
  res
    .status(StatusCodes.OK)
    .json({ expenses, count: expenses.length, user: username });
};
const createExpense = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const expense = await Expenses.create(req.body);
  res.status(StatusCodes.OK).json({ expense });
};
const updateExpense = async (req, res) => {
  const {
    user: { userId },
    params: { id: expenseId },
    body,
  } = req;
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
const deleteExpense = async (req, res) => {
  const {
    user: { userId },
    params: { id: expenseId },
  } = req;
  const expense = await Expenses.findByIdAndDelete({
    _id: expenseId,
    createdBy: userId,
  });
  if (!expense) {
    throw new BadRequest(`there is no expense with the id : ${expenseId}`);
  }
  res.status(StatusCodes.OK).json({ message: "expense deleted" });
};
const GetSingleExpense = async (req, res) => {
  const {
    user: { userId },
    params: { id: expenseId },
  } = req;
  const expense = await Expenses.findOne({ _id: expenseId, createdBy: userId });
  if (!expense) {
    throw new BadRequest(`there is no expense with tthe id : ${expenseId}`);
  }
  res.status(StatusCodes.OK).json({ expense });
};

module.exports = {
  GetAllExpenses,
  GetSingleExpense,
  createExpense,
  deleteExpense,
  updateExpense,
};
