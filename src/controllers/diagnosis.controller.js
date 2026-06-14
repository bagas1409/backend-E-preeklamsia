const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Simulasi ringan untuk menghitung Risk Level (Silakan sesuaikan dengan algoritma kedokteran aslinya)
const calculateRiskLevel = (data) => {
  let score = 0;
  if (data.systolicBP >= 140) score += 2;
  if (data.diastolicBP >= 90) score += 2;
  if (data.proteinUria) score += 2;
  if (data.historyOfHypertension) score += 1;
  if (data.diabetes) score += 1;

  if (score >= 4) return "HIGH";
  if (score >= 2) return "MID";
  return "LOW";
};

const createDiagnosis = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    // Kalkulasi tingkat risiko berdasarkan input
    const riskLevel = calculateRiskLevel(data);

    const diagnosis = await prisma.diagnosis.create({
      data: {
        userId,
        ...data,
        riskLevel,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Data diagnosa berhasil disimpan dan dianalisis",
      data: diagnosis,
    });
  } catch (error) {
    next(error);
  }
};

const getMyDiagnoses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const diagnoses = await prisma.diagnosis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Riwayat diagnosa berhasil diambil",
      data: diagnoses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDiagnosis,
  getMyDiagnoses,
};
