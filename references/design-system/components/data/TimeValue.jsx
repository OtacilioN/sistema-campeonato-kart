import React from "react";

/** Tabular numeric value (lap time, points, delta). Mono + tabular-nums always. */
export function TimeValue({ value, unit, size = "m", tone = "primary", sign = false, style = {}, ...rest }) {
  const sizes = {
    l: { font: 32, lh: "38px", weight: 700 },
    m: { font: 20, lh: "26px", weight: 600 },
    s: { font: 14, lh: "20px", weight: 500 },
  };
  const s = sizes[size] || sizes.m;
  const tones = {
    primary: "var(--text-primary)",
    brand: "var(--brand-red)",
    positive: "var(--success)",
    negative: "var(--danger)",
    muted: "var(--text-muted)",
  };
  let display = value;
  if (sign && typeof value === "number") display = (value > 0 ? "+" : "") + value;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4, ...style }} {...rest}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: s.font,
          lineHeight: s.lh,
          fontWeight: s.weight,
          fontVariantNumeric: "tabular-nums",
          color: tones[tone] || tones.primary,
          letterSpacing: "-0.01em",
        }}
      >
        {display}
      </span>
      {unit && (
        <span style={{ fontFamily: "var(--font-ui)", fontSize: Math.max(11, s.font * 0.42), fontWeight: 500, color: "var(--text-muted)" }}>
          {unit}
        </span>
      )}
    </span>
  );
}
