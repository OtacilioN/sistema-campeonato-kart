-- CreateEnum
CREATE TYPE "BatteryStatus" AS ENUM ('PLANNED', 'IN_REVIEW', 'CONFIRMED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('CLASSIFIED', 'NC', 'ABSENT');

-- CreateEnum
CREATE TYPE "LapValidation" AS ENUM ('VALIDATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReviewSource" AS ENUM ('OFFICIAL_PDF', 'MANUAL');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateTable
CREATE TABLE "Pilot" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "displayName" TEXT,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pilot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battery" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "monthLabel" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "status" "BatteryStatus" NOT NULL DEFAULT 'PLANNED',
    "locationName" TEXT NOT NULL DEFAULT 'Circuito Internacional Paladino',
    "city" TEXT NOT NULL DEFAULT 'Conde',
    "uf" TEXT NOT NULL DEFAULT 'PB',
    "category" TEXT,
    "type" TEXT,
    "parsedPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatteryResult" (
    "id" TEXT NOT NULL,
    "batteryId" TEXT NOT NULL,
    "pilotId" TEXT NOT NULL,
    "pilotNumber" INTEGER,
    "position" INTEGER,
    "status" "ResultStatus" NOT NULL DEFAULT 'CLASSIFIED',
    "bestLapNumber" INTEGER,
    "bestLapTime" TEXT,
    "totalTime" TEXT,
    "gapToLeader" TEXT,
    "gapToPrevious" TEXT,
    "lastLapTime" TEXT,
    "totalLaps" INTEGER,
    "averageSpeed" DECIMAL(65,30),
    "positionPoints" INTEGER NOT NULL DEFAULT 0,
    "poleBonus" INTEGER NOT NULL DEFAULT 0,
    "bestLapBonus" INTEGER NOT NULL DEFAULT 0,
    "penaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "penaltyReason" TEXT,
    "finalPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatteryResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultReview" (
    "id" TEXT NOT NULL,
    "batteryId" TEXT NOT NULL,
    "source" "ReviewSource" NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "fileName" TEXT,
    "parsedPayload" JSONB,
    "reviewPayload" JSONB NOT NULL,
    "messages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "ResultReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LapToLap" (
    "id" TEXT NOT NULL,
    "batteryResultId" TEXT NOT NULL,
    "pilotId" TEXT NOT NULL,
    "validationStatus" "LapValidation" NOT NULL DEFAULT 'VALIDATED',
    "extractedPilotName" TEXT,
    "extractedPilotNumber" INTEGER,
    "extractedBestLapTime" TEXT,
    "extractedBestLapNumber" INTEGER,
    "extractedTotalTime" TEXT,
    "parsedPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LapToLap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lap" (
    "id" TEXT NOT NULL,
    "lapToLapId" TEXT NOT NULL,
    "lapNumber" INTEGER NOT NULL,
    "lapTime" TEXT NOT NULL,
    "deltaBestLap" TEXT,
    "deltaCategory" TEXT,
    "accumulatedTime" TEXT,
    "averageSpeed" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pilot_slug_key" ON "Pilot"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pilot_fullName_uf_key" ON "Pilot"("fullName", "uf");

-- CreateIndex
CREATE UNIQUE INDEX "Season_slug_key" ON "Season"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Season_year_period_key" ON "Season"("year", "period");

-- CreateIndex
CREATE UNIQUE INDEX "Battery_seasonId_number_key" ON "Battery"("seasonId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "BatteryResult_batteryId_pilotId_key" ON "BatteryResult"("batteryId", "pilotId");

-- CreateIndex
CREATE UNIQUE INDEX "LapToLap_batteryResultId_key" ON "LapToLap"("batteryResultId");

-- CreateIndex
CREATE UNIQUE INDEX "Lap_lapToLapId_lapNumber_key" ON "Lap"("lapToLapId", "lapNumber");

-- AddForeignKey
ALTER TABLE "Battery" ADD CONSTRAINT "Battery_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatteryResult" ADD CONSTRAINT "BatteryResult_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatteryResult" ADD CONSTRAINT "BatteryResult_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "Pilot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultReview" ADD CONSTRAINT "ResultReview_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LapToLap" ADD CONSTRAINT "LapToLap_batteryResultId_fkey" FOREIGN KEY ("batteryResultId") REFERENCES "BatteryResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LapToLap" ADD CONSTRAINT "LapToLap_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "Pilot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lap" ADD CONSTRAINT "Lap_lapToLapId_fkey" FOREIGN KEY ("lapToLapId") REFERENCES "LapToLap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
