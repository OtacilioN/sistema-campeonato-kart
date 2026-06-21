// Velozes — Home screen
function HomeScreen({ onNav, onOpenProfile, onLock }) {
  const { Button, Card, RankRow } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const ev = D.nextEvent;
  const cd = [["dias", "DIAS"], ["horas", "HORAS"], ["min", "MIN"], ["seg", "SEG"]];

  return (
    <div>
      <Header title="Velozes" onLock={onLock} />
      <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: "var(--gap-section)" }}>

        {/* Próximo evento */}
        <Card>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <IconTile name="calendar" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Próximo evento</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{ev.date}</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>{ev.circuit}</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>{ev.city}</div>
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Falta para o evento</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
            {cd.map(([k, lbl]) => (
              <div key={k} style={{ border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 4px", textAlign: "center", background: "var(--surface)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{ev.countdown[k]}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "var(--text-muted)", marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
          <Button variant="primary" size="lg" fullWidth onClick={() => onNav("calendar")}>Ver calendário</Button>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Regulamento <Icon name="chevron-right" size={16} strokeWidth={2.2} />
            </button>
          </div>
        </Card>

        {/* Pódio atual */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <IconTile name="trophy" />
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-primary)", flex: 1 }}>Pódio atual</div>
            <button style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: 4 }}>
              {D.season} <Icon name="chevron-down" size={16} />
            </button>
          </div>
          <div>
            {D.podium.map((d, i) => (
              <div key={d.pos} style={i ? { borderTop: "1px solid var(--border-light)" } : {}}>
                <RankRow position={d.pos} name={d.name} points={d.pts} podium onClick={() => onOpenProfile(d)} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" fullWidth onClick={() => onNav("ranking")} iconRight={<Icon name="chevron-right" size={16} strokeWidth={2.2} />}>Ver ranking completo</Button>
          </div>
        </Card>

        {/* Velocidade quase máxima */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <IconTile name="gauge" size={52} iconSize={26} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Velocidade quase máxima</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{D.avgSpeed}</span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)" }}>km/h</span>
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>Média da temporada até agora</div>
            </div>
            <div style={{ background: "var(--brand-red-soft)", borderRadius: "var(--radius-md)", padding: "8px 6px", flex: "none" }}>
              <Sparkline data={[2, 3, 2.4, 4, 3.2, 5, 4.6, 6]} width={96} height={48} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { HomeScreen });
