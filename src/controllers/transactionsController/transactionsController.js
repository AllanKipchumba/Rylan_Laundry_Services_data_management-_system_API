const Transaction = require("../../models/transactions");

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

        res.status(204).send();
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

//fetch all transactions of a given month (sales, credits, expenses)
const getMonthlyTransactions = async (req, res) => {
  try {
    const { month, year } = req.body;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    await Transaction.find({
      transactionDate: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    })
      .sort({ transactionDate: -1 })
      .exec()
      .then((transactions) => {
        if (!transactions) {
          return res.status(404).send(`Transaction record not found`);
        }

        const sales = transactions.filter(
          (transaction) => transaction.transactionType === "sale"
        );
        const expenditure = transactions.filter(
          (transaction) => transaction.transactionType === "expense"
        );
        const credits = transactions.filter(
          (transaction) => transaction.transactionType === "credit"
        );

        res.status(200).json({
          sales,
          expenditure,
          credits,
        });
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
  getMonthlyTransactions,
};
