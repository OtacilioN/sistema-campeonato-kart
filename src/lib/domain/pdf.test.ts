import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { parseLapToLap, parseOfficialReport, parseOfficialReportText, validateLapToLap } from "./pdf";
import { namesMatch, pilotSlug } from "./text";

describe("official report parser", () => {
  it("extracts the sample TimingOfficialReport.pdf", async () => {
    const parsed = await parseOfficialReport(await readFile("docs/pdfsExemplo/TimingOfficialReport.pdf"));

    expect(parsed.batteryNumber).toBe(6);
    expect(parsed.circuit).toBe("Circuito Paladino");
    expect(parsed.occurredAtText).toBe("20/06/2026 18:16:50");
    expect(parsed.rows).toHaveLength(16);
    expect(parsed.bestLapPilotName).toBe("Rogério Silva");
    expect(parsed.bestLapTime).toBe("01:10.040");
    expect(parsed.rows.find((row) => row.fullName === "Otacilio Saraiva Maia Neto")).toMatchObject({
      pilotNumber: 99,
      position: 7,
      bestLapNumber: 9,
      bestLapTime: "01:11.805",
      totalTime: "00:15:58.847",
      totalLaps: 11,
      uf: "PB",
    });
    expect(parsed.rows.find((row) => row.fullName === "Rogério Silva")?.bestLapBonus).toBe(1);
  });

  it("accepts official result rows without UF", () => {
    const parsed = parseOfficialReportText(
      [
        "BATERIA 6",
        "Corrida",
        "Circuito Paladino",
        "RENTAL",
        "DATA/HORA: 20/06/2026 18:16:50",
        "Melhor volta: Ana Piloto (01:10.000)",
        "1 99 Ana Piloto 2 01:10.000 00:15:00.000 --- --- 01:11.000 11 69,100",
      ].join("\n"),
    );

    expect(parsed.rows).toHaveLength(1);
    expect(parsed.rows[0]).toMatchObject({
      fullName: "Ana Piloto",
      uf: null,
      bestLapBonus: 1,
    });
  });
});

describe("lap-to-lap parser", () => {
  it("extracts and validates the sample LapToLapReport.pdf", async () => {
    const parsed = await parseLapToLap(await readFile("docs/pdfsExemplo/LapToLapReport.pdf"));

    expect(parsed.pilotName).toBe("Otacilio Saraiva Maia Neto");
    expect(parsed.pilotNumber).toBe(99);
    expect(parsed.batteryNumber).toBe(6);
    expect(parsed.laps).toHaveLength(11);
    expect(parsed.bestLapNumber).toBe(9);
    expect(parsed.bestLapTime).toBe("01:11.805");
    expect(parsed.totalTime).toBe("00:15:58.847");

    const validation = validateLapToLap({
      parsed,
      pilotName: "Otacilio Saraiva Maia Neto",
      pilotNumber: 99,
      bestLapTime: "01:11.805",
      totalTime: "00:15:58.847",
    });

    expect(validation.ok).toBe(true);
  });
});

describe("name normalization", () => {
  it("accepts accents and truncation with ellipsis", () => {
    expect(namesMatch("Antonio Carlos De Carvalho Silva", "Antonio Carlos De Carvalho S...")).toBe(true);
    expect(namesMatch("Otacílio Saraiva Maia Neto", "OTACILIO SARAIVA MAIA NETO")).toBe(true);
    expect(namesMatch("Otacilio Saraiva Maia Neto", "Otacilio Maia")).toBe(false);
  });

  it("builds public pilot slugs", () => {
    expect(pilotSlug("Otacilio Saraiva Maia Neto")).toBe("otacilio-saraiva-maia-neto");
  });
});
