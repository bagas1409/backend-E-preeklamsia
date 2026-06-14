const { z } = require("zod");

const createDiagnosisSchema = z.object({
  body: z.object({
    gravida: z.number({ required_error: "Gravida wajib diisi" }).int().min(0),
    parity: z.number({ required_error: "Parity wajib diisi" }).int().min(0),
    gestationalAge: z.number({ required_error: "Gestational Age wajib diisi" }).min(0),
    age: z.number({ required_error: "Age wajib diisi" }).int().min(0),
    bmi: z.number({ required_error: "BMI wajib diisi" }).min(0),
    diabetes: z.boolean({ required_error: "Diabetes wajib diisi (true/false)" }),
    historyOfHypertension: z.boolean({ required_error: "Riwayat hipertensi wajib diisi" }),
    systolicBP: z.number({ required_error: "Systolic BP wajib diisi" }).int().min(0),
    diastolicBP: z.number({ required_error: "Diastolic BP wajib diisi" }).int().min(0),
    hb: z.number({ required_error: "HB wajib diisi" }).min(0),
    fetalWeight: z.number({ required_error: "Berat janin wajib diisi" }).min(0),
    proteinUria: z.boolean({ required_error: "Protein Uria wajib diisi" }),
    ri: z.number({ required_error: "Resistance Index (RI) wajib diisi" }).min(0),
    pi: z.number({ required_error: "Pulsatility Index (PI) wajib diisi" }).min(0),
    amnioticFluidLevels: z.number({ required_error: "Tingkat cairan ketuban wajib diisi" }).min(0),
  }),
});

module.exports = {
  createDiagnosisSchema,
};
