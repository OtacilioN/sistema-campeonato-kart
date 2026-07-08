import type { BatteryResultInput, RankingRow } from "./types";
import type { SeasonRegulation } from "./season-regulations";

export const POSITION_POINTS = new Map<number, number>([
  [1, 24],
  [2, 22],
  [3, 20],
  [4, 18],
  [5, 16],
  [6, 14],
  [7, 12],
  [8, 10],
  [9, 8],
  [10, 7],
  [11, 6],
  [12, 5],
  [13, 4],
  [14, 3],
  [15, 2],
  [16, 1],
]);

export function pointsForPosition(position: number | null, status: string) {
  if (status === "NC" || status === "ABSENT" || position == null) {
    return 0;
  }
  return POSITION_POINTS.get(position) ?? 0;
}

export function calculateFinalPoints(input: {
  status: string;
  positionPoints: number;
  poleBonus: number;
  bestLapBonus: number;
  penaltyPoints: number;
}) {
  if (input.status === "NC" || input.status === "ABSENT") {
    return 0;
  }

  return Math.max(
    0,
    input.positionPoints + input.poleBonus + input.bestLapBonus - Math.max(0, input.penaltyPoints),
  );
}

function compareEntriesForDiscard(a: BatteryResultInput, b: BatteryResultInput) {
  if (a.finalPoints !== b.finalPoints) {
    return a.finalPoints - b.finalPoints;
  }

  const aPosition = a.position ?? 999;
  const bPosition = b.position ?? 999;
  if (aPosition !== bPosition) {
    return bPosition - aPosition;
  }

  return a.batteryNumber - b.batteryNumber;
}

function compareRows(a: RankingRow, b: RankingRow) {
  if (a.finalPoints !== b.finalPoints) return b.finalPoints - a.finalPoints;
  if (a.grossPoints !== b.grossPoints) return b.grossPoints - a.grossPoints;

  for (let position = 1; position <= 16; position += 1) {
    const aCount = a.entries.filter((entry) => entry.position === position && entry.status === "CLASSIFIED").length;
    const bCount = b.entries.filter((entry) => entry.position === position && entry.status === "CLASSIFIED").length;
    if (aCount !== bCount) return bCount - aCount;
  }

  const recentBattery = Math.max(
    ...a.entries
      .filter((entry) => b.entries.some((other) => other.batteryNumber === entry.batteryNumber))
      .map((entry) => entry.batteryNumber),
    0,
  );
  if (recentBattery) {
    const aRecent = a.entries.find((entry) => entry.batteryNumber === recentBattery);
    const bRecent = b.entries.find((entry) => entry.batteryNumber === recentBattery);
    const aPosition = aRecent?.position ?? 999;
    const bPosition = bRecent?.position ?? 999;
    if (aPosition !== bPosition) return aPosition - bPosition;
  }

  return a.pilotName.localeCompare(b.pilotName, "pt-BR");
}

function tied(a: RankingRow, b: RankingRow) {
  return compareRows({ ...a, pilotName: "" }, { ...b, pilotName: "" }) === 0;
}

export function buildRanking(
  results: BatteryResultInput[],
  confirmedBatteryNumbers: number[],
  options: {
    regulation?: SeasonRegulation;
    disqualifiedPilotIds?: Set<string>;
  } = {},
) {
  const batteryNumbers = [...confirmedBatteryNumbers].sort((a, b) => a - b);
  const pilots = new Map<string, BatteryResultInput[]>();
  const regulation = options.regulation;
  const disqualifiedPilotIds = options.disqualifiedPilotIds ?? new Set<string>();

  for (const result of results) {
    if (!pilots.has(result.pilotId)) pilots.set(result.pilotId, []);
    pilots.get(result.pilotId)?.push(result);
  }

  const rows: RankingRow[] = [];

  for (const [pilotId, pilotResults] of pilots.entries()) {
    const sample = pilotResults[0];
    const entries = batteryNumbers
      .map((batteryNumber) => {
        const existing = pilotResults.find((result) => result.batteryNumber === batteryNumber);
        if (existing) return { ...existing, discarded: false };
        return {
          pilotId,
          pilotName: sample.pilotName,
          pilotSlug: sample.pilotSlug,
          uf: sample.uf,
          batteryId: `absent-${batteryNumber}`,
          batteryNumber,
          status: "ABSENT" as const,
          position: null,
          positionPoints: 0,
          poleBonus: 0,
          bestLapBonus: 0,
          penaltyPoints: 0,
          finalPoints: 0,
          discarded: false,
        };
      });

    const grossPoints = entries.reduce((sum, entry) => sum + entry.finalPoints, 0);
    let discardedPoints = 0;
    const discardAfterConfirmedBatteries = regulation?.discardAfterConfirmedBatteries ?? 1;
    if (batteryNumbers.length > discardAfterConfirmedBatteries && entries.length > 0) {
      const discard = [...entries].sort(compareEntriesForDiscard)[0];
      const target = entries.find((entry) => entry.batteryNumber === discard.batteryNumber);
      if (target) target.discarded = true;
      discardedPoints = discard.finalPoints;
    }
    const participations = entries.filter((entry) => entry.status !== "ABSENT").length;
    const minimumParticipations = regulation?.minimumParticipations ?? null;
    const eligibilityStartsAfterConfirmedBatteries = regulation?.eligibilityStartsAfterConfirmedBatteries ?? null;
    const enforceMinimumParticipations =
      minimumParticipations != null &&
      eligibilityStartsAfterConfirmedBatteries != null &&
      batteryNumbers.length > eligibilityStartsAfterConfirmedBatteries;
    const disqualified = disqualifiedPilotIds.has(pilotId);
    const rankingStatus = disqualified
      ? "DISQUALIFIED"
      : enforceMinimumParticipations && participations < minimumParticipations
        ? "NOT_COMPETING"
        : "COMPETING";

    rows.push({
      rank: 0,
      simulatedRank: 0,
      realRank: null,
      pilotId,
      pilotName: sample.pilotName,
      pilotSlug: sample.pilotSlug,
      uf: sample.uf,
      grossPoints,
      discardedPoints,
      finalPoints: grossPoints - discardedPoints,
      wins: entries.filter((entry) => entry.position === 1 && entry.status === "CLASSIFIED").length,
      participations,
      rankingStatus,
      rankingStatusLabel:
        rankingStatus === "DISQUALIFIED"
          ? "desclassificado"
          : rankingStatus === "NOT_COMPETING"
            ? "nao competindo"
            : null,
      entries,
    });
  }

  rows.sort(compareRows);
  assignRanks(rows, "simulated");
  assignRanks(rows.filter((row) => row.rankingStatus === "COMPETING"), "real");

  rows.forEach((row) => {
    row.rank = row.realRank ?? row.simulatedRank;
  });

  return rows;
}

function assignRanks(rows: RankingRow[], mode: "simulated" | "real") {
  let previous: RankingRow | null = null;
  let previousRank = 0;

  rows.forEach((row, index) => {
    const rank = previous && tied(previous, row) ? previousRank : index + 1;
    if (mode === "simulated") {
      row.simulatedRank = rank;
    } else {
      row.realRank = rank;
    }
    previous = row;
    previousRank = rank;
  });
}
