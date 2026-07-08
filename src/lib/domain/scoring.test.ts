import { describe, expect, it } from "vitest";
import { buildRanking, calculateFinalPoints, pointsForPosition } from "./scoring";
import { seasonRegulationFor } from "./season-regulations";
import type { BatteryResultInput } from "./types";

function result(input: Partial<BatteryResultInput> & Pick<BatteryResultInput, "pilotId" | "pilotName" | "batteryNumber" | "finalPoints">): BatteryResultInput {
  return {
    batteryId: `b-${input.batteryNumber}`,
    uf: "PB",
    pilotSlug: input.pilotName.toLowerCase(),
    status: "CLASSIFIED",
    position: null,
    positionPoints: 0,
    poleBonus: 0,
    bestLapBonus: 0,
    penaltyPoints: 0,
    ...input,
  };
}

describe("scoring", () => {
  it("uses the official position points table", () => {
    expect(pointsForPosition(1, "CLASSIFIED")).toBe(24);
    expect(pointsForPosition(16, "CLASSIFIED")).toBe(1);
    expect(pointsForPosition(17, "CLASSIFIED")).toBe(0);
    expect(pointsForPosition(1, "NC")).toBe(0);
  });

  it("subtracts positive penalty points", () => {
    expect(calculateFinalPoints({ status: "CLASSIFIED", positionPoints: 22, poleBonus: 0, bestLapBonus: 0, penaltyPoints: 5 })).toBe(17);
  });

  it("does not allow negative final points", () => {
    expect(calculateFinalPoints({ status: "CLASSIFIED", positionPoints: 2, poleBonus: 0, bestLapBonus: 0, penaltyPoints: 5 })).toBe(0);
  });

  it("forces NC to zero without bonuses", () => {
    expect(calculateFinalPoints({ status: "NC", positionPoints: 24, poleBonus: 1, bestLapBonus: 1, penaltyPoints: 0 })).toBe(0);
  });
});

describe("ranking", () => {
  it("discards the worst result only when there are at least two confirmed batteries", () => {
    const ranking = buildRanking(
      [
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 1, finalPoints: 24, position: 1 }),
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 2, finalPoints: 0, position: null, status: "NC" }),
      ],
      [1, 2],
    );

    expect(ranking[0].grossPoints).toBe(24);
    expect(ranking[0].discardedPoints).toBe(0);
    expect(ranking[0].finalPoints).toBe(24);
  });

  it("creates retroactive absences after the pilot first appears", () => {
    const ranking = buildRanking(
      [result({ pilotId: "a", pilotName: "Ana", batteryNumber: 3, finalPoints: 20, position: 3 })],
      [1, 2, 3],
    );

    expect(ranking[0].entries.map((entry) => entry.batteryNumber)).toEqual([1, 2, 3]);
    expect(ranking[0].entries.filter((entry) => entry.status === "ABSENT")).toHaveLength(2);
  });

  it("orders tied final scores by gross points first", () => {
    const ranking = buildRanking(
      [
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 1, finalPoints: 22, position: 2 }),
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 2, finalPoints: 0, status: "NC" }),
        result({ pilotId: "b", pilotName: "Bruno", batteryNumber: 1, finalPoints: 22, position: 2 }),
        result({ pilotId: "b", pilotName: "Bruno", batteryNumber: 2, finalPoints: 2, position: 15 }),
      ],
      [1, 2],
    );

    expect(ranking[0].pilotName).toBe("Bruno");
    expect(ranking[0].finalPoints).toBe(22);
    expect(ranking[1].finalPoints).toBe(22);
  });

  it("keeps 2026.2 pilots with fewer than three participations out of the official rank after four batteries", () => {
    const ranking = buildRanking(
      [
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 1, finalPoints: 30, position: 1 }),
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 2, finalPoints: 30, position: 1 }),
        result({ pilotId: "b", pilotName: "Bruno", batteryNumber: 1, finalPoints: 20, position: 2 }),
        result({ pilotId: "b", pilotName: "Bruno", batteryNumber: 2, finalPoints: 20, position: 2 }),
        result({ pilotId: "b", pilotName: "Bruno", batteryNumber: 3, finalPoints: 20, position: 2 }),
      ],
      [1, 2, 3, 4],
      { regulation: seasonRegulationFor({ year: 2026, period: 2 }) },
    );

    expect(ranking[0].pilotName).toBe("Ana");
    expect(ranking[0].simulatedRank).toBe(1);
    expect(ranking[0].realRank).toBeNull();
    expect(ranking[0].rank).toBe(1);
    expect(ranking[0].rankingStatus).toBe("NOT_COMPETING");
    expect(ranking[1].pilotName).toBe("Bruno");
    expect(ranking[1].realRank).toBe(1);
    expect(ranking[1].rank).toBe(1);
  });

  it("only discards the worst 2026.2 result after more than six confirmed batteries", () => {
    const regulation = seasonRegulationFor({ year: 2026, period: 2 });
    const sixBatteryRanking = buildRanking(
      [
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 1, finalPoints: 24 }),
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 2, finalPoints: 22 }),
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 3, finalPoints: 20 }),
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 4, finalPoints: 18 }),
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 5, finalPoints: 16 }),
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 6, finalPoints: 14 }),
      ],
      [1, 2, 3, 4, 5, 6],
      { regulation },
    );
    const sevenBatteryRanking = buildRanking(
      [
        ...sixBatteryRanking[0].entries
          .filter((entry) => entry.status !== "ABSENT")
          .map((entry) => result({ pilotId: "a", pilotName: "Ana", batteryNumber: entry.batteryNumber, finalPoints: entry.finalPoints })),
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 7, finalPoints: 12 }),
      ],
      [1, 2, 3, 4, 5, 6, 7],
      { regulation },
    );

    expect(sixBatteryRanking[0].discardedPoints).toBe(0);
    expect(sixBatteryRanking[0].finalPoints).toBe(114);
    expect(sevenBatteryRanking[0].discardedPoints).toBe(12);
    expect(sevenBatteryRanking[0].finalPoints).toBe(114);
  });

  it("keeps disqualified pilots visible but outside the official rank", () => {
    const ranking = buildRanking(
      [
        result({ pilotId: "a", pilotName: "Ana", batteryNumber: 1, finalPoints: 24, position: 1 }),
        result({ pilotId: "b", pilotName: "Bruno", batteryNumber: 1, finalPoints: 22, position: 2 }),
      ],
      [1],
      { disqualifiedPilotIds: new Set(["a"]) },
    );

    expect(ranking[0].rankingStatus).toBe("DISQUALIFIED");
    expect(ranking[0].simulatedRank).toBe(1);
    expect(ranking[0].realRank).toBeNull();
    expect(ranking[1].realRank).toBe(1);
  });
});
