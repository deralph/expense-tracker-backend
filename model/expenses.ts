import mongoose, { Schema, model } from "mongoose";

const ExpenseSchema = new Schema(
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
  {  timestamps: { createdAt: "createAt", updatedAt: "updateAt" }, }
);

export default model("Expenses", ExpenseSchema);
