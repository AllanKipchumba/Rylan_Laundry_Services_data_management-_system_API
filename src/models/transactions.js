const mongoose = require("mongoose");

const TransactionsSchema = new mongoose.Schema({
  transactionsDate: {
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
    type: Object,
    required: true,
    properties: {
      client: { type: String },
      item: { type: String },
      creditor: { type: String },
    },
  },
});

const Transaction = mongoose.model("Transaction", TransactionsSchema);
module.exports = Transaction;
