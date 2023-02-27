const Transactions = require("../../models/transactions");

//sales record since inception
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

//client record
const clientRecord = async (req, res) => {
  try {
    const { client } = req.body;

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

//get the transaction record with a given client
const clientTransactionHistory = async (req, res) => {
  const clientName = req.params.clientName;

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
        //no transaction record with client
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

module.exports = { grossSales, clientRecord, clientTransactionHistory };
