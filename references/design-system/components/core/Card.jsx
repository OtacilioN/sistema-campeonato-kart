import React from "react";

/** Surface card — the base container for every grouped block. */
export function Card({ padding = "var(--pad-card)", interactive = false, elevated = false, onClick, children, style = {}, ...rest }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-card)",
        boxShadow: elevated ? "var(--shadow-floating)" : "var(--shadow-card)",
        padding,
        cursor: interactive ? "pointer" : "default",
        transition: "box-shadow .15s ease, transform .1s ease",
        ...style,
      }}
      onMouseEnter={(e) => { if (interactive) e.currentTarget.style.boxShadow = "var(--shadow-floating)"; }}
      onMouseLeave={(e) => { if (interactive) e.currentTarget.style.boxShadow = elevated ? "var(--shadow-floating)" : "var(--shadow-card)"; }}
      {...rest}
    >
      {children}
    </div>
  );
}
