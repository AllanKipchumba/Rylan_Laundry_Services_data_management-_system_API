const express = require("express");
const router = express.Router();
const transactionsController = require("../../controllers/transactionsController/transactionsController");

router
  .route("/")
  .post(transactionsController.createNewTransaction)
  .get(transactionsController.getMonthlyTransactions);

router
  .route("/:id")
  .get(transactionsController.fetchTransaction)
  .patch(transactionsController.editTransaction)
  .delete(transactionsController.deleteTransaction);

module.exports = router;
