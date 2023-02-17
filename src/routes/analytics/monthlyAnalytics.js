const express = require("express");
const router = express.Router();
const analyticsController = require("../../controllers/analytics/montlyAnalyticsController");

router.route("/").get(analyticsController.monthlyAnalytics);

module.exports = router;
