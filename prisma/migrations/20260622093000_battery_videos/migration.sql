-- CreateTable
CREATE TABLE "BatteryVideo" (
    "id" TEXT NOT NULL,
    "batteryId" TEXT NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatteryVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BatteryVideo_batteryId_idx" ON "BatteryVideo"("batteryId");

-- CreateIndex
CREATE UNIQUE INDEX "BatteryVideo_batteryId_youtubeVideoId_key" ON "BatteryVideo"("batteryId", "youtubeVideoId");

-- AddForeignKey
ALTER TABLE "BatteryVideo" ADD CONSTRAINT "BatteryVideo_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
