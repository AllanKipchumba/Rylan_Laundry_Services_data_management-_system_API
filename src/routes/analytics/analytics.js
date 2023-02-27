const express = require("express");
const router = express.Router();
const monthlyAnalyticsController = require("../../controllers/analyticsControler/monthlyAnalytics");
const businessAnalyticsController = require("../../controllers/analyticsControler/businessAnalytics");
const ROLES_LIST = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

//get a month's transaction record
router.get(
  "/monthly",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  monthlyAnalyticsController.getMonthlyTotals
);

//get the business progress report
router.get(
  "/business",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  businessAnalyticsController.grossSales
);

//get the transaction report with a given client
router.get(
  "/client/:clientName",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  businessAnalyticsController.clientRecord
);

//get the transaction history with a client
router.get(
  "/transactions/:clientName",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  businessAnalyticsController.clientTransactionHistory
);

//get clients report
router.get(
  "/clients",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  businessAnalyticsController.clients
);

module.exports = router;
