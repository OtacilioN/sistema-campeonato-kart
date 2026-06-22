import { calculateFinalPoints, pointsForPosition } from "./scoring";
import type { ParsedOfficialReport, ReviewRow } from "./types";

export type ReviewPayload = {
  batteryLabel: string | null;
  batteryNumber: number | null;
  type: string | null;
  category: string | null;
  circuit: string | null;
  occurredAtText: string | null;
  rows: ReviewRow[];
};

export function reviewPayloadFromOfficialReport(report: ParsedOfficialReport): ReviewPayload {
  return {
    batteryLabel: report.batteryLabel,
    batteryNumber: report.batteryNumber,
    type: report.type,
    category: report.category,
    circuit: report.circuit,
    occurredAtText: report.occurredAtText,
    rows: report.rows,
  };
}

export function parseManualReviewRows(input: string): ReviewRow[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [rawPosition, rawNumber, fullName, uf, rawBestLapNumber, bestLapTime, totalTime, gapToLeader, gapToPrevious, lastLapTime, rawTotalLaps, averageSpeed] = line
        .split(";")
        .map((part) => part.trim());
      const status = rawPosition?.toUpperCase() === "NC" ? "NC" : "CLASSIFIED";
      const position = status === "NC" ? null : Number(rawPosition);
      const positionPoints = pointsForPosition(position, status);

      return {
        fullName,
        uf: uf?.toUpperCase() || null,
        pilotNumber: rawNumber ? Number(rawNumber) : null,
        position,
        status,
        bestLapNumber: rawBestLapNumber ? Number(rawBestLapNumber) : null,
        bestLapTime: bestLapTime || null,
        totalTime: totalTime || null,
        gapToLeader: gapToLeader || null,
        gapToPrevious: gapToPrevious || null,
        lastLapTime: lastLapTime || null,
        totalLaps: rawTotalLaps ? Number(rawTotalLaps) : null,
        averageSpeed: averageSpeed || null,
        positionPoints,
        poleBonus: 0,
        bestLapBonus: 0,
        penaltyPoints: 0,
        penaltyReason: null,
        finalPoints: calculateFinalPoints({ status, positionPoints, poleBonus: 0, bestLapBonus: 0, penaltyPoints: 0 }),
        needsNameReview: false,
      };
    });
}

export function parseReviewRowsFromForm(formData: FormData): ReviewRow[] {
  const count = Number(formData.get("rowCount") ?? 0);
  const rawPoleIndex = String(formData.get("poleIndex") ?? "").trim();
  const poleIndex = /^\d+$/.test(rawPoleIndex) ? Number(rawPoleIndex) : null;

  const rows = Array.from({ length: count }, (_, index) => {
    const status = String(formData.get(`rows.${index}.status`) ?? "CLASSIFIED") as "CLASSIFIED" | "NC";
    const position = status === "NC" ? null : numberOrNull(formData.get(`rows.${index}.position`));
    const positionPoints = pointsForPosition(position, status);
    const bestLapBonus = Number(formData.get(`rows.${index}.bestLapBonus`) ?? 0);
    const penaltyPoints = Number(formData.get(`rows.${index}.penaltyPoints`) ?? 0);
    const poleBonus = index === poleIndex && status !== "NC" ? 1 : 0;

    const row: ReviewRow = {
      fullName: String(formData.get(`rows.${index}.fullName`) ?? "").trim(),
      uf: stringOrNull(formData.get(`rows.${index}.uf`))?.toUpperCase() ?? null,
      pilotNumber: numberOrNull(formData.get(`rows.${index}.pilotNumber`)),
      position,
      status,
      bestLapNumber: numberOrNull(formData.get(`rows.${index}.bestLapNumber`)),
      bestLapTime: stringOrNull(formData.get(`rows.${index}.bestLapTime`)),
      totalTime: stringOrNull(formData.get(`rows.${index}.totalTime`)),
      gapToLeader: stringOrNull(formData.get(`rows.${index}.gapToLeader`)),
      gapToPrevious: stringOrNull(formData.get(`rows.${index}.gapToPrevious`)),
      lastLapTime: stringOrNull(formData.get(`rows.${index}.lastLapTime`)),
      totalLaps: numberOrNull(formData.get(`rows.${index}.totalLaps`)),
      averageSpeed: stringOrNull(formData.get(`rows.${index}.averageSpeed`)),
      positionPoints,
      poleBonus,
      bestLapBonus: status === "NC" ? 0 : bestLapBonus,
      penaltyPoints,
      penaltyReason: stringOrNull(formData.get(`rows.${index}.penaltyReason`)),
      finalPoints: 0,
      needsNameReview: false,
    };

    row.finalPoints = calculateFinalPoints(row);
    return row;
  });

  if (count > 0 && rows.filter((row) => row.poleBonus === 1).length !== 1) {
    throw new Error("Selecione exatamente um piloto classificado como pole position.");
  }

  return rows;
}

export function ensureUniqueReviewPilotNames(rows: Pick<ReviewRow, "fullName">[]) {
  const seen = new Set<string>();

  for (const row of rows) {
    const key = row.fullName.toLowerCase();
    if (seen.has(key)) {
      throw new Error(`Piloto duplicado na bateria: ${row.fullName}`);
    }
    seen.add(key);
  }
}

function numberOrNull(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  if (!stringValue) return null;
  const number = Number(stringValue);
  return Number.isFinite(number) ? number : null;
}

function stringOrNull(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue || null;
}
