import { describe, expect, it } from "vitest";
import { shortBatteryMonthLabel } from "./labels";

describe("shortBatteryMonthLabel", () => {
  it("abbreviates months from either semester", () => {
    expect(shortBatteryMonthLabel("Janeiro", 1)).toBe("Jan");
    expect(shortBatteryMonthLabel("Julho", 1)).toBe("Jul");
    expect(shortBatteryMonthLabel("Agosto", 2)).toBe("Ago");
    expect(shortBatteryMonthLabel("Setembro", 3)).toBe("Set");
    expect(shortBatteryMonthLabel("Outubro", 4)).toBe("Out");
  });

  it("preserves suffixes and custom labels, and falls back to the battery number", () => {
    expect(shortBatteryMonthLabel("Junho 2", 7)).toBe("Jun 2");
    expect(shortBatteryMonthLabel("Final especial", 7)).toBe("Final especial");
    expect(shortBatteryMonthLabel(null, 1)).toBe("B1");
    expect(shortBatteryMonthLabel("  ", 2)).toBe("B2");
  });
});
