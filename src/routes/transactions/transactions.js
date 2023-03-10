const express = require("express");
const router = express.Router();
const transactionsController = require("../../controllers/transactionsController/transactionsController");
const ROLES_LIST = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    transactionsController.createNewTransaction
  )
  .get(transactionsController.getMonthlyTransactions);

router
  .route("/:id")
  .get(transactionsController.fetchTransaction)
  .patch(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    transactionsController.editTransaction
  )
  .delete(
    verifyRoles(ROLES_LIST.Admin),
    transactionsController.deleteTransaction
  );

module.exports = router;
