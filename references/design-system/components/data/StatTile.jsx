import React from "react";
import { TimeValue } from "./TimeValue.jsx";

/** Labeled stat tile — icon + label on top, big tabular value below. */
export function StatTile({ label, value, unit, icon = null, sub, valueTone = "primary", valueSize = "m", style = {}, ...rest }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: 14,
        background: "var(--surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-md)",
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label}
        </span>
        {icon && <span style={{ color: "var(--text-muted)", display: "inline-flex", flex: "none" }}>{icon}</span>}
      </div>
      <TimeValue value={value} unit={unit} size={valueSize} tone={valueTone} />
      {sub && <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>{sub}</span>}
    </div>
  );
}
