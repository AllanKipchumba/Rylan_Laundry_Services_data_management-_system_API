const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController/authController");
const registerUserController = require("../../controllers/authController/registerController");

router.post("/login", authController.handleLogin);
router.post("/register", registerUserController.registerUser);

module.exports = router;
