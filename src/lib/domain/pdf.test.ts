import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { parseLapToLap, parseOfficialReport, parseOfficialReportText, validateLapToLap } from "./pdf";
import { namesMatch, pilotSlug, preferredPilotName } from "./text";

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

  it("extracts all November results with short total times and lap gaps", () => {
    const parsed = parseOfficialReportText(`RENTAL
POS # Nome MV TMV TT Gap INT T.U.V TV VM UF
1 14 David Lira 4 01:10.413 15:16.608 --- --- 01:10.919 12 54,20 PE
2 7 Antonio Carlos De Carvalho Segundo 9 01:10.105 15:17.185 0:00.577 0:00.577 01:10.850 12 54,17 PB
3 2 Otacílio Saraiva Maia Neto 2 01:10.797 15:27.761 0:11.153 0:10.576 01:11.086 12 53,55 PB
4 15 Nyclas Queiroz 2 01:10.654 15:31.915 0:15.307 0:04.154 01:11.320 12 53,31 PE
5 11 Bruno Marcos 7 01:11.034 15:33.125 0:16.517 0:01.210 01:11.933 12 53,24 PE
6 5 Leonardo Marinho 4 01:10.165 15:36.818 0:20.210 0:03.693 01:10.322 12 53,03 PE
7 20 Robério Rosa Barbalho De Oliveira 4 01:10.566 15:38.673 0:22.065 0:01.855 01:11.927 12 52,93 PE
8 16 Ygo Lamek 5 01:10.228 15:49.559 0:32.951 0:10.886 01:22.280 12 52,32 PE
9 3 Vinícius Gonçalves Cunha 5 01:12.722 15:50.424 0:33.816 0:00.865 01:13.225 12 52,27 PB
10 10 Albérico Freitas Magalhães 3 01:12.438 16:12.764 0:56.156 0:22.340 01:13.131 12 51,07 PB
11 1 Lucas Alves De Lima 11 01:13.972 15:15.244 - 1 Lap - 1 Lap 01:13.972 11 49,76 PB
12 32 Jaime Antonio De Albuquerque Filho 2 01:10.170 15:27.977 - 1 Lap 0:12.733 01:10.244 11 49,07 PE
13 88 Paulo Eduardo P. P. Machado 10 01:15.734 15:42.993 - 1 Lap 0:15.016 01:16.475 11 48,29 PE
14 17 Aline Xavier 8 01:15.468 15:49.195 - 1 Lap 0:06.202 01:24.637 11 47,98 PB
15 9 Angelica Santos Mello 7 01:14.430 16:06.806 - 1 Lap 0:17.611 01:22.162 11 47,10 PB
NC 4 Andrea De Oliveira Raia 1 01:36.626 15:43.315 - 4 Lap(s) - 3 Lap(s) 01:42.836 8 35,11 PB
Melhor volta: Antonio Carlos De Carvalho Segundo (01:10.105)
Baterias 14/11/2026
BATERIA 06
Corrida
Circuito Paladino
DATA/HORA: 14/11/2026 19:08:24`);

    expect(parsed.messages).toEqual([]);
    expect(parsed.batteryNumber).toBe(6);
    expect(parsed.rows.map((row) => row.fullName)).toEqual([
      "David Lira", "Antonio Carlos De Carvalho Segundo", "Otacílio Saraiva Maia Neto",
      "Nyclas Queiroz", "Bruno Marcos", "Leonardo Marinho", "Robério Rosa Barbalho De Oliveira",
      "Ygo Lamek", "Vinícius Gonçalves Cunha", "Albérico Freitas Magalhães", "Lucas Alves De Lima",
      "Jaime Antonio De Albuquerque Filho", "Paulo Eduardo P. P. Machado", "Aline Xavier",
      "Angelica Santos Mello", "Andrea De Oliveira Raia",
    ]);
    expect(parsed.rows[0].totalTime).toBe("00:15:16.608");
    expect(parsed.rows[1]).toMatchObject({ gapToLeader: "0:00.577", gapToPrevious: "0:00.577", bestLapBonus: 1 });
    expect(parsed.rows.filter((row) => row.bestLapBonus > 0)).toHaveLength(1);
    expect(parsed.rows[10]).toMatchObject({ gapToLeader: "- 1 Lap", gapToPrevious: "- 1 Lap" });
    expect(parsed.rows[11]).toMatchObject({ gapToLeader: "- 1 Lap", gapToPrevious: "0:12.733" });
    expect(parsed.rows[15]).toMatchObject({
      status: "NC", position: null, finalPoints: 0, bestLapBonus: 0,
      totalTime: "00:15:43.315", gapToLeader: "- 4 Lap(s)", gapToPrevious: "- 3 Lap(s)",
    });
  });

  it("keeps Portuguese lap gaps and flags rejected rows instead of silently losing pilots", () => {
    const rejected = "EX 9 Piloto Excluído 2 01:10.000 15:00.000 --- --- 01:11.000 11 69,100 PB";
    const invalidGap = "3 8 Outro Piloto 2 01:10.000 15:00.000 - 1 Lap unknown 01:11.000 11 69,100 PB";
    const parsed = parseOfficialReportText([
      "2 99 Ana Piloto 2 01:10.000 00:15:00.000 -1 volta -2 voltas 01:11.000 11 69,100 PB",
      rejected, invalidGap,
    ].join("\n"));

    expect(parsed.rows).toHaveLength(1);
    expect(parsed.rows[0]).toMatchObject({ totalTime: "00:15:00.000", gapToLeader: "-1 volta", gapToPrevious: "-2 voltas" });
    expect(parsed.messages).toHaveLength(2);
    expect(parsed.messages[0]).toContain(rejected);
    expect(parsed.messages[1]).toContain(invalidGap);
  });
});

describe("lap-to-lap parser", () => {
  it("accepts a confirmed pilot alias but still checks the result's number and times", () => {
    const parsed = {
      pilotName: "Bruno Marcos", pilotNumber: 11, batteryLabel: "BATERIA 06", batteryNumber: 6,
      occurredAtText: null, laps: [], bestLapTime: "01:11.034", bestLapNumber: 7,
      totalTime: "00:15:33.125", rawText: "",
    };
    const input = {
      parsed, pilotName: "Bruno Marcos Santos Lima", pilotNumber: 11,
      bestLapTime: "01:11.034", totalTime: "00:15:33.125",
    };
    expect(validateLapToLap(input).ok).toBe(false);
    expect(validateLapToLap({ ...input, pilotAliases: ["Bruno Marcos"] }).ok).toBe(true);
    expect(validateLapToLap({
      ...input, pilotAliases: ["Bruno Marcos"], pilotNumber: 12, totalTime: "00:15:00.000",
    }).messages).toEqual(["Tempo total do lap-to-lap não confere.", "Número do piloto no lap-to-lap não confere."]);
    expect(validateLapToLap({ ...input, pilotAliases: ["Bruno Marcos"], bestLapTime: "01:10.000" }).ok).toBe(false);
  });

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
    expect(pilotSlug("Robério Rosa Barbalho De Oli...")).toBe("roberio-rosa-barbalho-de-oli");
  });

  it("keeps the most complete pilot name", () => {
    expect(preferredPilotName("Antonio Carlos De Carvalho Silva", "Antonio Carlos De Carvalho S...")).toBe("Antonio Carlos De Carvalho Silva");
    expect(preferredPilotName("Roberio Rosa Barbalho De Oli...", "Robério Rosa Barbalho De Oli...")).toBe("Robério Rosa Barbalho De Oli...");
  });
});
