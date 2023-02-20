const Transactions = require("../../models/transactions");

//gross sales record since inception
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

//Interaction with client
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

        const result = results[0];
        const { _id, count, totalAmount } = result;
        const clientRecord = { result };

        res.status(200).send({ clientRecord });
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { grossSales, clientRecord };
