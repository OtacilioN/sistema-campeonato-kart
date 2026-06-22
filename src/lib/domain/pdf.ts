import { readFile } from "node:fs/promises";
import { calculateFinalPoints, pointsForPosition } from "./scoring";
import { namesMatch } from "./text";
import type { LapValidationResult, ParsedLap, ParsedLapToLap, ParsedOfficialReport, ReviewRow } from "./types";

async function extractText(input: Buffer | Uint8Array | File) {
  const data = input instanceof File ? Buffer.from(await input.arrayBuffer()) : input;
  await ensurePdfNodePolyfills();
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function ensurePdfNodePolyfills() {
  const pdfGlobal = globalThis as unknown as Record<"DOMMatrix" | "ImageData" | "Path2D", unknown>;

  pdfGlobal.DOMMatrix ??= class DOMMatrix {};
  pdfGlobal.ImageData ??= class ImageData {};
  pdfGlobal.Path2D ??= class Path2D {};
}

export async function extractTextFromPdfFile(path: string) {
  return extractText(await readFile(path));
}

function parseBatteryNumber(label: string | null) {
  const match = label?.match(/BATERIA\s+(\d+)/i);
  return match ? Number(match[1]) : null;
}

function parseHeader(text: string) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const batteryLabel = lines.find((line) => /^BATERIA\s+\d+/i.test(line)) ?? null;
  const type = lines.find((line) => /^Corrida$/i.test(line)) ?? null;
  const circuit = lines.find((line) => /^Circuito/i.test(line)) ?? null;
  const category = lines.find((line) => /^RENTAL$/i.test(line)) ?? null;
  const seasonDate = lines.find((line) => /^Baterias\s+\d{2}\/\d{2}\/\d{4}/i.test(line)) ?? null;
  const occurredAtText = text.match(/DATA\/HORA:\s*([0-9/: ]+)/i)?.[1]?.trim() ?? null;
  return { lines, batteryLabel, type, circuit, category, seasonDate, occurredAtText };
}

function parseGap(tokens: string[]) {
  const first = tokens.shift();
  if (!first) return null;
  if (first === "---") return first;
  if (/^\d{2}:\d{2}\.\d{3}$/.test(first)) return first;
  if (/^-\d+$/.test(first) && tokens[0]?.startsWith("volta")) {
    return `${first} ${tokens.shift()}`;
  }
  return first;
}

function parseOfficialRow(line: string): ReviewRow | null {
  const match = line.match(
    /^(NC|\d+)\s+(\d+)\s+(.+?)\s+(\d+)\s+(\d{2}:\d{2}\.\d{3})\s+(\d{2}:\d{2}:\d{2}\.\d{3})\s+(.+?)\s+(\d{2}:\d{2}\.\d{3})\s+(\d+)\s+([\d,]+)(?:\s+([A-Z]{2}))?$/,
  );
  if (!match) return null;

  const [, rawPosition, rawNumber, rawName, rawBestLapNumber, bestLapTime, totalTime, rawGaps, lastLapTime, rawTotalLaps, averageSpeed, uf] = match;
  const gapTokens = rawGaps.split(/\s+/);
  const gapToLeader = parseGap(gapTokens);
  const gapToPrevious = parseGap(gapTokens);
  const status = rawPosition === "NC" ? "NC" : "CLASSIFIED";
  const position = rawPosition === "NC" ? null : Number(rawPosition);
  const positionPoints = pointsForPosition(position, status);

  return {
    fullName: rawName.trim(),
    uf: uf ?? null,
    pilotNumber: Number(rawNumber),
    position,
    status,
    bestLapNumber: Number(rawBestLapNumber),
    bestLapTime,
    totalTime,
    gapToLeader,
    gapToPrevious,
    lastLapTime,
    totalLaps: Number(rawTotalLaps),
    averageSpeed,
    positionPoints,
    poleBonus: 0,
    bestLapBonus: 0,
    penaltyPoints: 0,
    penaltyReason: null,
    finalPoints: calculateFinalPoints({ status, positionPoints, poleBonus: 0, bestLapBonus: 0, penaltyPoints: 0 }),
    needsNameReview: rawName.includes("..."),
  };
}

export async function parseOfficialReport(input: Buffer | Uint8Array | File): Promise<ParsedOfficialReport> {
  const rawText = await extractText(input);
  return parseOfficialReportText(rawText);
}

export function parseOfficialReportText(rawText: string): ParsedOfficialReport {
  const header = parseHeader(rawText);
  const bestLapMatch = rawText.match(/Melhor volta:\s*(.+?)\s+\((\d{2}:\d{2}\.\d{3})\)/i);
  const bestLapPilotName = bestLapMatch?.[1]?.trim() ?? null;
  const bestLapTime = bestLapMatch?.[2] ?? null;
  const rows = header.lines.map(parseOfficialRow).filter((row): row is ReviewRow => Boolean(row));
  const messages: string[] = [];

  for (const row of rows) {
    if (row.status !== "NC" && bestLapTime && row.bestLapTime === bestLapTime) {
      row.bestLapBonus = 1;
      row.finalPoints = calculateFinalPoints(row);
    }
  }

  if (!rows.length) {
    messages.push("Nenhuma linha de resultado foi encontrada no PDF oficial.");
  }

  return {
    seasonDate: header.seasonDate,
    batteryLabel: header.batteryLabel,
    batteryNumber: parseBatteryNumber(header.batteryLabel),
    type: header.type,
    category: header.category,
    circuit: header.circuit,
    occurredAtText: header.occurredAtText,
    bestLapPilotName,
    bestLapTime,
    rows,
    messages,
    rawText,
  };
}

function parseLapLine(line: string): ParsedLap | null {
  const match = line.match(/^(\d+)\s+(\d+)\s+(\d{2}:\d{2}\.\d{3})\s+(\d{2}:\d{2}\.\d{3})\s+(\d{2}:\d{2}\.\d{3})\s+(\d{2}:\d{2}:\d{2}\.\d{3})\s+([\d,]+)$/);
  if (!match) return null;

  return {
    competitorNumber: Number(match[1]),
    lapNumber: Number(match[2]),
    lapTime: match[3],
    deltaBestLap: match[4],
    deltaCategory: match[5],
    accumulatedTime: match[6],
    averageSpeed: match[7],
  };
}

export async function parseLapToLap(input: Buffer | Uint8Array | File): Promise<ParsedLapToLap> {
  const rawText = await extractText(input);
  const header = parseHeader(rawText);
  const nameMatch = rawText.match(/RENTAL\s+([\s\S]+?)\s+#\s+VLT/);
  const pilotName = nameMatch?.[1]?.replace(/\s+/g, " ").trim() ?? null;
  const laps = header.lines.map(parseLapLine).filter((lap): lap is ParsedLap => Boolean(lap));
  const best = [...laps].sort((a, b) => a.lapTime.localeCompare(b.lapTime))[0];
  const last = laps.at(-1);

  return {
    pilotName,
    pilotNumber: laps[0]?.competitorNumber ?? null,
    batteryLabel: header.batteryLabel,
    batteryNumber: parseBatteryNumber(header.batteryLabel),
    occurredAtText: header.occurredAtText,
    laps,
    bestLapTime: best?.lapTime ?? null,
    bestLapNumber: best?.lapNumber ?? null,
    totalTime: last?.accumulatedTime ?? null,
    rawText,
  };
}

export function validateLapToLap(input: {
  parsed: ParsedLapToLap;
  pilotName: string;
  pilotNumber: number | null;
  bestLapTime: string | null;
  totalTime: string | null;
}): LapValidationResult {
  const messages: string[] = [];

  if (!input.parsed.pilotName || !namesMatch(input.pilotName, input.parsed.pilotName)) {
    messages.push("Nome do lap-to-lap não confere.");
  }
  if (input.bestLapTime && input.parsed.bestLapTime !== input.bestLapTime) {
    messages.push("Melhor volta do lap-to-lap não confere.");
  }
  if (input.totalTime && input.parsed.totalTime !== input.totalTime) {
    messages.push("Tempo total do lap-to-lap não confere.");
  }
  if (
    input.pilotNumber != null &&
    input.parsed.pilotNumber != null &&
    input.pilotNumber !== input.parsed.pilotNumber
  ) {
    messages.push("Número do piloto no lap-to-lap não confere.");
  }

  return messages.length ? { ok: false, messages } : { ok: true, messages: ["Lap-to-lap validado com sucesso."] };
}
