const Transactions = require("../../models/transactions");

const monthlyAnalytics = async (req, res) => {
  if (!req?.body)
    return res.status(400).json({ mesage: "month and year requred!" });

  try {
    const { month, year } = req.body;

    let data = {
      totalSales,
      totalExpenses,
      totalCredits,
      deductions,
      profit,
      debits: {
        ryl,
        lan,
      },
      revenue: {
        ryl,
        lan,
      },
    };

    //extract records for a given month, perform computations
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { monthlyAnalytics };
