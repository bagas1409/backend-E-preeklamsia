const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const diagnosisRoutes = require("./diagnosis.routes");

const router = express.Router();

// Mount Routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/diagnosa", diagnosisRoutes);

module.exports = router;
