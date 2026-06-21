import React from "react";

/**
 * Status badge — color + icon + text (never color alone). Tones map to the
 * Velozes feedback system: success / warning / danger / info / neutral / brand.
 */
export function Badge({ tone = "neutral", icon = null, children, style = {}, ...rest }) {
  const tones = {
    success: { bg: "var(--success-soft)", fg: "var(--success)" },
    warning: { bg: "var(--warning-soft)", fg: "#B45309" },
    danger: { bg: "var(--danger-soft)", fg: "var(--danger)" },
    info: { bg: "var(--info-soft)", fg: "var(--info)" },
    neutral: { bg: "var(--surface-muted)", fg: "var(--text-secondary)" },
    brand: { bg: "var(--brand-red-soft)", fg: "var(--brand-red-dark)" },
    dark: { bg: "var(--racing-black)", fg: "var(--text-inverse)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        background: t.bg,
        color: t.fg,
        fontFamily: "var(--font-ui)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        lineHeight: 1.3,
        borderRadius: "var(--radius-pill)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}
