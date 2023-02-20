const express = require("express");
const router = express.Router();
const monthlyAnalyticsController = require("../controllers/analyticsControler/monthlyAnalytics");
const businessAnalyticsController = require("../controllers/analyticsControler/businessAnalytics");

router.route("/monthly").get(monthlyAnalyticsController.getMonthlyTotals);
router.route("/business").get(businessAnalyticsController.grossSales);

module.exports = router;
