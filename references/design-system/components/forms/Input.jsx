import React from "react";

/** Form input with label above, optional help/error, mono mode for time fields. */
export function Input({
  label,
  help,
  error,
  warning,
  mono = false,
  prefix = null,
  suffix = null,
  id,
  style = {},
  ...rest
}) {
  const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  const borderColor = error
    ? "var(--danger)"
    : warning
    ? "var(--warning)"
    : "var(--border-strong)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-ui)" }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 44,
          padding: "0 12px",
          background: "var(--surface)",
          border: `1px solid ${borderColor}`,
          borderRadius: "var(--radius-input)",
          transition: "border-color .15s ease, box-shadow .15s ease",
        }}
      >
        {prefix}
        <input
          id={inputId}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: mono ? "var(--font-mono)" : "var(--font-ui)",
            fontSize: mono ? 15 : 14,
            fontVariantNumeric: mono ? "tabular-nums" : "normal",
            color: "var(--text-primary)",
            padding: "11px 0",
            ...style,
          }}
          onFocus={(e) => {
            const wrap = e.currentTarget.parentElement;
            if (wrap && !error && !warning) { wrap.style.borderColor = "var(--brand-red)"; wrap.style.boxShadow = "var(--shadow-focus)"; }
          }}
          onBlur={(e) => {
            const wrap = e.currentTarget.parentElement;
            if (wrap) { wrap.style.borderColor = borderColor; wrap.style.boxShadow = "none"; }
          }}
          {...rest}
        />
        {suffix}
      </div>
      {error && <span style={{ fontSize: 12, color: "var(--danger)" }}>{error}</span>}
      {!error && warning && <span style={{ fontSize: 12, color: "#B45309" }}>{warning}</span>}
      {!error && !warning && help && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{help}</span>}
    </div>
  );
}
