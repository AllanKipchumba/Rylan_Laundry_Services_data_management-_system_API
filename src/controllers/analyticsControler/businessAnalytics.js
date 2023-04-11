const Transactions = require("../../models/transactions");
const sortDataByYear = require("./sortData");

//get a record of total sales made and revenue generated
const grossSales = async (req, res) => {
  try {
    await Transactions.aggregate([
      { $match: { transactionType: "sale" } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ])
      .exec()
      .then((results) => {
        if (!results) {
          return res.status(404).send(`Transaction record not found`);
        }

        const result = results[0];
        const totalNumberOfSales = result.count;
        const totalAmountMadeFromSales = result.totalAmount;

        res.status(200).send({ totalNumberOfSales, totalAmountMadeFromSales });
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

//get a record of the frequency and total revenue from a client
const clientRecord = async (req, res) => {
  try {
    const { clientName: client } = req.params;

    await Transactions.aggregate([
      {
        $match: {
          transactionType: "sale",
          "description.client": { $regex: new RegExp(client, "i") },
        },
      },
      {
        $group: {
          _id: "$description.client",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ])
      .exec()
      .then((results) => {
        if (results.length === 0) {
          return res
            .status(404)
            .send(`No transactions found for client: ${client}`);
        }

        const clientRecord = results[0];
        res.status(200).send({ clientRecord });
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

//get a record of transaction history with a client
const clientTransactionHistory = async (req, res) => {
  const { clientName } = req.params;
  const regex = new RegExp(clientName, "i"); // "i" flag makes the regex case-insensitive

  try {
    await Transactions.aggregate([
      {
        $match: {
          "description.client": { $regex: regex },
        },
      },
      {
        $sort: { transactionDate: -1 },
      },
    ])
      .exec()
      .then((transactions) => {
        if (transactions.length === 0) {
          return res.status(404).json({ error: "No transactions found" });
        }

        res.status(200).json(transactions);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
};

//get a record of all clients served
const clients = async (req, res) => {
  try {
    await Transactions.aggregate([
      {
        $group: {
          _id: "$description.client",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]).then((clients) => {
      if (clients.length === 0) {
        return res.status(404).json({ error: "No transactions found" });
      }

      //gets the total number of clients served
      const clientsServed = clients.length;

      res.status(200).json({ clientsServed, clients });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// get a record of the total revenue from a client per month per year
const RevenueFromClient = async (req, res) => {
  const { clientName: client } = req.params;

  try {
    await Transactions.aggregate([
      {
        $match: {
          "description.client": { $regex: new RegExp(client, "i") },
          transactionType: "sale",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$transactionDate" },
            year: { $year: "$transactionDate" },
          },
          totalRevenue: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ])
      .exec()
      .then((results) => {
        const data = sortDataByYear(results, ["totalRevenue"]);

        res.status(200).send(data);
      });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
};

//get the cash flow record
const cashFlowAnalysis = async (req, res) => {
  try {
    await Transactions.aggregate([
      {
        // group by year, month, and transaction type
        $group: {
          _id: {
            year: { $year: "$transactionDate" },
            month: { $month: "$transactionDate" },
            type: "$transactionType",
          },
          // calculate the total amount for each group
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        // group by year and month
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          // add the total revenue generated from sales, total expenses, and total credits
          totalSales: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "sale"] }, "$totalAmount", 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0],
            },
          },
          totalCredits: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "credit"] }, "$totalAmount", 0],
            },
          },
        },
      },
      {
        // sort by year and month
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ])
      .exec()
      .then((result) => {
        //sort data by year
        const data = sortDataByYear(result, [
          "totalSales",
          "totalExpenses",
          "totalCredits",
        ]);

        res.status(200).send(data);
      });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
};

module.exports = {
  grossSales,
  clientRecord,
  clientTransactionHistory,
  clients,
  RevenueFromClient,
  cashFlowAnalysis,
};
