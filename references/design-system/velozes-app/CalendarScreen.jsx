// Velozes — Calendário screen
function CalendarScreen({ onBack, onLock }) {
  const { Card, Chip, Badge } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const [tab, setTab] = React.useState("prox");

  return (
    <div>
      <Header title="Calendário" onBack={onBack} onLock={onLock} />
      <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Chip active={tab === "prox"} onClick={() => setTab("prox")}>Próximos</Chip>
          <Chip active={tab === "ant"} onClick={() => setTab("ant")}>Anteriores</Chip>
        </div>

        <SectionHead icon="calendar" title="Próximos eventos" sub="Acompanhe os principais eventos e planeje sua temporada." />

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)" }}>
          {D.events.map((e, i) => (
            <Card key={i} interactive style={e.next ? { borderColor: "var(--border-strong)" } : {}}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: "none", width: 58, textAlign: "center", borderRight: "1px solid var(--border-light)", paddingRight: 12 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-muted)" }}>{e.mon}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1 }}>{e.day}</div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>{e.dow}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {e.next && <div style={{ marginBottom: 6 }}><Badge tone="brand" icon={<Icon name="star" size={12} />}>Próximo evento</Badge></div>}
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--text-primary)", lineHeight: 1.15 }}>{e.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)" }}>
                    <Icon name="map-pin" size={15} color="var(--text-muted)" />{e.circuit}
                  </div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", marginLeft: 20 }}>{e.city}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)" }}>
                    <Icon name="clock" size={15} color="var(--text-muted)" />{e.inDays}
                  </div>
                </div>
                <div style={{ flex: "none", width: 64, height: 64, borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", background: "var(--surface-muted)", alignSelf: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="48" height="48" viewBox="0 0 110 110"><path d={e.track} fill="none" stroke="var(--text-secondary)" strokeWidth="4" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card interactive>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconTile name="calendar-clock" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Ver eventos anteriores</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>Consulte o calendário completo de eventos já realizados.</div>
            </div>
            <Icon name="chevron-right" size={20} color="var(--text-muted)" />
          </div>
        </Card>

        <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>
          <Icon name="info" size={14} /> Datas e locais sujeitos a alteração.
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { CalendarScreen });
