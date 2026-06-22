import { describe, expect, it } from "vitest";
import { ensureUniqueReviewPilotNames, parseReviewRowsFromForm } from "./review";

function reviewForm(input: {
  names?: string[];
  poleIndex?: string;
  statuses?: Array<"CLASSIFIED" | "NC">;
  ufs?: Array<string | null>;
}) {
  const formData = new FormData();
  const statuses = input.statuses ?? ["CLASSIFIED", "CLASSIFIED"];
  const names = input.names ?? ["Ana Piloto", "Bruno Piloto"];
  const ufs = input.ufs ?? ["PB", "PB"];

  formData.set("rowCount", String(statuses.length));
  if (input.poleIndex !== undefined) {
    formData.set("poleIndex", input.poleIndex);
  }

  statuses.forEach((status, index) => {
    formData.set(`rows.${index}.position`, status === "NC" ? "" : String(index + 1));
    formData.set(`rows.${index}.pilotNumber`, String(90 + index));
    formData.set(`rows.${index}.fullName`, names[index] ?? `Piloto ${index + 1}`);
    formData.set(`rows.${index}.uf`, ufs[index] ?? "");
    formData.set(`rows.${index}.status`, status);
    formData.set(`rows.${index}.bestLapNumber`, "1");
    formData.set(`rows.${index}.bestLapTime`, "01:10.000");
    formData.set(`rows.${index}.totalTime`, "00:15:00.000");
    formData.set(`rows.${index}.gapToLeader`, "");
    formData.set(`rows.${index}.gapToPrevious`, "");
    formData.set(`rows.${index}.lastLapTime`, "01:10.000");
    formData.set(`rows.${index}.totalLaps`, "11");
    formData.set(`rows.${index}.averageSpeed`, "70,000");
    formData.set(`rows.${index}.penaltyPoints`, "0");
    formData.set(`rows.${index}.penaltyReason`, "");
    formData.set(`rows.${index}.bestLapBonus`, "0");
  });

  return formData;
}

describe("review form parsing", () => {
  it("requires a pole position selection", () => {
    expect(() => parseReviewRowsFromForm(reviewForm({}))).toThrow("Selecione exatamente um piloto classificado como pole position.");
  });

  it("rejects NC as pole position", () => {
    expect(() => parseReviewRowsFromForm(reviewForm({ poleIndex: "0", statuses: ["NC", "CLASSIFIED"] }))).toThrow(
      "Selecione exatamente um piloto classificado como pole position.",
    );
  });

  it("adds pole bonus to exactly one classified pilot", () => {
    const rows = parseReviewRowsFromForm(reviewForm({ poleIndex: "1" }));

    expect(rows.map((row) => row.poleBonus)).toEqual([0, 1]);
    expect(rows[1].finalPoints).toBe(rows[1].positionPoints + 1);
  });

  it("accepts missing UF as optional metadata", () => {
    const rows = parseReviewRowsFromForm(reviewForm({ poleIndex: "1", ufs: [null, "PB"] }));

    expect(rows[0].uf).toBeNull();
    expect(rows[1].uf).toBe("PB");
  });

  it("treats repeated names as conflict even with different UFs", () => {
    const rows = parseReviewRowsFromForm(reviewForm({ names: ["Ana Piloto", "Ana Piloto"], poleIndex: "1", ufs: ["PB", "PE"] }));

    expect(() => ensureUniqueReviewPilotNames(rows)).toThrow("Piloto duplicado na bateria: Ana Piloto");
  });

  it("treats repeated normalized names as conflict", () => {
    const rows = parseReviewRowsFromForm(reviewForm({ names: ["Roberio Rosa Barbalho", "Robério Rosa Barbalho"], poleIndex: "1" }));

    expect(() => ensureUniqueReviewPilotNames(rows)).toThrow("Piloto duplicado na bateria: Robério Rosa Barbalho");
  });
});
