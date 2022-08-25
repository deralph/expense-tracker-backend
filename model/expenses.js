const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Cloth",
        "Accesories",
        "Grocery",
        "Drinks",
        "Foods",
        "Electric",
        "Home",
        "Transport",
        "Micellenous",
        "Others",
      ],
    },
    date: {
      type: Date,
      required: true,
    },
    description: { type: String, trim: true },

    price: {
      type: Number,
      required: true,
    },
    productNo: {
      type: Number,
      required: true,
      default: 1,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Expenses", ExpenseSchema);
