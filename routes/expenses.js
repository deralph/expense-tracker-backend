const express = require("express");
const {
  createExpense,
  GetAllExpenses,
  GetSingleExpense,
  updateExpense,
  deleteExpense,
} = require("../controller/expenses");
const router = express.Router();

router.route("/").post(createExpense).get(GetAllExpenses);
router
  .route("/:id")
  .get(GetSingleExpense)
  .patch(updateExpense)
  .delete(deleteExpense);

module.exports = router;
