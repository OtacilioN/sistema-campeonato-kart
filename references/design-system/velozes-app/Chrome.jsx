// Velozes app — chrome: header, bottom navigation, section header, divider.

function Header({ title, onBack, dark = false, sub = null, showLock = true, onLock }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 20,
      background: dark ? "var(--racing-black)" : "var(--surface)",
      borderBottom: dark ? "none" : "1px solid var(--border-light)",
      padding: "14px 16px 12px",
      display: "flex", alignItems: "center", gap: 8, minHeight: 56,
    }}>
      {onBack && (
        <button onClick={onBack} aria-label="Voltar" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 6, marginLeft: -6, color: dark ? "#fff" : "var(--text-primary)" }}>
          <Icon name="arrow-left" size={24} strokeWidth={2} />
        </button>
      )}
      <div style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontStyle: title === "Velozes" ? "italic" : "normal",
          fontSize: 26, letterSpacing: "-0.01em", color: dark ? "#fff" : "var(--text-primary)", lineHeight: 1.1,
        }}>{title}</div>
        {sub && <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: dark ? "rgba(255,255,255,.7)" : "var(--text-muted)", marginTop: 2, display: "inline-flex", alignItems: "center", gap: 5 }}>{sub}</div>}
      </div>
      <button onClick={onLock} aria-label="Admin" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 6, marginRight: -6, color: dark ? "#fff" : "var(--text-primary)", visibility: showLock ? "visible" : "hidden" }}>
        <Icon name="lock" size={22} strokeWidth={2} />
      </button>
    </div>
  );
}

function BottomNav({ active, onNav }) {
  const items = [
    { id: "home", label: "Home", icon: "house" },
    { id: "calendar", label: "Calendário", icon: "calendar" },
    { id: "ranking", label: "Ranking", icon: "bar-chart-3" },
    { id: "drivers", label: "Pilotos", icon: "user" },
  ];
  return (
    <div style={{
      position: "sticky", bottom: 0, zIndex: 20, height: "var(--bottom-nav-height)",
      background: "var(--surface)", borderTop: "1px solid var(--border-light)",
      boxShadow: "0 -4px 16px rgba(0,0,0,.04)",
      display: "grid", gridTemplateColumns: "repeat(4,1fr)", alignItems: "center",
    }}>
      {items.map((it) => {
        const on = active === it.id;
        return (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            border: "none", background: "transparent", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: on ? "var(--text-primary)" : "var(--text-muted)", padding: "6px 0", height: "100%",
          }}>
            <Icon name={it.icon} size={22} strokeWidth={on ? 2.4 : 1.85} color={on ? "var(--brand-red)" : "var(--text-muted)"} />
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: on ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SectionHead({ icon, title, sub, right, tone = "muted" }) {
  return (
    <div style={{ display: "flex", alignItems: sub ? "flex-start" : "center", gap: 12, marginBottom: sub ? 14 : 12 }}>
      {icon && <IconTile name={icon} tone={tone} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-primary)", lineHeight: 1.15 }}>{title}</div>
        {sub && <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginTop: 3, lineHeight: 1.4 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid var(--border-light)" }} />;
}

// Data label + small value stacked (used in driver header etc.)
function LabelValue({ label, children, align = "left" }) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{children}</div>
    </div>
  );
}

function Avatar({ size = 38, letter }) {
  return (
    <div style={{ width: size, height: size, flex: "none", borderRadius: "999px", background: "var(--surface-muted)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
      <Icon name="user" size={size * 0.5} color="var(--text-muted)" strokeWidth={1.9} />
    </div>
  );
}

Object.assign(window, { Header, BottomNav, SectionHead, Divider, LabelValue, Avatar });
