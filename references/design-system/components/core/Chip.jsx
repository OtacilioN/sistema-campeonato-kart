import React from "react";

/** Pill chip — filter tabs (months/etapas), selectable segments. */
export function Chip({ active = false, tone = "default", onClick, children, style = {}, ...rest }) {
  const activeStyles = {
    default: { background: "var(--racing-black)", color: "var(--text-inverse)", border: "1px solid var(--racing-black)" },
    brand: { background: "var(--brand-red)", color: "var(--text-inverse)", border: "1px solid var(--brand-red)" },
  };
  const a = activeStyles[tone] || activeStyles.default;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: 40,
        padding: "0 18px",
        fontFamily: "var(--font-ui)",
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        lineHeight: 1,
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        transition: "background .15s ease, color .15s ease",
        whiteSpace: "nowrap",
        ...(active
          ? a
          : {
              background: "var(--surface)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-light)",
            }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
