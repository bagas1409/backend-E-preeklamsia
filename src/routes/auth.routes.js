const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validator.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = express.Router();

// Route Registrasi
router.post("/register", validate(registerSchema), authController.register);

// Route Login
router.post("/login", validate(loginSchema), authController.login);

// Route Lupa Password
router.post("/verify-reset", authController.verifyReset);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
