// Velozes app — icon helpers and small race glyphs.
// Icons render as inline SVG built from Lucide's icon data (window.lucide.<PascalName>).
// This avoids the data-lucide -> svg DOM replacement, which conflicts with React
// re-renders (removeChild crashes) on stateful screens.
function _pascal(name) {
  return String(name).split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}
function _camelAttrs(attrs) {
  const out = {};
  for (const k in attrs) {
    const ck = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[ck] = attrs[k];
  }
  return out;
}
function Icon({ name, size = 20, color = "currentColor", strokeWidth = 1.85, style = {} }) {
  const L = window.lucide || {};
  const node = L[_pascal(name)] || (L.icons && L.icons[_pascal(name)]);
  if (!node || !Array.isArray(node)) {
    return React.createElement("span", { style: { display: "inline-block", width: size, height: size, ...style } });
  }
  const children = node.map(([tag, attrs], i) => React.createElement(tag, { key: i, ..._camelAttrs(attrs) }));
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { display: "inline-flex", flex: "none", ...style },
    },
    children
  );
}

// A small CSS checkered-flag square (the one bespoke brand glyph).
function CheckeredFlag({ size = 22, radius = 5 }) {
  return React.createElement("span", {
    style: {
      width: size, height: size, flex: "none", display: "inline-block",
      borderRadius: radius, border: "1px solid var(--border-light)",
      backgroundColor: "#fff",
      backgroundImage:
        "linear-gradient(45deg,#111 25%,transparent 25%,transparent 75%,#111 75%),linear-gradient(45deg,#111 25%,transparent 25%,transparent 75%,#111 75%)",
      backgroundSize: (size / 3) + "px " + (size / 3) + "px",
      backgroundPosition: "0 0," + (size / 6) + "px " + (size / 6) + "px",
    },
  });
}

// Square icon tile used as a section glyph (calendar, trophy, gauge…).
function IconTile({ name, size = 44, iconSize = 22, tone = "muted" }) {
  const bg = tone === "dark" ? "var(--racing-black)" : "var(--surface-muted)";
  const fg = tone === "dark" ? "#fff" : "var(--text-primary)";
  return React.createElement("div", {
    style: {
      width: size, height: size, flex: "none", borderRadius: "var(--radius-md)",
      background: bg, display: "flex", alignItems: "center", justifyContent: "center",
    },
  }, React.createElement(Icon, { name, size: iconSize, color: fg }));
}

// Icons now render as inline SVG, so no hydration pass is needed.
function hydrateIcons() {}

Object.assign(window, { Icon, CheckeredFlag, IconTile, hydrateIcons });
