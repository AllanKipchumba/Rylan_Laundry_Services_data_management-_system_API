const Transactions = require("../models/transactions");

const getMonthlyTotals = async (req, res) => {
  try {
    const { month, year } = req.body;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const salesTotal = await Transactions.aggregate([
      {
        $match: {
          transactionDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          transactionType: "sale",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const creditsTotal = await Transactions.aggregate([
      {
        $match: {
          transactionDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          transactionType: "credit",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const expensesTotal = await Transactions.aggregate([
      {
        $match: {
          transactionDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          transactionType: "expense",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const sales = salesTotal[0] ? salesTotal[0].total : 0;
    const credits = creditsTotal[0] ? creditsTotal[0].total : 0;
    const expenses = expensesTotal[0] ? expensesTotal[0].total : 0;

    const deductions = credits + expenses;
    const businessRevenue = 0.4 * sales;
    const profit = businessRevenue - deductions;

    res.status(200).send({
      sales,
      credits,
      expenses,
      deductions,
      businessRevenue,
      profit,
    });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { getMonthlyTotals };
