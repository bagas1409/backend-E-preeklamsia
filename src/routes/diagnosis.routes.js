const express = require("express");
const { createDiagnosis, getMyDiagnoses } = require("../controllers/diagnosis.controller");
const validate = require("../middlewares/validator.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { createDiagnosisSchema } = require("../validators/diagnosis.validator");

const router = express.Router();

// Middleware Proteksi: Hanya user yang login yang bisa mengakses route di bawah ini
router.use(protect);

// POST /api/diagnosa
router.post("/", validate(createDiagnosisSchema), createDiagnosis);

// GET /api/diagnosa (Mengambil riwayat diri sendiri)
router.get("/", getMyDiagnoses);

module.exports = router;
