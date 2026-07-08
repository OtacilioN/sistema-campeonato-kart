CREATE TABLE "SeasonDisqualification" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "pilotId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "SeasonDisqualification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SeasonDisqualification_seasonId_pilotId_key" ON "SeasonDisqualification"("seasonId", "pilotId");
CREATE INDEX "SeasonDisqualification_pilotId_idx" ON "SeasonDisqualification"("pilotId");

ALTER TABLE "SeasonDisqualification" ADD CONSTRAINT "SeasonDisqualification_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SeasonDisqualification" ADD CONSTRAINT "SeasonDisqualification_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "Pilot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
