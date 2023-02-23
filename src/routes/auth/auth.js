const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController/authController");
const registerUserController = require("../../controllers/authController/registerController");
const logoutController = require("../../controllers/authController/logoutController");
const refreshTokenController = require("../../controllers/authController/refreshTokenController");
const verifyJWT = require("../../middleware/verifyJWT");

router.post("/login", authController.handleLogin);
router.post("/register", registerUserController.registerUser);
router.post("/logout", verifyJWT, logoutController.handleLogout);
router.get("/refresh-token", refreshTokenController.getAccessToken);

module.exports = router;
