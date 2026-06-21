// Velozes — Ranking screen
function RankingScreen({ onLock, onOpenProfile }) {
  const { Card, Chip, Badge, Button } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const [month, setMonth] = React.useState("Geral");
  const [open, setOpen] = React.useState(true);
  const months = ["Jan", "Fev", "Mar", "Abr", "Geral"];

  return (
    <div>
      <Header title="Ranking" onLock={onLock} />
      <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        <SectionHead icon="trophy" title={D.season} sub="Acompanhe o desempenho dos pilotos na temporada."
          right={<Icon name="chevron-down" size={18} color="var(--text-muted)" />} />

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {months.map((m) => (
            <Chip key={m} active={month === m} tone={m === "Geral" ? "default" : "default"} onClick={() => setMonth(m)}>{m}</Chip>
          ))}
        </div>

        <Card padding="4px 16px">
          <div style={{ display: "flex", alignItems: "center", padding: "12px 0 10px", borderBottom: "1px solid var(--border-light)", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
            <span style={{ width: 40 }}>Pos.</span>
            <span style={{ flex: 1, marginLeft: 12 }}>Piloto</span>
            <span>Total de pontos</span>
          </div>
          {D.ranking.map((d, i) => {
            const posColors = { 1: "var(--brand-red)", 2: "var(--racing-black)", 3: "var(--graphite)" };
            const top3 = d.pos <= 3;
            return (
              <div key={d.pos} onClick={() => onOpenProfile(d)} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: i < D.ranking.length - 1 ? "1px solid var(--border-light)" : "none", cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, flex: "none", borderRadius: "var(--radius-sm)", background: top3 ? posColors[d.pos] : "var(--surface-muted)", color: top3 ? "#fff" : "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 15 }}>{d.pos}</div>
                <Avatar size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{d.name}</span>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", background: "var(--surface-muted)", padding: "1px 6px", borderRadius: "var(--radius-xs)" }}>{d.uf}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    {Object.entries(d.months).map(([m, v]) => (
                      <span key={m} style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-secondary)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-pill)", padding: "2px 8px" }}>
                        {m} <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)" }}>{v}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{d.total}</span>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>pts</span>
                  <Icon name="chevron-right" size={16} color="var(--text-muted)" style={{ marginTop: 2 }} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Como funciona a pontuação */}
        <Card>
          <button onClick={() => setOpen(!open)} style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 0 }}>
            <Icon name="info" size={22} color="var(--text-primary)" />
            <span style={{ flex: 1, textAlign: "left", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>Como funciona a pontuação</span>
            <Icon name={open ? "chevron-up" : "chevron-down"} size={20} color="var(--text-muted)" />
          </button>
          {open && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>A pontuação é definida com base na sua posição em cada corrida.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
                {D.pointsTable.slice(0, 6).map(([pos, pts]) => (
                  <div key={pos} style={{ border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 6px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>{pos} lugar</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{pts} <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>pts</span></div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <Badge tone="success" icon={<Icon name="plus" size={12} />}>Pole +1</Badge>
                <Badge tone="success" icon={<Icon name="plus" size={12} />}>Melhor volta +1</Badge>
                <Badge tone="neutral">NC 0</Badge>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px", background: "var(--danger-soft)", borderRadius: "var(--radius-md)" }}>
                <Icon name="triangle-alert" size={20} color="var(--danger)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Penalização</div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)" }}>Faltas, conduta antidesportiva ou descumprimento de regras.</div>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--danger)" }}>-5 <span style={{ fontSize: 11, fontFamily: "var(--font-ui)" }}>pts</span></span>
              </div>
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <button style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Ver regulamento completo <Icon name="chevron-right" size={16} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { RankingScreen });
