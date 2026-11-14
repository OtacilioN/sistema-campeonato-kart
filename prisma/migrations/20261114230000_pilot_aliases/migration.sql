CREATE TABLE "PilotAlias" (
    "id" TEXT NOT NULL,
    "pilotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PilotAlias_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PilotAlias_normalizedName_key" ON "PilotAlias"("normalizedName");
CREATE INDEX "PilotAlias_pilotId_idx" ON "PilotAlias"("pilotId");
ALTER TABLE "PilotAlias" ADD CONSTRAINT "PilotAlias_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "Pilot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
