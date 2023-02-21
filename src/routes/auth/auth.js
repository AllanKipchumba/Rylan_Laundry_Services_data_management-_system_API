const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController/authController");
const registerUserController = require("../../controllers/authController/registerController");
const logoutController = require("../../controllers/authController/logoutController");

router.post("/login", authController.handleLogin);
router.post("/register", registerUserController.registerUser);
router.get("/logout", logoutController.handleLogout);

module.exports = router;
