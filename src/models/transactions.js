const mongoose = require("mongoose");

const TransactionsSchema = new mongoose.Schema({
  transactionDate: {
    type: Date,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["sale", "expense", "credit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: "object",
    oneOf: [
      {
        required: ["client"],
      },
      {
        required: ["item"],
      },
      {
        required: ["creditor"],
      },
      {
        required: ["client", "item"],
      },
      {
        required: ["client", "creditor"],
      },
      {
        required: ["item", "creditor"],
      },
      {
        required: ["client", "item", "creditor"],
      },
    ],
    properties: {
      client: {
        type: "string",
      },
      item: {
        type: "string",
      },
      creditor: {
        type: "string",
      },
    },
  },
});

const Transaction = mongoose.model("Transaction", TransactionsSchema);
module.exports = Transaction;
