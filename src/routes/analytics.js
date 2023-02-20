const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.route("/monthly").get(analyticsController.getMonthlyTotals);

module.exports = router;
