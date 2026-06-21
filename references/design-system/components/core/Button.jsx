import React from "react";

/**
 * Velozes primary button family. Variants map to the brand action hierarchy:
 * primary (red), dark (black), secondary (white+border), danger, ghost.
 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  type = "button",
  onClick,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { height: 36, padding: "0 14px", font: 14 },
    md: { height: 44, padding: "0 18px", font: 15 },
    lg: { height: 48, padding: "0 22px", font: 16 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: "var(--brand-red)",
      color: "var(--text-inverse)",
      border: "1px solid var(--brand-red)",
    },
    dark: {
      background: "var(--racing-black)",
      color: "var(--text-inverse)",
      border: "1px solid var(--racing-black)",
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)",
    },
    danger: {
      background: "var(--surface)",
      color: "var(--danger)",
      border: "1px solid var(--danger)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid transparent",
    },
  };
  const v = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: s.height,
        padding: s.padding,
        width: fullWidth ? "100%" : "auto",
        fontFamily: "var(--font-ui)",
        fontSize: s.font,
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: "0.01em",
        borderRadius: "var(--radius-button)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "filter .15s ease, transform .1s ease, background .15s ease",
        whiteSpace: "nowrap",
        ...v,
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "none"; }}
      onMouseEnter={(e) => { if (!disabled && (variant === "primary" || variant === "dark")) e.currentTarget.style.filter = "brightness(0.92)"; else if (!disabled && variant === "ghost") e.currentTarget.style.background = "var(--surface-muted)"; }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
