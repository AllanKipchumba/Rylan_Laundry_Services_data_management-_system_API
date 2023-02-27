const express = require("express");
const router = express.Router();
const monthlyAnalyticsController = require("../../controllers/analyticsControler/monthlyAnalytics");
const businessAnalyticsController = require("../../controllers/analyticsControler/businessAnalytics");
const ROLES_LIST = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/monthly")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    monthlyAnalyticsController.getMonthlyTotals
  );

router
  //gets how the business is progressing
  .route("/business")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    businessAnalyticsController.grossSales
  );

router
  .route("/clientRecord")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    businessAnalyticsController.clientRecord
  );

router
  //get the transaction record with a given client
  .route("/transactions/:clientName")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    businessAnalyticsController.clientTransactionHistory
  );

module.exports = router;
