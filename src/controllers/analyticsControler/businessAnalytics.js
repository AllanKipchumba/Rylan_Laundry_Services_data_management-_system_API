const Transactions = require("../../models/transactions");

//get the business progress report
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

//get the transaction report with a given client
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

//get the transaction history with a client
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

//get clients report
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

module.exports = {
  grossSales,
  clientRecord,
  clientTransactionHistory,
  clients,
};
