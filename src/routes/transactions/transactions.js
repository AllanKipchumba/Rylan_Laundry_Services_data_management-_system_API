const express = require("express");
const router = express.Router();
const transactionsController = require("../../controllers/transactionsController");

router
  .route("/")
  .post(transactionsController.createNewTransaction)
  .get(transactionsController.fetchTransactions);

router
  .route("/:id")
  .get(transactionsController.fetchTransaction)
  .put(transactionsController.editTransaction)
  .delete(transactionsController.deleteTransaction);

module.exports = router;
