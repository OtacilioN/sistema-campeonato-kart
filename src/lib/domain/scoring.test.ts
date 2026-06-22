import { describe, expect, it } from "vitest";
import { buildRanking, calculateFinalPoints, pointsForPosition } from "./scoring";
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
});
