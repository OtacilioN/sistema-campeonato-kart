-- Associações de identidade confirmadas pelo administrador em 14/11/2026.
-- Executar inteiro, em uma conexão, após 20261114230000_pilot_aliases.
-- Preserva IDs/URLs históricos, resultados, lap-to-laps e snapshots de revisão.
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE "Pilot", "PilotAlias", "BatteryResult", "LapToLap", "Lap", "SeasonDisqualification", "ResultReview", "Battery", "Season" IN SHARE ROW EXCLUSIVE MODE;

CREATE TEMP TABLE _november_pilot_merge (
  keep_id text PRIMARY KEY,
  duplicate_id text UNIQUE NOT NULL,
  old_name text NOT NULL,
  duplicate_name text NOT NULL,
  canonical_name text NOT NULL,
  old_slug text NOT NULL,
  expected_results integer NOT NULL,
  expected_laps integer NOT NULL,
  expected_points integer NOT NULL,
  november_points integer NOT NULL
) ON COMMIT DROP;

INSERT INTO _november_pilot_merge VALUES
('cmqokdy80002ll204ejfdnbra', 'cmwgzec0a0000js086azqo10q', 'Antonio Carlos De Carvalho S...', 'Antonio Carlos De Carvalho Segundo', 'Antonio Carlos De Carvalho Segundo', 'antonio-carlos-de-carvalho-s', 8, 1, 54, 25),
('cmqoj3fd10000jv0480dtpi5u', 'cmwgzec680003js08dfawl8e7', 'Robério Rosa Barbalho De Oli...', 'Robério Rosa Barbalho De Oliveira', 'Robério Rosa Barbalho De Oliveira', 'roberio-rosa-barbalho-de-oli', 11, 1, 69, 12),
('cmqoj3ffq0006jv0456lcp4qj', 'cmwgzecb80004js089mhomp4y', 'Jaime Antonio De Albuquerque...', 'Jaime Antonio De Albuquerque Filho', 'Jaime Antonio De Albuquerque Filho', 'jaime-antonio-de-albuquerque', 10, 8, 62, 5),
('cmqokdy3u002cl204wga59mgu', 'cmwgzec440002js08qjde1xqs', 'Bruno Marcos Santos Lima', 'Bruno Marcos', 'Bruno Marcos Santos Lima', 'bruno-marcos-santos-lima', 4, 1, 52, 16);

DO $$
DECLARE m record;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "Battery" b JOIN "Season" s ON s.id=b."seasonId"
    WHERE b.id='cmupqw6rz0001kz04tisrdd7b' AND b.number=5 AND b.status='CONFIRMED'
      AND s.slug='2026-2' AND s.active) THEN
    RAISE EXCEPTION 'A bateria de novembro ou a temporada ativa mudou.';
  END IF;
  FOR m IN SELECT * FROM _november_pilot_merge LOOP
    IF NOT EXISTS (SELECT 1 FROM "Pilot" WHERE id=m.keep_id AND "fullName"=m.old_name AND slug=m.old_slug)
      OR NOT EXISTS (SELECT 1 FROM "Pilot" WHERE id=m.duplicate_id AND "fullName"=m.duplicate_name) THEN
      RAISE EXCEPTION 'Identidade diferente da auditada: %.',m.old_name;
    END IF;
    IF (SELECT count(*) FROM "BatteryResult" WHERE "pilotId"=m.keep_id) <> m.expected_results
      OR (SELECT count(*) FROM "LapToLap" WHERE "pilotId"=m.keep_id) <> m.expected_laps
      OR (SELECT count(*) FROM "BatteryResult" WHERE "pilotId"=m.duplicate_id) <> 1
      OR EXISTS (SELECT 1 FROM "LapToLap" WHERE "pilotId"=m.duplicate_id)
      OR EXISTS (SELECT 1 FROM "SeasonDisqualification" WHERE "pilotId" IN (m.keep_id,m.duplicate_id))
      OR EXISTS (SELECT 1 FROM "PilotAlias" WHERE "pilotId"=m.duplicate_id) THEN
      RAISE EXCEPTION 'Dependências diferentes das auditadas: %.',m.old_name;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM "BatteryResult" WHERE "pilotId"=m.duplicate_id
      AND "batteryId"='cmupqw6rz0001kz04tisrdd7b' AND "finalPoints"=m.november_points)
      OR EXISTS (SELECT 1 FROM "BatteryResult" WHERE "pilotId"=m.keep_id AND "batteryId"='cmupqw6rz0001kz04tisrdd7b')
      OR (SELECT COALESCE(sum(r."finalPoints"),0) FROM "BatteryResult" r JOIN "Battery" b ON b.id=r."batteryId"
        JOIN "Season" s ON s.id=b."seasonId" WHERE r."pilotId"=m.keep_id AND s.slug='2026-2' AND b.status='CONFIRMED') <> m.expected_points THEN
      RAISE EXCEPTION 'Resultados diferentes dos auditados: %.',m.old_name;
    END IF;
  END LOOP;
  IF NOT EXISTS (SELECT 1 FROM "Pilot" WHERE id='cmqoj3ffq0006jv0456lcp4qj' AND "displayName"='Jaiminho Karteiro') THEN
    RAISE EXCEPTION 'O apelido histórico do Jaime mudou.';
  END IF;
END $$;

-- Snapshots com o único remapeamento esperado de pilotId.
CREATE TEMP TABLE _expected_results ON COMMIT DROP AS
SELECT r.id,(to_jsonb(r)-'pilotId') || jsonb_build_object('pilotId',COALESCE(m.keep_id,r."pilotId")) AS payload
FROM "BatteryResult" r LEFT JOIN _november_pilot_merge m ON m.duplicate_id=r."pilotId";
CREATE TEMP TABLE _expected_pilots ON COMMIT DROP AS
SELECT p.id,(to_jsonb(p)-'fullName'-'updatedAt') || jsonb_build_object('fullName',COALESCE(m.canonical_name,p."fullName")) AS payload
FROM "Pilot" p LEFT JOIN _november_pilot_merge m ON m.keep_id=p.id
WHERE p.id NOT IN (SELECT duplicate_id FROM _november_pilot_merge);
CREATE TEMP TABLE _unchanged_tables ON COMMIT DROP AS
SELECT 'laps' AS name,md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) AS fingerprint FROM "LapToLap" t
UNION ALL SELECT 'lapRows',md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) FROM "Lap" t
UNION ALL SELECT 'reviews',md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) FROM "ResultReview" t
UNION ALL SELECT 'batteries',md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) FROM "Battery" t
UNION ALL SELECT 'disqualifications',md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) FROM "SeasonDisqualification" t;

CREATE TEMP TABLE _approved_aliases (pilot_id text, name text, normalized_name text PRIMARY KEY) ON COMMIT DROP;
INSERT INTO _approved_aliases VALUES
('cmqokdy80002ll204ejfdnbra','Antonio Carlos De Carvalho S...','antonio carlos de carvalho s...'),
('cmqokdy80002ll204ejfdnbra','Antonio Carlos De Carvalho Segundo','antonio carlos de carvalho segundo'),
('cmqoj3fd10000jv0480dtpi5u','Robério Rosa Barbalho De Oli...','roberio rosa barbalho de oli...'),
('cmqoj3fd10000jv0480dtpi5u','Robério Rosa Barbalho De Oliveira','roberio rosa barbalho de oliveira'),
('cmqoj3ffq0006jv0456lcp4qj','Jaime Antonio De Albuquerque...','jaime antonio de albuquerque...'),
('cmqoj3ffq0006jv0456lcp4qj','Jaime Antonio De Albuquerque Filho','jaime antonio de albuquerque filho'),
('cmqoj3ffq0006jv0456lcp4qj','Jaiminho Karteiro','jaiminho karteiro'),
('cmqokdy3u002cl204wga59mgu','Bruno Marcos Santos Lima','bruno marcos santos lima'),
('cmqokdy3u002cl204wga59mgu','Bruno Marcos','bruno marcos');

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM _approved_aliases a JOIN "PilotAlias" p ON p."normalizedName"=a.normalized_name WHERE p."pilotId"<>a.pilot_id) THEN
    RAISE EXCEPTION 'Um alias aprovado já pertence a outro piloto.';
  END IF;
END $$;

UPDATE "BatteryResult" r SET "pilotId"=m.keep_id FROM _november_pilot_merge m WHERE r."pilotId"=m.duplicate_id;

-- Nenhuma dependência pode ficar para trás: Pilot tem FKs com ON DELETE CASCADE.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM "BatteryResult" WHERE "pilotId" IN (SELECT duplicate_id FROM _november_pilot_merge))
    OR EXISTS (SELECT 1 FROM "LapToLap" WHERE "pilotId" IN (SELECT duplicate_id FROM _november_pilot_merge))
    OR EXISTS (SELECT 1 FROM "SeasonDisqualification" WHERE "pilotId" IN (SELECT duplicate_id FROM _november_pilot_merge))
    OR EXISTS (SELECT 1 FROM "PilotAlias" WHERE "pilotId" IN (SELECT duplicate_id FROM _november_pilot_merge)) THEN
    RAISE EXCEPTION 'Restaram dependências nos cadastros duplicados.';
  END IF;
END $$;
DELETE FROM "Pilot" WHERE id IN (SELECT duplicate_id FROM _november_pilot_merge);
UPDATE "Pilot" p SET "fullName"=m.canonical_name,"updatedAt"=CURRENT_TIMESTAMP
FROM _november_pilot_merge m WHERE p.id=m.keep_id;
INSERT INTO "PilotAlias" (id,"pilotId",name,"normalizedName")
SELECT 'nov2026-alias-' || md5(normalized_name),pilot_id,name,normalized_name FROM _approved_aliases
ON CONFLICT ("normalizedName") DO NOTHING;

DO $$
DECLARE fingerprints_match boolean;
BEGIN
  IF EXISTS (SELECT 1 FROM _expected_results e FULL JOIN "BatteryResult" r ON r.id=e.id WHERE e.payload IS DISTINCT FROM to_jsonb(r)) THEN
    RAISE EXCEPTION 'Algum resultado foi perdido ou alterado além do pilotId aprovado.';
  END IF;
  IF EXISTS (SELECT 1 FROM _expected_pilots e FULL JOIN "Pilot" p ON p.id=e.id WHERE e.payload IS DISTINCT FROM (to_jsonb(p)-'updatedAt')) THEN
    RAISE EXCEPTION 'Algum cadastro foi alterado além das identidades aprovadas.';
  END IF;
  WITH current_fingerprints AS (
    SELECT 'laps' AS name,md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) AS fingerprint FROM "LapToLap" t
    UNION ALL SELECT 'lapRows',md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) FROM "Lap" t
    UNION ALL SELECT 'reviews',md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) FROM "ResultReview" t
    UNION ALL SELECT 'batteries',md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) FROM "Battery" t
    UNION ALL SELECT 'disqualifications',md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id)::text,'[]')) FROM "SeasonDisqualification" t
  ) SELECT bool_and(a.fingerprint=b.fingerprint) INTO fingerprints_match FROM _unchanged_tables a JOIN current_fingerprints b USING(name);
  IF NOT fingerprints_match THEN RAISE EXCEPTION 'Lap-to-laps, revisões, baterias ou desclassificações foram alterados.'; END IF;
  IF EXISTS (SELECT 1 FROM _approved_aliases a LEFT JOIN "PilotAlias" p ON p."normalizedName"=a.normalized_name AND p."pilotId"=a.pilot_id WHERE p.id IS NULL) THEN
    RAISE EXCEPTION 'Algum alias aprovado não foi associado.';
  END IF;
END $$;

SELECT p.id,p."fullName",p."displayName",p.slug,
  sum(r."finalPoints") FILTER (WHERE s.slug='2026-2' AND b.status='CONFIRMED') AS season_points,
  count(r.id) FILTER (WHERE s.slug='2026-2' AND b.status='CONFIRMED') AS season_participations
FROM "Pilot" p JOIN _november_pilot_merge m ON m.keep_id=p.id
LEFT JOIN "BatteryResult" r ON r."pilotId"=p.id
LEFT JOIN "Battery" b ON b.id=r."batteryId" LEFT JOIN "Season" s ON s.id=b."seasonId"
GROUP BY p.id ORDER BY p."fullName";
COMMIT;
