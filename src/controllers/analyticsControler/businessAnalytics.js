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

module.exports = { grossSales };
