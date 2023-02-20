const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController");

router.route("/").post(transactionsController.createNewTransaction);

router
  .route("/:id")
  .get(transactionsController.fetchTransaction)
  .patch(transactionsController.editTransaction)
  .delete(transactionsController.deleteTransaction);

module.exports = router;
