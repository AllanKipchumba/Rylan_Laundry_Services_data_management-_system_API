const Transaction = require("../models/transactions");

const createNewTransaction = async (req, res) => {
  if (!req?.body)
    return res.status(400).json({ mesage: "No transaction provided!" });

  try {
    const transaction = new Transaction({
      ...req.body,
    });
    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
    console.log(error);
  }
};

const fetchTransactions = async (req, res) => {
  try {
    await Transaction.find()
      .exec()
      .then((transactions) => {
        res.status(200).send(transactions);
      });
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
    console.log(error);
  }
};

const fetchTransaction = async (req, res) => {};

const editTransaction = async (req, res) => {};

const deleteTransaction = async (req, res) => {};

module.exports = {
  createNewTransaction,
  editTransaction,
  deleteTransaction,
  fetchTransactions,
  fetchTransaction,
};
