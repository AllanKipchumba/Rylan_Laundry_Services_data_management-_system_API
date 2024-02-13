const Transactions = require('../../models/transactions');

const getMonthlyTotals = async (req, res) => {
  try {
    const { month, year } = req.body;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    //get total sales
    const salesTotal = await Transactions.aggregate([
      {
        $match: {
          transactionDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          transactionType: 'sale',
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
        },
      },
    ]);

    //get total expenses
    const expensesTotal = await Transactions.aggregate([
      {
        $match: {
          transactionDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          transactionType: 'expense',
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
        },
      },
    ]);

    //get total credits
    const creditsTotal = await Transactions.aggregate([
      {
        $match: {
          transactionDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          transactionType: 'credit',
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
        },
      },
    ]);

    //get total debits for `ryl`
    const debitsTotal_ryl = await Transactions.aggregate([
      {
        $match: {
          transactionDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          'description.creditor': 'ryl',
          transactionType: 'credit',
        },
      },
      {
        $group: {
          _id: null,
          totalCredits: { $sum: '$amount' },
        },
      },
    ]);

    //get total debits for `lan`
    const debitsTotal_lan = await Transactions.aggregate([
      {
        $match: {
          transactionDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          'description.creditor': 'lan',
          transactionType: 'credit',
        },
      },
      {
        $group: {
          _id: null,
          totalCredits: { $sum: '$amount' },
        },
      },
    ]);

    const sales = salesTotal[0] ? salesTotal[0].total : 0;
    const credits = creditsTotal[0] ? creditsTotal[0].total : 0;
    const expenses = expensesTotal[0] ? expensesTotal[0].total : 0;
    const deductions = credits + expenses;

    const debitsForRyl = debitsTotal_ryl[0]
      ? debitsTotal_ryl[0].totalCredits
      : 0;
    const debitsForLan = debitsTotal_lan[0]
      ? debitsTotal_lan[0].totalCredits
      : 0;

    const debts = debitsForRyl + debitsForLan;

    //     REVENUE SHARING ARRANGEMENT
    /*
      (case 1) business revenue is 30% of the total sales
          sharable revenue = 70% of the total sales
            ryl = 30% of the sharable revenue
            lan = 70% of the sharable revenue
      (case 2) business revenue is 40% of the total sales
          sharable revenue = 60% of the total sales
            ryl = 25% of the sharable revenue
            lan = 75% of the sharable revenue
      (case 3) business revenue is 20% of the total sales
          sharable revenue = 80% of the total sales
            ryl = 35% of the sharable revenue
            lan = 65% of the sharable revenue
      (case 4) business revenue is 25% of the total sales
          sharable revenue = 75% of the total sales
            ryl = 33% of the sharable revenue
            lan = 67% of the sharable revenue
    */

    // algorithm for revenue the sharing scheme
    const calculateRevenueSharing = (sales, businessRevenuePercentage) => {
      const businessRevenue = businessRevenuePercentage * sales;
      let sharableRevenue;
      let rylRevenue;
      let lanRevenue;

      switch (businessRevenuePercentage) {
        case 0.3:
          sharableRevenue = 0.7 * sales;
          rylRevenue = 0.3 * sharableRevenue;
          lanRevenue = 0.7 * sharableRevenue;
          break;
        case 0.4:
          sharableRevenue = 0.6 * sales;
          rylRevenue = 0.25 * sharableRevenue;
          lanRevenue = 0.75 * sharableRevenue;
          break;
        case 0.2:
          sharableRevenue = 0.8 * sales;
          rylRevenue = 0.35 * sharableRevenue;
          lanRevenue = 0.65 * sharableRevenue;
          break;
        case 0.25:
          sharableRevenue = 0.75 * sales;
          rylRevenue = 0.33 * sharableRevenue;
          lanRevenue = 0.67 * sharableRevenue;
          break;
        case 0.12:
          sharableRevenue = 0.88 * sales;
          rylRevenue = 0.35 * sharableRevenue;
          lanRevenue = 0.65 * sharableRevenue;
          break;
        default:
          throw new Error('Invalid business revenue percentage');
      }

      return { businessRevenue, sharableRevenue, rylRevenue, lanRevenue };
    };

    const { businessRevenue, sharableRevenue, rylRevenue, lanRevenue } =
      calculateRevenueSharing(sales, 0.12);

    const expectedPayToRyl = rylRevenue + debitsForRyl;
    const expectedPayToLan = lanRevenue + debitsForLan;

    let revenueToBeUsedToSettleDebts;

    if (debts !== 0) {
      revenueToBeUsedToSettleDebts = businessRevenue - expenses;
    }
    const profit = businessRevenue - deductions;

    res.status(200).send({
      sales,
      credits,
      expenses,
      deductions,
      businessRevenue,
      debts,
      revenueToBeUsedToSettleDebts,
      profit,
      sharableRevenue,
      rylRevenue,
      debitsForRyl,
      expectedPayToRyl,
      lanRevenue,
      debitsForLan,
      expectedPayToLan,
    });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { getMonthlyTotals };
