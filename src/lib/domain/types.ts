export type ResultStatusValue = "CLASSIFIED" | "NC" | "ABSENT";

export type BatteryResultInput = {
  pilotId: string;
  pilotName: string;
  pilotSlug: string;
  uf: string | null;
  batteryId: string;
  batteryNumber: number;
  status: ResultStatusValue;
  position: number | null;
  positionPoints: number;
  poleBonus: number;
  bestLapBonus: number;
  penaltyPoints: number;
  finalPoints: number;
};

export type RankingEntry = BatteryResultInput & {
  discarded: boolean;
};

export type RankingRow = {
  rank: number;
  pilotId: string;
  pilotName: string;
  pilotSlug: string;
  uf: string | null;
  grossPoints: number;
  discardedPoints: number;
  finalPoints: number;
  wins: number;
  entries: RankingEntry[];
};

export type ReviewRow = {
  fullName: string;
  uf: string | null;
  pilotNumber: number | null;
  position: number | null;
  status: ResultStatusValue;
  bestLapNumber: number | null;
  bestLapTime: string | null;
  totalTime: string | null;
  gapToLeader: string | null;
  gapToPrevious: string | null;
  lastLapTime: string | null;
  totalLaps: number | null;
  averageSpeed: string | null;
  positionPoints: number;
  poleBonus: number;
  bestLapBonus: number;
  penaltyPoints: number;
  penaltyReason: string | null;
  finalPoints: number;
  needsNameReview: boolean;
};

export type ParsedOfficialReport = {
  seasonDate: string | null;
  batteryLabel: string | null;
  batteryNumber: number | null;
  type: string | null;
  category: string | null;
  circuit: string | null;
  occurredAtText: string | null;
  bestLapPilotName: string | null;
  bestLapTime: string | null;
  rows: ReviewRow[];
  messages: string[];
  rawText: string;
};

export type ParsedLap = {
  competitorNumber: number;
  lapNumber: number;
  lapTime: string;
  deltaBestLap: string | null;
  deltaCategory: string | null;
  accumulatedTime: string | null;
  averageSpeed: string | null;
};

export type ParsedLapToLap = {
  pilotName: string | null;
  pilotNumber: number | null;
  batteryLabel: string | null;
  batteryNumber: number | null;
  occurredAtText: string | null;
  laps: ParsedLap[];
  bestLapTime: string | null;
  bestLapNumber: number | null;
  totalTime: string | null;
  rawText: string;
};

export type LapValidationResult =
  | { ok: true; messages: string[] }
  | { ok: false; messages: string[] };
