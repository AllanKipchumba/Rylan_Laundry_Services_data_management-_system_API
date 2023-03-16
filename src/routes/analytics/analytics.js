const express = require("express");
const router = express.Router();
const monthlyAnalyticsController = require("../../controllers/analyticsControler/monthlyAnalytics");
const businessAnalyticsController = require("../../controllers/analyticsControler/businessAnalytics");

//get a month's transaction record
router.post("/monthly", monthlyAnalyticsController.getMonthlyTotals);

//get the business progress report
router.get("/business", businessAnalyticsController.grossSales);

//get the transaction report with a given client
router.get("/client/:clientName", businessAnalyticsController.clientRecord);

//get the transaction history with a client
router.get(
  "/transactions/:clientName",
  businessAnalyticsController.clientTransactionHistory
);

//get clients report
router.get("/clients", businessAnalyticsController.clients);

module.exports = router;
