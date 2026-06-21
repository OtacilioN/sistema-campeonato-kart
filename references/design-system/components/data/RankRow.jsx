import React from "react";
import { TimeValue } from "./TimeValue.jsx";

/** Ranking / podium list row: position badge, avatar, name + meta, points, chevron. */
export function RankRow({
  position,
  name,
  meta,
  points,
  pointsUnit = "pts",
  avatar = null,
  podium = false,
  trailing = null,
  onClick,
  style = {},
  ...rest
}) {
  const isTop3 = podium && position <= 3;
  const posColors = { 1: "var(--brand-red)", 2: "var(--racing-black)", 3: "var(--graphite)" };
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 4px",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
          flex: "none",
          borderRadius: "var(--radius-sm)",
          background: isTop3 ? (posColors[position] || "var(--surface-muted)") : "var(--surface-muted)",
          color: isTop3 ? "var(--text-inverse)" : "var(--text-primary)",
          fontFamily: "var(--font-mono)",
          fontSize: 15,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {position}
      </div>
      {avatar !== null ? (
        avatar
      ) : (
        <div style={{ width: 38, height: 38, flex: "none", borderRadius: "var(--radius-pill)", background: "var(--surface-muted)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 16 }}>
          {name ? name.charAt(0) : "?"}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {name}
        </span>
        {meta && <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>{meta}</span>}
      </div>
      {points != null && <TimeValue value={points} unit={pointsUnit} size="m" />}
      {trailing}
    </div>
  );
}
