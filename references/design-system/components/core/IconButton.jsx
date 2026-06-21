import React from "react";

/** Square icon-only button (header lock, row chevrons, admin row controls). */
export function IconButton({
  variant = "ghost",
  size = 40,
  label = "",
  disabled = false,
  onClick,
  children,
  style = {},
  ...rest
}) {
  const variants = {
    ghost: { background: "transparent", color: "var(--text-primary)", border: "1px solid transparent" },
    muted: { background: "var(--surface-muted)", color: "var(--text-primary)", border: "1px solid transparent" },
    outline: { background: "var(--surface)", color: "var(--text-primary)", border: "1px solid var(--border-light)" },
    dark: { background: "var(--racing-black)", color: "var(--text-inverse)", border: "1px solid var(--racing-black)" },
  };
  const v = variants[variant] || variants.ghost;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flex: "none",
        borderRadius: "var(--radius-sm)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background .15s ease",
        ...v,
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled && variant === "ghost") e.currentTarget.style.background = "var(--surface-muted)"; }}
      onMouseLeave={(e) => { if (variant === "ghost") e.currentTarget.style.background = "transparent"; }}
      {...rest}
    >
      {children}
    </button>
  );
}
