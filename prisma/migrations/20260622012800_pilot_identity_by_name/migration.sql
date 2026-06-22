-- Pilot identity is the full name only. UF remains optional metadata from documents.
DROP INDEX IF EXISTS "Pilot_fullName_uf_key";

ALTER TABLE "Pilot" ALTER COLUMN "uf" DROP NOT NULL;

CREATE UNIQUE INDEX "Pilot_fullName_key" ON "Pilot"("fullName");
