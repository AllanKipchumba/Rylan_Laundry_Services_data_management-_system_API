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

module.exports = router;
