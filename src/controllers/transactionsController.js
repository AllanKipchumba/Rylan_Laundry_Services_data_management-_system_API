const Transaction = require("../models/transactions");

//create a transaction
const createNewTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

//fetch a transaction
const fetchTransaction = async (req, res) => {
  try {
    await Transaction.findOne({ _id: req.params.id })
      .exec()
      .then((transaction) => {
        if (!transaction) {
          return res.status(404).send(`Transaction record not found`);
        }

        res.status(200).json(transaction);
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

//update a transacton
const editTransaction = async (req, res) => {
  try {
    await Transaction.findOne({ _id: req.params.id })
      .exec()
      .then(async (transaction) => {
        if (!transaction) {
          return res.status(404).send(`Transaction record not found`);
        }

        const updates = Object.keys(req.body);

        updates.forEach((update) => (transaction[update] = req.body[update]));

        await transaction.save();

        res.status(202).json(transaction);
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

//delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id })
      .exec()
      .then((transaction) => {
        if (!transaction) {
          return res.status(404).send(`Transaction record not found`);
        }

        res.status(204);
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = {
  createNewTransaction,
  fetchTransaction,
  editTransaction,
  deleteTransaction,
};
