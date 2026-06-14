-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MID', 'HIGH');

-- CreateTable
CREATE TABLE "diagnoses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gravida" INTEGER NOT NULL,
    "parity" INTEGER NOT NULL,
    "gestationalAge" DOUBLE PRECISION NOT NULL,
    "age" INTEGER NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "diabetes" BOOLEAN NOT NULL DEFAULT false,
    "historyOfHypertension" BOOLEAN NOT NULL DEFAULT false,
    "systolicBP" INTEGER NOT NULL,
    "diastolicBP" INTEGER NOT NULL,
    "hb" DOUBLE PRECISION NOT NULL,
    "fetalWeight" DOUBLE PRECISION NOT NULL,
    "proteinUria" BOOLEAN NOT NULL DEFAULT false,
    "ri" DOUBLE PRECISION NOT NULL,
    "pi" DOUBLE PRECISION NOT NULL,
    "amnioticFluidLevels" DOUBLE PRECISION NOT NULL,
    "riskLevel" "RiskLevel",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnoses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
