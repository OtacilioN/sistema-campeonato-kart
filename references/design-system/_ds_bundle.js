/* @ds-bundle: {"format":3,"namespace":"VelozesDesignSystem_32dd15","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"RankRow","sourcePath":"components/data/RankRow.jsx"},{"name":"StatTile","sourcePath":"components/data/StatTile.jsx"},{"name":"TimeValue","sourcePath":"components/data/TimeValue.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"2cd36648d68f","components/core/Button.jsx":"7ba69558ba23","components/core/Card.jsx":"5dbb9795179f","components/core/Chip.jsx":"ccf240f78831","components/core/IconButton.jsx":"3d2e5822f9fe","components/data/RankRow.jsx":"fb2876380607","components/data/StatTile.jsx":"5f0ae2d74494","components/data/TimeValue.jsx":"714eba7c8258","components/forms/Input.jsx":"9f81126466be","ui_kits/velozes-app/AdminScreen.jsx":"cc6865b248c9","ui_kits/velozes-app/App.jsx":"a5d0813628dd","ui_kits/velozes-app/CalendarScreen.jsx":"93285320605a","ui_kits/velozes-app/Charts.jsx":"c59db8dab96e","ui_kits/velozes-app/Chrome.jsx":"b5b6ede8aaeb","ui_kits/velozes-app/HomeScreen.jsx":"e9af3fee30ce","ui_kits/velozes-app/ProfileScreen.jsx":"92fa961758b0","ui_kits/velozes-app/RaceScreen.jsx":"3f9ade67b107","ui_kits/velozes-app/RankingScreen.jsx":"b402d219294d","ui_kits/velozes-app/data.js":"28e22b9d5924","ui_kits/velozes-app/icons.jsx":"98ebbb12307b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VelozesDesignSystem_32dd15 = window.VelozesDesignSystem_32dd15 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Status badge — color + icon + text (never color alone). Tones map to the
 * Velozes feedback system: success / warning / danger / info / neutral / brand.
 */
function Badge({
  tone = "neutral",
  icon = null,
  children,
  style = {},
  ...rest
}) {
  const tones = {
    success: {
      bg: "var(--success-soft)",
      fg: "var(--success)"
    },
    warning: {
      bg: "var(--warning-soft)",
      fg: "#B45309"
    },
    danger: {
      bg: "var(--danger-soft)",
      fg: "var(--danger)"
    },
    info: {
      bg: "var(--info-soft)",
      fg: "var(--info)"
    },
    neutral: {
      bg: "var(--surface-muted)",
      fg: "var(--text-secondary)"
    },
    brand: {
      bg: "var(--brand-red-soft)",
      fg: "var(--brand-red-dark)"
    },
    dark: {
      bg: "var(--racing-black)",
      fg: "var(--text-inverse)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Velozes primary button family. Variants map to the brand action hierarchy:
 * primary (red), dark (black), secondary (white+border), danger, ghost.
 */
function Button({
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
    sm: {
      height: 36,
      padding: "0 14px",
      font: 14
    },
    md: {
      height: 44,
      padding: "0 18px",
      font: 15
    },
    lg: {
      height: 48,
      padding: "0 22px",
      font: 16
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--brand-red)",
      color: "var(--text-inverse)",
      border: "1px solid var(--brand-red)"
    },
    dark: {
      background: "var(--racing-black)",
      color: "var(--text-inverse)",
      border: "1px solid var(--racing-black)"
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)"
    },
    danger: {
      background: "var(--surface)",
      color: "var(--danger)",
      border: "1px solid var(--danger)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid transparent"
    }
  };
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    onClick: onClick,
    disabled: disabled,
    style: {
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
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.98)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.filter = "none";
    },
    onMouseEnter: e => {
      if (!disabled && (variant === "primary" || variant === "dark")) e.currentTarget.style.filter = "brightness(0.92)";else if (!disabled && variant === "ghost") e.currentTarget.style.background = "var(--surface-muted)";
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Surface card — the base container for every grouped block. */
function Card({
  padding = "var(--pad-card)",
  interactive = false,
  elevated = false,
  onClick,
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      background: "var(--surface)",
      border: "1px solid var(--border-light)",
      borderRadius: "var(--radius-card)",
      boxShadow: elevated ? "var(--shadow-floating)" : "var(--shadow-card)",
      padding,
      cursor: interactive ? "pointer" : "default",
      transition: "box-shadow .15s ease, transform .1s ease",
      ...style
    },
    onMouseEnter: e => {
      if (interactive) e.currentTarget.style.boxShadow = "var(--shadow-floating)";
    },
    onMouseLeave: e => {
      if (interactive) e.currentTarget.style.boxShadow = elevated ? "var(--shadow-floating)" : "var(--shadow-card)";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Pill chip — filter tabs (months/etapas), selectable segments. */
function Chip({
  active = false,
  tone = "default",
  onClick,
  children,
  style = {},
  ...rest
}) {
  const activeStyles = {
    default: {
      background: "var(--racing-black)",
      color: "var(--text-inverse)",
      border: "1px solid var(--racing-black)"
    },
    brand: {
      background: "var(--brand-red)",
      color: "var(--text-inverse)",
      border: "1px solid var(--brand-red)"
    }
  };
  const a = activeStyles[tone] || activeStyles.default;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
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
      ...(active ? a : {
        background: "var(--surface)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border-light)"
      }),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square icon-only button (header lock, row chevrons, admin row controls). */
function IconButton({
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
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid transparent"
    },
    muted: {
      background: "var(--surface-muted)",
      color: "var(--text-primary)",
      border: "1px solid transparent"
    },
    outline: {
      background: "var(--surface)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-light)"
    },
    dark: {
      background: "var(--racing-black)",
      color: "var(--text-inverse)",
      border: "1px solid var(--racing-black)"
    }
  };
  const v = variants[variant] || variants.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    onClick: onClick,
    disabled: disabled,
    style: {
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
      ...style
    },
    onMouseEnter: e => {
      if (!disabled && variant === "ghost") e.currentTarget.style.background = "var(--surface-muted)";
    },
    onMouseLeave: e => {
      if (variant === "ghost") e.currentTarget.style.background = "transparent";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/TimeValue.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tabular numeric value (lap time, points, delta). Mono + tabular-nums always. */
function TimeValue({
  value,
  unit,
  size = "m",
  tone = "primary",
  sign = false,
  style = {},
  ...rest
}) {
  const sizes = {
    l: {
      font: 32,
      lh: "38px",
      weight: 700
    },
    m: {
      font: 20,
      lh: "26px",
      weight: 600
    },
    s: {
      font: 14,
      lh: "20px",
      weight: 500
    }
  };
  const s = sizes[size] || sizes.m;
  const tones = {
    primary: "var(--text-primary)",
    brand: "var(--brand-red)",
    positive: "var(--success)",
    negative: "var(--danger)",
    muted: "var(--text-muted)"
  };
  let display = value;
  if (sign && typeof value === "number") display = (value > 0 ? "+" : "") + value;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: 4,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: s.font,
      lineHeight: s.lh,
      fontWeight: s.weight,
      fontVariantNumeric: "tabular-nums",
      color: tones[tone] || tones.primary,
      letterSpacing: "-0.01em"
    }
  }, display), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: Math.max(11, s.font * 0.42),
      fontWeight: 500,
      color: "var(--text-muted)"
    }
  }, unit));
}
Object.assign(__ds_scope, { TimeValue });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/TimeValue.jsx", error: String((e && e.message) || e) }); }

// components/data/RankRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Ranking / podium list row: position badge, avatar, name + meta, points, chevron. */
function RankRow({
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
  const posColors = {
    1: "var(--brand-red)",
    2: "var(--racing-black)",
    3: "var(--graphite)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 4px",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 34,
      height: 34,
      flex: "none",
      borderRadius: "var(--radius-sm)",
      background: isTop3 ? posColors[position] || "var(--surface-muted)" : "var(--surface-muted)",
      color: isTop3 ? "var(--text-inverse)" : "var(--text-primary)",
      fontFamily: "var(--font-mono)",
      fontSize: 15,
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums"
    }
  }, position), avatar !== null ? avatar : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      flex: "none",
      borderRadius: "var(--radius-pill)",
      background: "var(--surface-muted)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)",
      fontSize: 16
    }
  }, name ? name.charAt(0) : "?"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 16,
      fontWeight: 600,
      color: "var(--text-primary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, name), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, meta)), points != null && /*#__PURE__*/React.createElement(__ds_scope.TimeValue, {
    value: points,
    unit: pointsUnit,
    size: "m"
  }), trailing);
}
Object.assign(__ds_scope, { RankRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/RankRow.jsx", error: String((e && e.message) || e) }); }

// components/data/StatTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Labeled stat tile — icon + label on top, big tabular value below. */
function StatTile({
  label,
  value,
  unit,
  icon = null,
  sub,
  valueTone = "primary",
  valueSize = "m",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      padding: 14,
      background: "var(--surface)",
      border: "1px solid var(--border-light)",
      borderRadius: "var(--radius-md)",
      minWidth: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--text-secondary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      display: "inline-flex",
      flex: "none"
    }
  }, icon)), /*#__PURE__*/React.createElement(__ds_scope.TimeValue, {
    value: value,
    unit: unit,
    size: valueSize,
    tone: valueTone
  }), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, sub));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Form input with label above, optional help/error, mono mode for time fields. */
function Input({
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
  const borderColor = error ? "var(--danger)" : warning ? "var(--warning)" : "var(--border-strong)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: "var(--font-ui)"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minHeight: 44,
      padding: "0 12px",
      background: "var(--surface)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-input)",
      transition: "border-color .15s ease, box-shadow .15s ease"
    }
  }, prefix, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    style: {
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
      ...style
    },
    onFocus: e => {
      const wrap = e.currentTarget.parentElement;
      if (wrap && !error && !warning) {
        wrap.style.borderColor = "var(--brand-red)";
        wrap.style.boxShadow = "var(--shadow-focus)";
      }
    },
    onBlur: e => {
      const wrap = e.currentTarget.parentElement;
      if (wrap) {
        wrap.style.borderColor = borderColor;
        wrap.style.boxShadow = "none";
      }
    }
  }, rest)), suffix), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--danger)"
    }
  }, error), !error && warning && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#B45309"
    }
  }, warning), !error && !warning && help && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, help));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/AdminScreen.jsx
try { (() => {
// Velozes — Painel Admin
function AdminScreen({
  onBack
}) {
  const {
    Card,
    Button,
    Badge,
    Input
  } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const a = D.admin;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    title: "Admin",
    dark: true,
    onBack: onBack,
    sub: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
      name: "shield-check",
      size: 14,
      color: "#fff"
    }), " Autenticado como administrador")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "calendar",
    tone: "dark"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, "Selecione o evento"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 16,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, a.event.circuit), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, a.event.city, " \u2022 ", a.event.date)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 20,
    color: "var(--text-muted)"
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, "Importar resultado"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)",
      marginBottom: 12
    }
  }, "Escolha como deseja inserir ou atualizar os resultados."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      textAlign: "left",
      border: "1px solid var(--border-light)",
      background: "var(--surface)",
      borderRadius: "var(--radius-md)",
      padding: 14,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "file-text",
    iconSize: 20,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 700,
      color: "var(--text-primary)",
      marginTop: 10
    }
  }, "Upload PDF oficial"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, "Importe o resultado oficial publicado pela organiza\xE7\xE3o.")), /*#__PURE__*/React.createElement("button", {
    style: {
      textAlign: "left",
      border: "1px solid var(--border-light)",
      background: "var(--surface)",
      borderRadius: "var(--radius-md)",
      padding: 14,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "keyboard",
    iconSize: 20,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 700,
      color: "var(--text-primary)",
      marginTop: 10
    }
  }, "Inser\xE7\xE3o manual"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, "Digite ou edite os resultados manualmente.")))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 22,
    color: "var(--text-primary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, "P\xF3dio / resultado")), /*#__PURE__*/React.createElement("button", {
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)",
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, "Editar resultado ", /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 15
  }))), a.result.map((row, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 40,
      flex: "none",
      borderRadius: "var(--radius-sm)",
      background: "var(--surface-muted)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 14,
      color: "var(--text-primary)"
    }
  }, row.pos), /*#__PURE__*/React.createElement(Avatar, {
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      minHeight: 40,
      padding: "0 12px",
      border: "1px solid var(--border-light)",
      borderRadius: "var(--radius-input)",
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      color: "var(--text-primary)"
    }
  }, row.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 92,
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 40,
      padding: "0 8px",
      border: "1px solid var(--border-light)",
      borderRadius: "var(--radius-input)",
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--text-muted)",
      fontVariantNumeric: "tabular-nums"
    }
  }, "--:--.---"), /*#__PURE__*/React.createElement(Icon, {
    name: "grip-vertical",
    size: 18,
    color: "var(--text-muted)"
  }))), /*#__PURE__*/React.createElement("button", {
    style: {
      width: "100%",
      border: "1px dashed var(--border-strong)",
      background: "transparent",
      borderRadius: "var(--radius-md)",
      padding: "11px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-secondary)",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 18
  }), " Adicionar competidor"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "gavel",
      size: 16
    })
  }, "Aplicar puni\xE7\xE3o"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "pencil",
      size: 16
    })
  }, "Editar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "calculator",
      size: 16,
      color: "#fff"
    })
  }, "Recalcular"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: 12,
      background: "var(--warning-soft)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 20,
    color: "#B45309"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("b", null, "Nome duplicado:"), " \"Bruno Costa\" aparece em outro evento.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: 12,
      background: "var(--info-soft)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user-plus",
    size: 20,
    color: "var(--info)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("b", null, "Piloto novo:"), " \"Thiago Oliveira\" ser\xE1 cadastrado."))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 20,
    color: "var(--text-primary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, "Importa\xE7\xF5es recentes")), a.imports.map((imp, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 0",
      borderTop: i ? "1px solid var(--border-light)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      flex: "none",
      borderRadius: "var(--radius-sm)",
      background: "var(--danger-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 18,
    color: "var(--danger)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-primary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, imp.file), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--text-muted)"
    }
  }, imp.at)), /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "circle-check",
      size: 12
    })
  }, imp.status), /*#__PURE__*/React.createElement(Icon, {
    name: "ellipsis-vertical",
    size: 18,
    color: "var(--text-muted)"
  }))))));
}
Object.assign(window, {
  AdminScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/AdminScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/App.jsx
try { (() => {
// Velozes app — orchestrator. Routes between screens and the admin login sheet.
function App() {
  const {
    Button,
    Input
  } = window.VelozesDesignSystem_32dd15;
  const [screen, setScreen] = React.useState("home"); // home|calendar|ranking|drivers|profile|race|admin
  const [navTab, setNavTab] = React.useState("home");
  const [adminGate, setAdminGate] = React.useState(false);
  React.useEffect(() => {
    hydrateIcons();
  });
  const go = (s, tab) => {
    setScreen(s);
    if (tab) setNavTab(tab);
    window.scrollTo(0, 0);
  };
  const onNav = id => {
    if (id === "drivers") {
      go("profile", "drivers");
    } else {
      go(id, id);
    }
  };
  const openProfile = () => go("profile", "drivers");
  const openRace = () => go("race", navTab);
  const showAdmin = () => setAdminGate(true);
  let content;
  if (screen === "home") content = /*#__PURE__*/React.createElement(HomeScreen, {
    onNav: onNav,
    onOpenProfile: openProfile,
    onLock: showAdmin
  });else if (screen === "calendar") content = /*#__PURE__*/React.createElement(CalendarScreen, {
    onBack: () => go("home", "home"),
    onLock: showAdmin
  });else if (screen === "ranking") content = /*#__PURE__*/React.createElement(RankingScreen, {
    onLock: showAdmin,
    onOpenProfile: openProfile
  });else if (screen === "profile") content = /*#__PURE__*/React.createElement(ProfileScreen, {
    onBack: () => go(navTab === "drivers" ? "home" : navTab, "home"),
    onOpenRace: openRace
  });else if (screen === "race") content = /*#__PURE__*/React.createElement(RaceScreen, {
    onBack: () => go("profile", "drivers")
  });else if (screen === "admin") content = /*#__PURE__*/React.createElement(AdminScreen, {
    onBack: () => go("home", "home")
  });
  const showNav = ["home", "calendar", "ranking", "profile"].includes(screen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100%",
      background: "var(--off-white)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, content), showNav && /*#__PURE__*/React.createElement(BottomNav, {
    active: navTab,
    onNav: onNav
  }), adminGate && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 50,
      background: "rgba(7,7,7,.55)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center"
    },
    onClick: () => setAdminGate(false)
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 440,
      background: "var(--surface)",
      borderRadius: "var(--radius-modal) var(--radius-modal) 0 0",
      padding: 24,
      boxShadow: "var(--shadow-floating)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 4,
      borderRadius: 999,
      background: "var(--border-strong)",
      margin: "0 auto 18px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "var(--radius-md)",
      background: "var(--racing-black)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 22,
      color: "var(--text-primary)"
    }
  }, "Acesso administrativo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, "Informe a senha para continuar."))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "16px 0"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Senha",
    type: "password",
    defaultValue: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    suffix: /*#__PURE__*/React.createElement(Icon, {
      name: "eye",
      size: 18,
      color: "var(--text-muted)"
    })
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "dark",
    size: "lg",
    fullWidth: true,
    onClick: () => {
      setAdminGate(false);
      go("admin");
    }
  }, "Entrar"))));
}
Object.assign(window, {
  App
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/CalendarScreen.jsx
try { (() => {
// Velozes — Calendário screen
function CalendarScreen({
  onBack,
  onLock
}) {
  const {
    Card,
    Chip,
    Badge
  } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const [tab, setTab] = React.useState("prox");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    title: "Calend\xE1rio",
    onBack: onBack,
    onLock: onLock
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    active: tab === "prox",
    onClick: () => setTab("prox")
  }, "Pr\xF3ximos"), /*#__PURE__*/React.createElement(Chip, {
    active: tab === "ant",
    onClick: () => setTab("ant")
  }, "Anteriores")), /*#__PURE__*/React.createElement(SectionHead, {
    icon: "calendar",
    title: "Pr\xF3ximos eventos",
    sub: "Acompanhe os principais eventos e planeje sua temporada."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--gap-card)"
    }
  }, D.events.map((e, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    interactive: true,
    style: e.next ? {
      borderColor: "var(--border-strong)"
    } : {}
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: 58,
      textAlign: "center",
      borderRight: "1px solid var(--border-light)",
      paddingRight: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.06em",
      color: "var(--text-muted)"
    }
  }, e.mon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 28,
      fontWeight: 700,
      color: "var(--text-primary)",
      lineHeight: 1.1
    }
  }, e.day), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--text-muted)"
    }
  }, e.dow)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, e.next && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 12
    })
  }, "Pr\xF3ximo evento")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 19,
      color: "var(--text-primary)",
      lineHeight: 1.15
    }
  }, e.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      marginTop: 6,
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 15,
    color: "var(--text-muted)"
  }), e.circuit), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-muted)",
      marginLeft: 20
    }
  }, e.city), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      marginTop: 6,
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 15,
    color: "var(--text-muted)"
  }), e.inDays)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: 64,
      height: 64,
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-light)",
      background: "var(--surface-muted)",
      alignSelf: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "48",
    height: "48",
    viewBox: "0 0 110 110"
  }, /*#__PURE__*/React.createElement("path", {
    d: e.track,
    fill: "none",
    stroke: "var(--text-secondary)",
    strokeWidth: "4",
    strokeLinejoin: "round"
  }))))))), /*#__PURE__*/React.createElement(Card, {
    interactive: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "calendar-clock"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, "Ver eventos anteriores"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, "Consulte o calend\xE1rio completo de eventos j\xE1 realizados.")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 20,
    color: "var(--text-muted)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 14
  }), " Datas e locais sujeitos a altera\xE7\xE3o.")));
}
Object.assign(window, {
  CalendarScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/CalendarScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/Charts.jsx
try { (() => {
// Velozes app — lightweight inline-SVG charts (mobile, legible).
const RED = "#E10600";
const GRID = "#E2E2E6";
const MUTED = "#7A7A85";
function Sparkline({
  data,
  width = 120,
  height = 56
}) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => {
    const x = i / (data.length - 1) * (width - 8) + 4;
    const y = height - 6 - (v - min) / rng * (height - 14);
    return [x, y];
  });
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const last = pts[pts.length - 1];
  return /*#__PURE__*/React.createElement("svg", {
    width: width,
    height: height,
    viewBox: `0 0 ${width} ${height}`
  }, /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: RED,
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: last[0],
    cy: last[1],
    r: "3.2",
    fill: RED
  }));
}

// Evolution: ranking position (lower = better) — y inverted, labels 1º..20º
function EvolutionChart({
  data,
  width = 380,
  height = 200
}) {
  const padL = 34,
    padR = 12,
    padT = 14,
    padB = 26;
  const w = width - padL - padR,
    h = height - padT - padB;
  const yTicks = [1, 5, 10, 15, 20];
  const yFor = pos => padT + (pos - 1) / 19 * h; // 1 at top
  const xFor = i => padL + i / (data.length - 1) * w;
  const pts = data.map((v, i) => [xFor(i), yFor(v)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${width} ${height}`,
    style: {
      display: "block"
    }
  }, yTicks.map(t => /*#__PURE__*/React.createElement("g", {
    key: t
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: yFor(t),
    x2: width - padR,
    y2: yFor(t),
    stroke: GRID,
    strokeWidth: "1",
    strokeDasharray: "3 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 8,
    y: yFor(t) + 4,
    textAnchor: "end",
    fontSize: "11",
    fontFamily: "JetBrains Mono, monospace",
    fill: MUTED
  }, t, "\xBA"))), /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: RED,
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p[0],
    cy: p[1],
    r: "3.4",
    fill: "#fff",
    stroke: RED,
    strokeWidth: "2"
  })), data.map((_, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: xFor(i),
    y: height - 6,
    textAnchor: "middle",
    fontSize: "10",
    fontFamily: "JetBrains Mono, monospace",
    fill: MUTED
  }, i + 1)));
}

// Lap-by-lap: time per lap (seconds). Best lap highlighted in red.
function LapChart({
  laps,
  width = 380,
  height = 200
}) {
  const padL = 34,
    padR = 14,
    padT = 14,
    padB = 26;
  const w = width - padL - padR,
    h = height - padT - padB;
  const max = Math.max(...laps),
    min = Math.min(...laps);
  const lo = Math.floor(min - 0.5),
    hi = Math.ceil(max + 0.5);
  const yFor = v => padT + (1 - (v - lo) / (hi - lo)) * h;
  const xFor = i => padL + i / (laps.length - 1) * w;
  const pts = laps.map((v, i) => [xFor(i), yFor(v)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const bestIdx = laps.indexOf(min);
  const ticks = [lo, lo + (hi - lo) / 3, lo + 2 * (hi - lo) / 3, hi].map(v => Math.round(v * 10) / 10);
  const xLabels = [1, 4, 7, 10, 13, 16, 18];
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${width} ${height}`,
    style: {
      display: "block"
    }
  }, ticks.map(t => /*#__PURE__*/React.createElement("g", {
    key: t
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: yFor(t),
    x2: width - padR,
    y2: yFor(t),
    stroke: GRID,
    strokeWidth: "1",
    strokeDasharray: "3 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 6,
    y: yFor(t) + 4,
    textAnchor: "end",
    fontSize: "10",
    fontFamily: "JetBrains Mono, monospace",
    fill: MUTED
  }, t.toFixed(1)))), /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: yFor(min),
    x2: width - padR,
    y2: yFor(min),
    stroke: RED,
    strokeWidth: "1",
    strokeDasharray: "2 3",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: "#55555F",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p[0],
    cy: p[1],
    r: i === bestIdx ? 4 : 2.6,
    fill: i === bestIdx ? RED : "#55555F",
    stroke: "#fff",
    strokeWidth: i === bestIdx ? 1.5 : 0
  })), xLabels.map(n => /*#__PURE__*/React.createElement("text", {
    key: n,
    x: xFor(n - 1),
    y: height - 6,
    textAnchor: "middle",
    fontSize: "10",
    fontFamily: "JetBrains Mono, monospace",
    fill: MUTED
  }, n)));
}

// Delta between consecutive laps — bars above/below zero (improve=green, worse=red)
function DeltaChart({
  laps,
  width = 380,
  height = 150
}) {
  const padL = 34,
    padR = 14,
    padT = 12,
    padB = 26;
  const w = width - padL - padR,
    h = height - padT - padB;
  const deltas = laps.slice(1).map((v, i) => v - laps[i]);
  const maxAbs = Math.max(1.5, ...deltas.map(d => Math.abs(d)));
  const zeroY = padT + h / 2;
  const barW = w / deltas.length * 0.6;
  const xFor = i => padL + (i + 0.5) * (w / deltas.length);
  const ticks = [-2, -1, 0, 1, 2];
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${width} ${height}`,
    style: {
      display: "block"
    }
  }, ticks.map(t => {
    const y = zeroY - t / maxAbs * (h / 2);
    return /*#__PURE__*/React.createElement("g", {
      key: t
    }, /*#__PURE__*/React.createElement("line", {
      x1: padL,
      y1: y,
      x2: width - padR,
      y2: y,
      stroke: t === 0 ? "#C9C9D1" : GRID,
      strokeWidth: "1",
      strokeDasharray: t === 0 ? "none" : "3 4"
    }), /*#__PURE__*/React.createElement("text", {
      x: padL - 6,
      y: y + 4,
      textAnchor: "end",
      fontSize: "9.5",
      fontFamily: "JetBrains Mono, monospace",
      fill: MUTED
    }, t > 0 ? "+" + t : t, ".0"));
  }), deltas.map((dv, i) => {
    const x = xFor(i);
    const barH = Math.abs(dv / maxAbs) * (h / 2);
    const y = dv <= 0 ? zeroY - barH : zeroY;
    const improve = dv < 0; // faster lap = improvement
    return /*#__PURE__*/React.createElement("rect", {
      key: i,
      x: x - barW / 2,
      y: y,
      width: barW,
      height: Math.max(barH, 0.5),
      rx: "1.5",
      fill: improve ? "#16A34A" : "#DC2626",
      opacity: "0.78"
    });
  }), [1, 4, 7, 10, 13, 16, 18].map(n => /*#__PURE__*/React.createElement("text", {
    key: n,
    x: xFor(n - 1),
    y: height - 6,
    textAnchor: "middle",
    fontSize: "10",
    fontFamily: "JetBrains Mono, monospace",
    fill: MUTED
  }, n)));
}
Object.assign(window, {
  Sparkline,
  EvolutionChart,
  LapChart,
  DeltaChart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/Charts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/Chrome.jsx
try { (() => {
// Velozes app — chrome: header, bottom navigation, section header, divider.

function Header({
  title,
  onBack,
  dark = false,
  sub = null,
  showLock = true,
  onLock
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: dark ? "var(--racing-black)" : "var(--surface)",
      borderBottom: dark ? "none" : "1px solid var(--border-light)",
      padding: "14px 16px 12px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      minHeight: 56
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "Voltar",
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: 6,
      marginLeft: -6,
      color: dark ? "#fff" : "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 24,
    strokeWidth: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "center",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontStyle: title === "Velozes" ? "italic" : "normal",
      fontSize: 26,
      letterSpacing: "-0.01em",
      color: dark ? "#fff" : "var(--text-primary)",
      lineHeight: 1.1
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: dark ? "rgba(255,255,255,.7)" : "var(--text-muted)",
      marginTop: 2,
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, sub)), /*#__PURE__*/React.createElement("button", {
    onClick: onLock,
    "aria-label": "Admin",
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: 6,
      marginRight: -6,
      color: dark ? "#fff" : "var(--text-primary)",
      visibility: showLock ? "visible" : "hidden"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 22,
    strokeWidth: 2
  })));
}
function BottomNav({
  active,
  onNav
}) {
  const items = [{
    id: "home",
    label: "Home",
    icon: "house"
  }, {
    id: "calendar",
    label: "Calendário",
    icon: "calendar"
  }, {
    id: "ranking",
    label: "Ranking",
    icon: "bar-chart-3"
  }, {
    id: "drivers",
    label: "Pilotos",
    icon: "user"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      bottom: 0,
      zIndex: 20,
      height: "var(--bottom-nav-height)",
      background: "var(--surface)",
      borderTop: "1px solid var(--border-light)",
      boxShadow: "0 -4px 16px rgba(0,0,0,.04)",
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      alignItems: "center"
    }
  }, items.map(it => {
    const on = active === it.id;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onNav(it.id),
      style: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        color: on ? "var(--text-primary)" : "var(--text-muted)",
        padding: "6px 0",
        height: "100%"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 22,
      strokeWidth: on ? 2.4 : 1.85,
      color: on ? "var(--brand-red)" : "var(--text-muted)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 11,
        fontWeight: on ? 700 : 500
      }
    }, it.label));
  }));
}
function SectionHead({
  icon,
  title,
  sub,
  right,
  tone = "muted"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: sub ? "flex-start" : "center",
      gap: 12,
      marginBottom: sub ? 14 : 12
    }
  }, icon && /*#__PURE__*/React.createElement(IconTile, {
    name: icon,
    tone: tone
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 22,
      color: "var(--text-primary)",
      lineHeight: 1.15
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)",
      marginTop: 3,
      lineHeight: 1.4
    }
  }, sub)), right);
}
function Divider() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-light)"
    }
  });
}

// Data label + small value stacked (used in driver header etc.)
function LabelValue({
  label,
  children,
  align = "left"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)",
      marginBottom: 2
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, children));
}
function Avatar({
  size = 38,
  letter
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      flex: "none",
      borderRadius: "999px",
      background: "var(--surface-muted)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: size * 0.5,
    color: "var(--text-muted)",
    strokeWidth: 1.9
  }));
}
Object.assign(window, {
  Header,
  BottomNav,
  SectionHead,
  Divider,
  LabelValue,
  Avatar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/HomeScreen.jsx
try { (() => {
// Velozes — Home screen
function HomeScreen({
  onNav,
  onOpenProfile,
  onLock
}) {
  const {
    Button,
    Card,
    RankRow
  } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const ev = D.nextEvent;
  const cd = [["dias", "DIAS"], ["horas", "HORAS"], ["min", "MIN"], ["seg", "SEG"]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    title: "Velozes",
    onLock: onLock
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: "var(--gap-section)"
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "calendar"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)",
      fontWeight: 500
    }
  }, "Pr\xF3ximo evento"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 30,
      fontWeight: 700,
      color: "var(--text-primary)",
      letterSpacing: "-0.02em",
      lineHeight: 1.1
    }
  }, ev.date), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-primary)",
      marginTop: 2
    }
  }, ev.circuit), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, ev.city))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)",
      marginBottom: 8
    }
  }, "Falta para o evento"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 8,
      marginBottom: 16
    }
  }, cd.map(([k, lbl]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      border: "1px solid var(--border-light)",
      borderRadius: "var(--radius-md)",
      padding: "10px 4px",
      textAlign: "center",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 24,
      fontWeight: 700,
      color: "var(--text-primary)",
      fontVariantNumeric: "tabular-nums"
    }
  }, ev.countdown[k]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.06em",
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, lbl)))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: () => onNav("calendar")
  }, "Ver calend\xE1rio"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-primary)",
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, "Regulamento ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    strokeWidth: 2.2
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "trophy"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 22,
      color: "var(--text-primary)",
      flex: 1
    }
  }, "P\xF3dio atual"), /*#__PURE__*/React.createElement("button", {
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)",
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, D.season, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", null, D.podium.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d.pos,
    style: i ? {
      borderTop: "1px solid var(--border-light)"
    } : {}
  }, /*#__PURE__*/React.createElement(RankRow, {
    position: d.pos,
    name: d.name,
    points: d.pts,
    podium: true,
    onClick: () => onOpenProfile(d)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: () => onNav("ranking"),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      strokeWidth: 2.2
    })
  }, "Ver ranking completo"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    name: "gauge",
    size: 52,
    iconSize: 26
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, "Velocidade quase m\xE1xima"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 30,
      fontWeight: 700,
      color: "var(--text-primary)",
      fontVariantNumeric: "tabular-nums"
    }
  }, D.avgSpeed), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "km/h")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, "M\xE9dia da temporada at\xE9 agora")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--brand-red-soft)",
      borderRadius: "var(--radius-md)",
      padding: "8px 6px",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Sparkline, {
    data: [2, 3, 2.4, 4, 3.2, 5, 4.6, 6],
    width: 96,
    height: 48
  }))))));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/ProfileScreen.jsx
try { (() => {
// Velozes — Perfil do Competidor
function ProfileScreen({
  onBack,
  onOpenRace,
  driver
}) {
  const {
    Card,
    Button,
    StatTile
  } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const p = D.profile;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    title: "Perfil do Competidor",
    onBack: onBack,
    showLock: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 64
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 23,
      color: "var(--text-primary)",
      lineHeight: 1.1
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      marginTop: 6,
      background: "var(--racing-black)",
      color: "#fff",
      borderRadius: "var(--radius-pill)",
      padding: "3px 10px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "crown",
    size: 13,
    color: "#FFD54A"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      fontWeight: 600
    }
  }, p.rankBadge)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, D.season)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 32,
      fontWeight: 700,
      color: "var(--brand-red)",
      fontVariantNumeric: "tabular-nums"
    }
  }, p.totalPts), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "pts")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, "Total de pontos")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "Posi\xE7\xE3o geral",
    value: p.posGeral.value,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "bar-chart-3",
      size: 18
    }),
    sub: p.posGeral.of
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Melhor volta",
    value: p.bestLap.value,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "timer",
      size: 18
    }),
    sub: p.bestLap.etapa,
    valueSize: "s"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Melhor corrida",
    value: p.bestRace.value,
    icon: /*#__PURE__*/React.createElement(CheckeredFlag, {
      size: 18,
      radius: 4
    }),
    sub: p.bestRace.etapa,
    valueSize: "s"
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, "Evolu\xE7\xE3o no campeonato"), /*#__PURE__*/React.createElement("button", {
    style: {
      border: "1px solid var(--border-light)",
      background: "var(--surface)",
      borderRadius: "var(--radius-sm)",
      padding: "5px 10px",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-secondary)",
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, "Posi\xE7\xE3o no ranking ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14
  }))), /*#__PURE__*/React.createElement(EvolutionChart, {
    data: p.evolution
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: "var(--font-ui)",
      fontSize: 11,
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, "Etapas")), /*#__PURE__*/React.createElement(Card, {
    padding: "16px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)",
      marginBottom: 8
    }
  }, "Suas corridas"), p.races.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: onOpenRace,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 0",
      borderTop: i ? "1px solid var(--border-light)" : "none",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: 44,
      textAlign: "center",
      background: "var(--surface-muted)",
      borderRadius: "var(--radius-sm)",
      padding: "6px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 17,
      fontWeight: 700,
      color: "var(--text-primary)",
      lineHeight: 1
    }
  }, r.day), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 10,
      fontWeight: 600,
      color: "var(--text-muted)"
    }
  }, r.mon)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, r.etapa), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, r.track)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 17,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, r.pos), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, r.pts, " pts")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-muted)"
  })))), /*#__PURE__*/React.createElement(Button, {
    variant: "dark",
    size: "lg",
    fullWidth: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "upload-cloud",
      size: 20,
      color: "#fff"
    })
  }, "Enviar lap-to-lap"), /*#__PURE__*/React.createElement("button", {
    style: {
      border: "1px solid var(--border-light)",
      background: "var(--surface)",
      borderRadius: "var(--radius-md)",
      padding: "12px 16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bar-chart-3",
    size: 18,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "left"
    }
  }, "Ver an\xE1lise da temporada"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-muted)"
  }))));
}
Object.assign(window, {
  ProfileScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/RaceScreen.jsx
try { (() => {
// Velozes — Detalhe da Corrida (lap-by-lap analysis)
function RaceScreen({
  onBack
}) {
  const {
    Card,
    StatTile
  } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const r = D.race;
  const s = r.stats;
  const tiles = [{
    label: "Melhor volta",
    value: s.bestLap,
    icon: "timer"
  }, {
    label: "Tempo total",
    value: s.totalTime,
    icon: "clock"
  }, {
    label: "Diferença p/ líder",
    value: s.gapLeader,
    icon: "crown",
    tone: "muted"
  }, {
    label: "Diferença p/ anterior",
    value: s.gapPrev,
    icon: "user",
    tone: "negative"
  }, {
    label: "Última volta",
    value: s.lastLap,
    icon: "rotate-ccw"
  }, {
    label: "Total de voltas",
    value: s.totalLaps,
    icon: "flag"
  }];
  const insights = [{
    icon: "target",
    title: "Boa consistência",
    text: "Seu ritmo foi consistente na maior parte da corrida."
  }, {
    icon: "trending-up",
    title: "Melhor desempenho no final",
    text: "Você acelerou nas últimas voltas e ganhou tempo."
  }, {
    icon: "rotate-ccw",
    title: "Recuperação de ritmo",
    text: "Mesmo com pequenas quedas, seu ritmo médio foi forte."
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    title: "Corrida \u2022 8\xAA Etapa",
    onBack: onBack,
    showLock: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 16px",
      background: "var(--surface)",
      border: "1px solid var(--border-light)",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement(CheckeredFlag, {
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "left",
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, "Trocar de corrida"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 20,
    color: "var(--text-muted)"
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 48
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, r.driver), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, "Posi\xE7\xE3o geral"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      background: "var(--racing-black)",
      borderRadius: "var(--radius-xs)",
      padding: "1px 8px"
    }
  }, r.posGeral))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: "1px solid var(--border-light)",
      paddingLeft: 12
    }
  }, /*#__PURE__*/React.createElement(LabelValue, {
    label: "Piloto"
  }, D.season)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 10
    }
  }, tiles.map((t, i) => /*#__PURE__*/React.createElement(StatTile, {
    key: i,
    label: t.label,
    value: t.value,
    valueTone: t.tone || "primary",
    valueSize: "s",
    icon: t.icon === "flag" ? /*#__PURE__*/React.createElement(CheckeredFlag, {
      size: 16,
      radius: 3
    }) : /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 16
    })
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, "Volta por volta"), /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 16,
    color: "var(--text-muted)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)",
      marginBottom: 6
    }
  }, "Tempo (s)"), /*#__PURE__*/React.createElement(LapChart, {
    laps: r.laps
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      fontFamily: "var(--font-ui)",
      fontSize: 11,
      color: "var(--text-muted)"
    }
  }, "Voltas")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, "Varia\xE7\xE3o entre voltas"), /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 16,
    color: "var(--text-muted)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)",
      marginBottom: 6
    }
  }, "\u0394 Tempo (s)"), /*#__PURE__*/React.createElement(DeltaChart, {
    laps: r.laps
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      justifyContent: "center",
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: "var(--font-ui)",
      fontSize: 11,
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: "#16A34A"
    }
  }), "Melhora"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: "var(--font-ui)",
      fontSize: 11,
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: "#DC2626"
    }
  }), "Piora"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, "Insights da corrida"), /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 16,
    color: "var(--text-muted)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, insights.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      flex: "none",
      borderRadius: "var(--radius-pill)",
      background: "var(--brand-red-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 18,
    color: "var(--brand-red)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, it.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)",
      lineHeight: 1.4
    }
  }, it.text))))))));
}
Object.assign(window, {
  RaceScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/RaceScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/RankingScreen.jsx
try { (() => {
// Velozes — Ranking screen
function RankingScreen({
  onLock,
  onOpenProfile
}) {
  const {
    Card,
    Chip,
    Badge,
    Button
  } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const [month, setMonth] = React.useState("Geral");
  const [open, setOpen] = React.useState(true);
  const months = ["Jan", "Fev", "Mar", "Abr", "Geral"];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    title: "Ranking",
    onLock: onLock
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    icon: "trophy",
    title: D.season,
    sub: "Acompanhe o desempenho dos pilotos na temporada.",
    right: /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 18,
      color: "var(--text-muted)"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 2
    }
  }, months.map(m => /*#__PURE__*/React.createElement(Chip, {
    key: m,
    active: month === m,
    tone: m === "Geral" ? "default" : "default",
    onClick: () => setMonth(m)
  }, m))), /*#__PURE__*/React.createElement(Card, {
    padding: "4px 16px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      padding: "12px 0 10px",
      borderBottom: "1px solid var(--border-light)",
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)",
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40
    }
  }, "Pos."), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      marginLeft: 12
    }
  }, "Piloto"), /*#__PURE__*/React.createElement("span", null, "Total de pontos")), D.ranking.map((d, i) => {
    const posColors = {
      1: "var(--brand-red)",
      2: "var(--racing-black)",
      3: "var(--graphite)"
    };
    const top3 = d.pos <= 3;
    return /*#__PURE__*/React.createElement("div", {
      key: d.pos,
      onClick: () => onOpenProfile(d),
      style: {
        display: "flex",
        gap: 12,
        padding: "14px 0",
        borderBottom: i < D.ranking.length - 1 ? "1px solid var(--border-light)" : "none",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        flex: "none",
        borderRadius: "var(--radius-sm)",
        background: top3 ? posColors[d.pos] : "var(--surface-muted)",
        color: top3 ? "#fff" : "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: 15
      }
    }, d.pos), /*#__PURE__*/React.createElement(Avatar, {
      size: 40
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 16,
        fontWeight: 600,
        color: "var(--text-primary)"
      }
    }, d.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--text-muted)",
        background: "var(--surface-muted)",
        padding: "1px 6px",
        borderRadius: "var(--radius-xs)"
      }
    }, d.uf)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginTop: 6,
        flexWrap: "wrap"
      }
    }, Object.entries(d.months).map(([m, v]) => /*#__PURE__*/React.createElement("span", {
      key: m,
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 11,
        color: "var(--text-secondary)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-pill)",
        padding: "2px 8px"
      }
    }, m, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        color: "var(--text-primary)"
      }
    }, v))))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 22,
        fontWeight: 700,
        color: "var(--text-primary)",
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1
      }
    }, d.total), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 11,
        color: "var(--text-muted)"
      }
    }, "pts"), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      color: "var(--text-muted)",
      style: {
        marginTop: 2
      }
    })));
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      width: "100%",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 22,
    color: "var(--text-primary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "left",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, "Como funciona a pontua\xE7\xE3o"), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "chevron-up" : "chevron-down",
    size: 20,
    color: "var(--text-muted)"
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      color: "var(--text-secondary)",
      marginBottom: 12
    }
  }, "A pontua\xE7\xE3o \xE9 definida com base na sua posi\xE7\xE3o em cada corrida."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 8,
      marginBottom: 14
    }
  }, D.pointsTable.slice(0, 6).map(([pos, pts]) => /*#__PURE__*/React.createElement("div", {
    key: pos,
    style: {
      border: "1px solid var(--border-light)",
      borderRadius: "var(--radius-md)",
      padding: "10px 6px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, pos, " lugar"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 17,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, pts, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)",
      fontFamily: "var(--font-ui)"
    }
  }, "pts"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 14,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 12
    })
  }, "Pole +1"), /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 12
    })
  }, "Melhor volta +1"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "NC 0")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "12px",
      background: "var(--danger-soft)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 20,
    color: "var(--danger)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, "Penaliza\xE7\xE3o"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, "Faltas, conduta antidesportiva ou descumprimento de regras.")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 18,
      fontWeight: 700,
      color: "var(--danger)"
    }
  }, "-5 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontFamily: "var(--font-ui)"
    }
  }, "pts"))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-primary)",
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, "Ver regulamento completo ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    strokeWidth: 2.2
  })))))));
}
Object.assign(window, {
  RankingScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/RankingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/data.js
try { (() => {
// Velozes app — fake demo data (pt-BR)
window.VZ_DATA = {
  season: "Temporada 2024",
  nextEvent: {
    date: "12/06",
    dateLabel: {
      mon: "JUN",
      day: "12",
      dow: "QUA"
    },
    title: "1ª Etapa – Velozes 2024",
    circuit: "Autódromo Internacional",
    city: "Curitiba – PR",
    countdown: {
      dias: "05",
      horas: "14",
      min: "32",
      seg: "18"
    },
    inDays: "Falta 5 dias"
  },
  avgSpeed: "248,7",
  podium: [{
    pos: 1,
    name: "Lucas Almeida",
    uf: "PR",
    pts: 87
  }, {
    pos: 2,
    name: "Bruno Costa",
    uf: "SP",
    pts: 72
  }, {
    pos: 3,
    name: "Felipe Martins",
    uf: "MG",
    pts: 61
  }, {
    pos: 4,
    name: "Rafael Souza",
    uf: "SP",
    pts: 49
  }, {
    pos: 5,
    name: "Thiago Oliveira",
    uf: "RS",
    pts: 43
  }],
  events: [{
    mon: "JUN",
    day: "12",
    dow: "QUA",
    title: "1ª Etapa – Velozes 2024",
    circuit: "Autódromo Internacional",
    city: "Curitiba – PR",
    inDays: "Falta 5 dias",
    next: true,
    track: "M30 50 C 40 20, 70 20, 75 40 S 95 70, 85 80 S 55 75, 50 60 S 25 80, 30 50 Z"
  }, {
    mon: "JUL",
    day: "15",
    dow: "SEG",
    title: "2ª Etapa – Velozes 2024",
    circuit: "Autódromo de Interlagos",
    city: "São Paulo – SP",
    inDays: "Falta 38 dias",
    next: false,
    track: "M25 60 C 20 35, 55 25, 70 35 S 92 45, 80 62 S 60 78, 45 72 S 28 78, 25 60 Z"
  }, {
    mon: "AGO",
    day: "07",
    dow: "QUA",
    title: "3ª Etapa – Velozes 2024",
    circuit: "Autódromo Velopark",
    city: "Nova Santa Rita – RS",
    inDays: "Falta 61 dias",
    next: false,
    track: "M35 30 C 60 20, 80 35, 70 50 S 85 75, 65 80 S 45 70, 50 55 S 25 55, 35 30 Z"
  }],
  ranking: [{
    pos: 1,
    name: "Lucas Almeida",
    uf: "PR",
    total: 316,
    months: {
      Jan: 87,
      Fev: 81,
      Mar: 76,
      Abr: 72
    }
  }, {
    pos: 2,
    name: "Bruno Costa",
    uf: "SP",
    total: 283,
    months: {
      Jan: 72,
      Fev: 78,
      Mar: 68,
      Abr: 65
    }
  }, {
    pos: 3,
    name: "Felipe Martins",
    uf: "MG",
    total: 240,
    months: {
      Jan: 61,
      Fev: 63,
      Mar: 59,
      Abr: 57
    }
  }, {
    pos: 4,
    name: "Rafael Souza",
    uf: "SP",
    total: 197,
    months: {
      Jan: 49,
      Fev: 52,
      Mar: 46,
      Abr: 50
    }
  }, {
    pos: 5,
    name: "Thiago Oliveira",
    uf: "RS",
    total: 171,
    months: {
      Jan: 43,
      Fev: 45,
      Mar: 41,
      Abr: 42
    }
  }],
  pointsTable: [["1º", 24], ["2º", 22], ["3º", 20], ["4º", 18], ["5º", 16], ["6º", 14], ["7º", 12], ["8º", 10], ["9º", 8], ["10º", 7]],
  profile: {
    name: "Lucas Almeida",
    uf: "PR",
    rankBadge: "1º lugar",
    totalPts: 87,
    posGeral: {
      value: "1º",
      of: "de 18"
    },
    bestLap: {
      value: "00:49.352",
      etapa: "8ª etapa"
    },
    bestRace: {
      value: "1º lugar",
      etapa: "5ª etapa"
    },
    evolution: [10, 5, 3, 2, 1, 1, 1, 1, 1, 1],
    // ranking position per etapa
    races: [{
      day: "10",
      mon: "MAI",
      etapa: "8ª etapa",
      track: "Autódromo Internacional – Curitiba, PR",
      pos: "1º",
      pts: 25
    }, {
      day: "26",
      mon: "ABR",
      etapa: "7ª etapa",
      track: "Circuito dos Cristais – Curvelo, MG",
      pos: "2º",
      pts: 18
    }, {
      day: "12",
      mon: "ABR",
      etapa: "6ª etapa",
      track: "Autódromo de Interlagos – São Paulo, SP",
      pos: "3º",
      pts: 15
    }, {
      day: "29",
      mon: "MAR",
      etapa: "5ª etapa",
      track: "Velocitta – Mogi Guaçu, SP",
      pos: "1º",
      pts: 25
    }, {
      day: "15",
      mon: "MAR",
      etapa: "4ª etapa",
      track: "Goiânia Race Track – Goiânia, GO",
      pos: "4º",
      pts: 12
    }]
  },
  race: {
    title: "Corrida • 8ª Etapa",
    driver: "Lucas Almeida",
    posGeral: "1º",
    stats: {
      bestLap: "00:48.732",
      totalTime: "14:32.184",
      gapLeader: "—",
      gapPrev: "+2.318",
      lastLap: "00:49.215",
      totalLaps: "18"
    },
    // lap times in seconds for the lap-by-lap chart
    laps: [48.1, 48.4, 48.5, 49.0, 50.0, 48.6, 50.8, 48.5, 48.4, 48.2, 49.2, 49.4, 48.5, 49.0, 48.9, 49.9, 50.2, 47.6, 47.3, 48.4]
  },
  admin: {
    event: {
      circuit: "Autódromo Internacional",
      city: "Curitiba – PR",
      date: "12/06/2024"
    },
    result: [{
      pos: "1º",
      name: "Lucas Almeida"
    }, {
      pos: "2º",
      name: "Bruno Costa"
    }, {
      pos: "3º",
      name: "Felipe Martins"
    }, {
      pos: "4º",
      name: "Rafael Souza"
    }, {
      pos: "5º",
      name: "Thiago Oliveira"
    }],
    imports: [{
      file: "resultado_oficial_1206.pdf",
      at: "12/06/2024 • 14:32",
      status: "Processado"
    }, {
      file: "resultado_corrigido_1206.pdf",
      at: "12/06/2024 • 13:10",
      status: "Processado"
    }]
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/velozes-app/icons.jsx
try { (() => {
// Velozes app — icon helpers and small race glyphs.
// Lucide is loaded via CDN; Icon() emits an <i data-lucide> that lucide.createIcons() hydrates.
function Icon({
  name,
  size = 20,
  color = "currentColor",
  strokeWidth = 1.85,
  style = {}
}) {
  return React.createElement("i", {
    "data-lucide": name,
    style: {
      width: size,
      height: size,
      color,
      display: "inline-flex",
      ...style
    },
    "data-stroke": strokeWidth
  });
}

// A small CSS checkered-flag square (the one bespoke brand glyph).
function CheckeredFlag({
  size = 22,
  radius = 5
}) {
  return React.createElement("span", {
    style: {
      width: size,
      height: size,
      flex: "none",
      display: "inline-block",
      borderRadius: radius,
      border: "1px solid var(--border-light)",
      backgroundColor: "#fff",
      backgroundImage: "linear-gradient(45deg,#111 25%,transparent 25%,transparent 75%,#111 75%),linear-gradient(45deg,#111 25%,transparent 25%,transparent 75%,#111 75%)",
      backgroundSize: size / 3 + "px " + size / 3 + "px",
      backgroundPosition: "0 0," + size / 6 + "px " + size / 6 + "px"
    }
  });
}

// Square icon tile used as a section glyph (calendar, trophy, gauge…).
function IconTile({
  name,
  size = 44,
  iconSize = 22,
  tone = "muted"
}) {
  const bg = tone === "dark" ? "var(--racing-black)" : "var(--surface-muted)";
  const fg = tone === "dark" ? "#fff" : "var(--text-primary)";
  return React.createElement("div", {
    style: {
      width: size,
      height: size,
      flex: "none",
      borderRadius: "var(--radius-md)",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(Icon, {
    name,
    size: iconSize,
    color: fg
  }));
}
function hydrateIcons() {
  if (window.lucide) window.lucide.createIcons({
    attrs: {
      "stroke-width": 1.85
    }
  });
}
Object.assign(window, {
  Icon,
  CheckeredFlag,
  IconTile,
  hydrateIcons
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/velozes-app/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.RankRow = __ds_scope.RankRow;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.TimeValue = __ds_scope.TimeValue;

__ds_ns.Input = __ds_scope.Input;

})();
