import express from "express"
import expense from "../controller/expenses"
const router = express.Router();

const  {
  createExpense,
  GetAllExpenses,
  GetSingleExpense,
  updateExpense,
  deleteExpense,
} = expense

router.route("/").post(createExpense).get(GetAllExpenses);
router
  .route("/:id")
  .get(GetSingleExpense)
  .patch(updateExpense)
  .delete(deleteExpense);

export default router;
