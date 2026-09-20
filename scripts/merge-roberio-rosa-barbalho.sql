-- Unifica a identidade duplicada de Robério Rosa Barbalho.
--
-- Auditoria de origem: Neon de producao, projeto velocidade-quase-maxima,
-- branch main, em 2026-09-20. Uma transacao atomica equivalente foi aplicada
-- em producao em 2026-09-20T03:56:41Z; este arquivo permanece como recibo
-- reproduzivel e deve abortar se for executado novamente.
--
-- Mantem o piloto historico:
--   cmqoj3fd10000jv0480dtpi5u | Robério Rosa Barbalho De Oli...
-- Remove o duplicado criado em 2026-09-19:
--   cmu8w2xt90000kw04v2nxu3yo | Robério Rosa Barbalho de Ol...
--
-- As verificacoes abaixo fazem a transacao abortar se os dados tiverem mudado
-- desde a auditoria ou se surgir uma colisao que exija decisao manual.

BEGIN;

SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '60s';

CREATE TEMP TABLE _pilot_merge_params (
  keep_id text PRIMARY KEY,
  duplicate_id text UNIQUE NOT NULL,
  CHECK (keep_id <> duplicate_id)
) ON COMMIT DROP;

INSERT INTO _pilot_merge_params (keep_id, duplicate_id)
VALUES (
  'cmqoj3fd10000jv0480dtpi5u',
  'cmu8w2xt90000kw04v2nxu3yo'
);

-- Impede que uma confirmacao/edicao concorrente invalide a auditoria.
LOCK TABLE
  "Pilot",
  "Season",
  "Battery",
  "BatteryResult",
  "LapToLap",
  "SeasonDisqualification",
  "ResultReview"
IN SHARE ROW EXCLUSIVE MODE;

-- Trava os dois pilotos selecionados durante toda a transacao.
SELECT p.id, p."fullName", p.slug, p.uf, p.active, p."createdAt"
FROM "Pilot" p
CROSS JOIN _pilot_merge_params m
WHERE p.id IN (m.keep_id, m.duplicate_id)
ORDER BY p."createdAt"
FOR UPDATE;

DO $$
DECLARE
  selected_count integer;
  confirmed_battery_count integer;
  keep_result_count integer;
  duplicate_result_count integer;
  keep_active_points integer;
  duplicate_active_points integer;
  pending_review_count integer;
  pending_duplicate_names integer;
  pending_canonical_names integer;
BEGIN
  SELECT count(*)
  INTO selected_count
  FROM "Pilot" p
  CROSS JOIN _pilot_merge_params m
  WHERE p.id IN (m.keep_id, m.duplicate_id);

  IF selected_count <> 2 THEN
    RAISE EXCEPTION
      'Unificacao abortada: esperados dois pilotos, encontrados %.',
      selected_count;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM "Pilot" p
    CROSS JOIN _pilot_merge_params m
    WHERE p.id = m.keep_id
      AND p."fullName" = 'Robério Rosa Barbalho De Oli...'
      AND p.slug = 'roberio-rosa-barbalho-de-oli'
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: o piloto historico nao corresponde mais ao registro auditado.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM "Pilot" p
    CROSS JOIN _pilot_merge_params m
    WHERE p.id = m.duplicate_id
      AND p."fullName" = 'Robério Rosa Barbalho de Ol...'
      AND p.slug = 'roberio-rosa-barbalho-de-ol'
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: o piloto duplicado nao corresponde mais ao registro auditado.';
  END IF;

  SELECT count(*)
  INTO confirmed_battery_count
  FROM "Battery" b
  JOIN "Season" s ON s.id = b."seasonId"
  WHERE s.id = 'cmqphy9h20000l704uga1pfza'
    AND s.slug = '2026-2'
    AND s.active = true
    AND b.status = 'CONFIRMED';

  IF confirmed_battery_count <> 3 THEN
    RAISE EXCEPTION
      'Unificacao abortada: a temporada ativa nao tem mais as 3 baterias confirmadas auditadas.';
  END IF;

  SELECT count(*)
  INTO keep_result_count
  FROM "BatteryResult" r
  CROSS JOIN _pilot_merge_params m
  WHERE r."pilotId" = m.keep_id;

  SELECT count(*)
  INTO duplicate_result_count
  FROM "BatteryResult" r
  CROSS JOIN _pilot_merge_params m
  WHERE r."pilotId" = m.duplicate_id;

  IF keep_result_count <> 9 OR duplicate_result_count <> 1 THEN
    RAISE EXCEPTION
      'Unificacao abortada: contagens de resultados mudaram (historico %, duplicado %).',
      keep_result_count,
      duplicate_result_count;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM "BatteryResult" r
    JOIN "Battery" b ON b.id = r."batteryId"
    CROSS JOIN _pilot_merge_params m
    WHERE r.id = 'cmu8w2yap0008kw04q6ta8hbm'
      AND r."pilotId" = m.duplicate_id
      AND b."seasonId" = 'cmqphy9h20000l704uga1pfza'
      AND b.number = 3
      AND b.status = 'CONFIRMED'
      AND r.status = 'CLASSIFIED'
      AND r.position = 2
      AND r."finalPoints" = 24
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: o resultado do duplicado nao corresponde mais a 3a bateria auditada.';
  END IF;

  SELECT COALESCE(sum(r."finalPoints"), 0)
  INTO keep_active_points
  FROM "BatteryResult" r
  JOIN "Battery" b ON b.id = r."batteryId"
  CROSS JOIN _pilot_merge_params m
  WHERE r."pilotId" = m.keep_id
    AND b."seasonId" = 'cmqphy9h20000l704uga1pfza'
    AND b.status = 'CONFIRMED';

  SELECT COALESCE(sum(r."finalPoints"), 0)
  INTO duplicate_active_points
  FROM "BatteryResult" r
  JOIN "Battery" b ON b.id = r."batteryId"
  CROSS JOIN _pilot_merge_params m
  WHERE r."pilotId" = m.duplicate_id
    AND b."seasonId" = 'cmqphy9h20000l704uga1pfza'
    AND b.status = 'CONFIRMED';

  IF keep_active_points <> 25 OR duplicate_active_points <> 24 THEN
    RAISE EXCEPTION
      'Unificacao abortada: pontos ativos mudaram (historico %, duplicado %).',
      keep_active_points,
      duplicate_active_points;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "BatteryResult" keep_result
    JOIN "BatteryResult" duplicate_result
      ON duplicate_result."batteryId" = keep_result."batteryId"
    CROSS JOIN _pilot_merge_params m
    WHERE keep_result."pilotId" = m.keep_id
      AND duplicate_result."pilotId" = m.duplicate_id
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: os dois pilotos possuem resultado na mesma bateria.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "SeasonDisqualification" keep_disqualification
    JOIN "SeasonDisqualification" duplicate_disqualification
      ON duplicate_disqualification."seasonId" = keep_disqualification."seasonId"
    CROSS JOIN _pilot_merge_params m
    WHERE keep_disqualification."pilotId" = m.keep_id
      AND duplicate_disqualification."pilotId" = m.duplicate_id
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: os dois pilotos possuem desclassificacao na mesma temporada.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "LapToLap" l
    JOIN "BatteryResult" r ON r.id = l."batteryResultId"
    CROSS JOIN _pilot_merge_params m
    WHERE (
      l."pilotId" IN (m.keep_id, m.duplicate_id)
      OR r."pilotId" IN (m.keep_id, m.duplicate_id)
    )
      AND l."pilotId" <> r."pilotId"
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: existe lap-to-lap inconsistente com seu resultado.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "LapToLap" l
    CROSS JOIN _pilot_merge_params m
    WHERE l."pilotId" = m.duplicate_id
  ) OR EXISTS (
    SELECT 1
    FROM "SeasonDisqualification" d
    CROSS JOIN _pilot_merge_params m
    WHERE d."pilotId" = m.duplicate_id
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: o duplicado ganhou dependencias nao existentes na auditoria.';
  END IF;

  SELECT count(*)
  INTO pending_review_count
  FROM "ResultReview" rr
  WHERE rr.id = 'cmu9a0dde0001l504zsm6s7oy'
    AND rr."batteryId" = 'cmqpi2f550007i9044pcash3z'
    AND rr.status = 'PENDING';

  IF pending_review_count <> 1 THEN
    RAISE EXCEPTION
      'Unificacao abortada: a revisao pendente auditada da 3a bateria mudou de estado.';
  END IF;

  SELECT
    count(*) FILTER (
      WHERE review_row.row_value ->> 'fullName' = 'Robério Rosa Barbalho de Ol...'
    ),
    count(*) FILTER (
      WHERE review_row.row_value ->> 'fullName' = 'Robério Rosa Barbalho De Oli...'
    )
  INTO pending_duplicate_names, pending_canonical_names
  FROM "ResultReview" rr
  CROSS JOIN LATERAL jsonb_array_elements(
    CASE
      WHEN jsonb_typeof(rr."reviewPayload"::jsonb -> 'rows') = 'array'
        THEN rr."reviewPayload"::jsonb -> 'rows'
      ELSE '[]'::jsonb
    END
  ) AS review_row(row_value)
  WHERE rr.id = 'cmu9a0dde0001l504zsm6s7oy';

  IF pending_duplicate_names <> 1 OR pending_canonical_names <> 0 THEN
    RAISE EXCEPTION
      'Unificacao abortada: nomes da revisao pendente mudaram (duplicado %, canonico %).',
      pending_duplicate_names,
      pending_canonical_names;
  END IF;

  -- Se uma futura migracao criar nova FK para Pilot, exige nova auditoria.
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON kcu.constraint_catalog = tc.constraint_catalog
     AND kcu.constraint_schema = tc.constraint_schema
     AND kcu.constraint_name = tc.constraint_name
    JOIN information_schema.referential_constraints rc
      ON rc.constraint_catalog = tc.constraint_catalog
     AND rc.constraint_schema = tc.constraint_schema
     AND rc.constraint_name = tc.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_catalog = rc.unique_constraint_catalog
     AND ccu.constraint_schema = rc.unique_constraint_schema
     AND ccu.constraint_name = rc.unique_constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_schema = 'public'
      AND ccu.table_name = 'Pilot'
      AND ccu.column_name = 'id'
      AND (tc.table_name, kcu.column_name) NOT IN (
        ('BatteryResult', 'pilotId'),
        ('LapToLap', 'pilotId'),
        ('SeasonDisqualification', 'pilotId')
      )
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: existe uma nova referencia a Pilot que nao foi auditada.';
  END IF;
END
$$;

-- Uma revisao pendente da 3a bateria continha a variante duplicada no campo
-- operacional usado pela confirmacao. Normaliza apenas reviewPayload.rows;
-- parsedPayload permanece intacto como snapshot da importacao original.
UPDATE "ResultReview" rr
SET
  "reviewPayload" = jsonb_set(
    rr."reviewPayload"::jsonb,
    '{rows}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN row_data.row_value ->> 'fullName' = 'Robério Rosa Barbalho de Ol...'
            THEN jsonb_set(
              row_data.row_value,
              '{fullName}',
              to_jsonb('Robério Rosa Barbalho De Oli...'::text),
              false
            )
          ELSE row_data.row_value
        END
        ORDER BY row_data.ordinality
      )
      FROM jsonb_array_elements(
        CASE
          WHEN jsonb_typeof(rr."reviewPayload"::jsonb -> 'rows') = 'array'
            THEN rr."reviewPayload"::jsonb -> 'rows'
          ELSE '[]'::jsonb
        END
      )
        WITH ORDINALITY AS row_data(row_value, ordinality)
    ),
    false
  ),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE rr.id = 'cmu9a0dde0001l504zsm6s7oy'
  AND rr."batteryId" = 'cmqpi2f550007i9044pcash3z'
  AND rr.status = 'PENDING'
  AND jsonb_typeof(rr."reviewPayload"::jsonb -> 'rows') = 'array'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(
      CASE
        WHEN jsonb_typeof(rr."reviewPayload"::jsonb -> 'rows') = 'array'
          THEN rr."reviewPayload"::jsonb -> 'rows'
        ELSE '[]'::jsonb
      END
    ) AS pending_row(row_value)
    WHERE pending_row.row_value ->> 'fullName' = 'Robério Rosa Barbalho de Ol...'
  );

-- Preserva nome, slug e URL publicos do registro historico. Copia somente
-- metadados auxiliares se estiverem ausentes no registro mantido.
UPDATE "Pilot" keep
SET
  uf = COALESCE(keep.uf, duplicate.uf),
  "displayName" = COALESCE(keep."displayName", duplicate."displayName"),
  active = keep.active OR duplicate.active,
  "createdAt" = LEAST(keep."createdAt", duplicate."createdAt"),
  "updatedAt" = CURRENT_TIMESTAMP
FROM "Pilot" duplicate
CROSS JOIN _pilot_merge_params m
WHERE keep.id = m.keep_id
  AND duplicate.id = m.duplicate_id;

UPDATE "LapToLap" l
SET
  "pilotId" = m.keep_id,
  "updatedAt" = CURRENT_TIMESTAMP
FROM _pilot_merge_params m
WHERE l."pilotId" = m.duplicate_id;

UPDATE "BatteryResult" r
SET
  "pilotId" = m.keep_id,
  "updatedAt" = CURRENT_TIMESTAMP
FROM _pilot_merge_params m
WHERE r."pilotId" = m.duplicate_id;

UPDATE "SeasonDisqualification" d
SET
  "pilotId" = m.keep_id,
  "updatedAt" = CURRENT_TIMESTAMP
FROM _pilot_merge_params m
WHERE d."pilotId" = m.duplicate_id;

DO $$
DECLARE
  remaining_references integer;
BEGIN
  SELECT
    (SELECT count(*) FROM "BatteryResult" r CROSS JOIN _pilot_merge_params m WHERE r."pilotId" = m.duplicate_id)
    + (SELECT count(*) FROM "LapToLap" l CROSS JOIN _pilot_merge_params m WHERE l."pilotId" = m.duplicate_id)
    + (SELECT count(*) FROM "SeasonDisqualification" d CROSS JOIN _pilot_merge_params m WHERE d."pilotId" = m.duplicate_id)
  INTO remaining_references;

  IF remaining_references <> 0 THEN
    RAISE EXCEPTION
      'Unificacao abortada: ainda existem % referencias ao piloto duplicado.',
      remaining_references;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "ResultReview" rr
    WHERE rr.status = 'PENDING'
      AND EXISTS (
        SELECT 1
        FROM jsonb_array_elements(
          CASE
            WHEN jsonb_typeof(rr."reviewPayload"::jsonb -> 'rows') = 'array'
              THEN rr."reviewPayload"::jsonb -> 'rows'
            ELSE '[]'::jsonb
          END
        ) AS pending_row(row_value)
        WHERE pending_row.row_value ->> 'fullName' = 'Robério Rosa Barbalho de Ol...'
      )
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: uma revisao pendente ainda pode recriar o piloto duplicado.';
  END IF;

  IF (
    SELECT count(*)
    FROM "ResultReview" rr
    CROSS JOIN LATERAL jsonb_array_elements(
      CASE
        WHEN jsonb_typeof(rr."reviewPayload"::jsonb -> 'rows') = 'array'
          THEN rr."reviewPayload"::jsonb -> 'rows'
        ELSE '[]'::jsonb
      END
    ) AS review_row(row_value)
    WHERE rr.id = 'cmu9a0dde0001l504zsm6s7oy'
      AND review_row.row_value ->> 'fullName' = 'Robério Rosa Barbalho De Oli...'
  ) <> 1 THEN
    RAISE EXCEPTION
      'Unificacao abortada: a revisao pendente nao ficou ligada ao nome canonico.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "LapToLap" l
    JOIN "BatteryResult" r ON r.id = l."batteryResultId"
    CROSS JOIN _pilot_merge_params m
    WHERE r."pilotId" = m.keep_id
      AND l."pilotId" <> r."pilotId"
  ) THEN
    RAISE EXCEPTION
      'Unificacao abortada: lap-to-lap e resultado ficaram com pilotos diferentes.';
  END IF;
END
$$;

DELETE FROM "Pilot" duplicate
USING _pilot_merge_params m
WHERE duplicate.id = m.duplicate_id;

DO $$
DECLARE
  duplicate_count integer;
  keep_result_count integer;
  active_result_count integer;
  active_points integer;
BEGIN
  SELECT count(*)
  INTO duplicate_count
  FROM "Pilot" p
  CROSS JOIN _pilot_merge_params m
  WHERE p.id = m.duplicate_id;

  SELECT count(*)
  INTO keep_result_count
  FROM "BatteryResult" r
  CROSS JOIN _pilot_merge_params m
  WHERE r."pilotId" = m.keep_id;

  SELECT count(*), COALESCE(sum(r."finalPoints"), 0)
  INTO active_result_count, active_points
  FROM "BatteryResult" r
  JOIN "Battery" b ON b.id = r."batteryId"
  CROSS JOIN _pilot_merge_params m
  WHERE r."pilotId" = m.keep_id
    AND b."seasonId" = 'cmqphy9h20000l704uga1pfza'
    AND b.status = 'CONFIRMED';

  IF duplicate_count <> 0
     OR keep_result_count <> 10
     OR active_result_count <> 3
     OR active_points <> 49 THEN
    RAISE EXCEPTION
      'Unificacao abortada: pos-condicoes invalidas (duplicados %, resultados %, ativos %, pontos %).',
      duplicate_count,
      keep_result_count,
      active_result_count,
      active_points;
  END IF;
END
$$;

-- Recibo final ainda dentro da transacao.
SELECT
  p.id AS "pilotId",
  p."fullName",
  p.slug,
  s.name AS temporada,
  b.number AS bateria,
  r.id AS "resultId",
  r.status,
  r.position,
  r."positionPoints",
  r."poleBonus",
  r."bestLapBonus",
  r."penaltyPoints",
  r."finalPoints"
FROM "Pilot" p
JOIN "BatteryResult" r ON r."pilotId" = p.id
JOIN "Battery" b ON b.id = r."batteryId"
JOIN "Season" s ON s.id = b."seasonId"
CROSS JOIN _pilot_merge_params m
WHERE p.id = m.keep_id
ORDER BY s.year, s.period, b.number;

COMMIT;
