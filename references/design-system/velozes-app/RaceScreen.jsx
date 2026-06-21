// Velozes — Detalhe da Corrida (lap-by-lap analysis)
function RaceScreen({ onBack }) {
  const { Card, StatTile } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const r = D.race;
  const s = r.stats;

  const tiles = [
    { label: "Melhor volta", value: s.bestLap, icon: "timer" },
    { label: "Tempo total", value: s.totalTime, icon: "clock" },
    { label: "Diferença p/ líder", value: s.gapLeader, icon: "crown", tone: "muted" },
    { label: "Diferença p/ anterior", value: s.gapPrev, icon: "user", tone: "negative" },
    { label: "Última volta", value: s.lastLap, icon: "rotate-ccw" },
    { label: "Total de voltas", value: s.totalLaps, icon: "flag" },
  ];

  const insights = [
    { icon: "target", title: "Boa consistência", text: "Seu ritmo foi consistente na maior parte da corrida." },
    { icon: "trending-up", title: "Melhor desempenho no final", text: "Você acelerou nas últimas voltas e ganhou tempo." },
    { icon: "rotate-ccw", title: "Recuperação de ritmo", text: "Mesmo com pequenas quedas, seu ritmo médio foi forte." },
  ];

  return (
    <div>
      <Header title="Corrida • 8ª Etapa" onBack={onBack} showLock={false} />
      <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Trocar de corrida */}
        <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", cursor: "pointer", boxShadow: "var(--shadow-card)" }}>
          <CheckeredFlag size={22} />
          <span style={{ flex: 1, textAlign: "left", fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Trocar de corrida</span>
          <Icon name="chevron-down" size={20} color="var(--text-muted)" />
        </button>

        {/* Driver strip */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.driver}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>Posição geral</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--racing-black)", borderRadius: "var(--radius-xs)", padding: "1px 8px" }}>{r.posGeral}</span>
              </div>
            </div>
            <div style={{ flex: "none", borderLeft: "1px solid var(--border-light)", paddingLeft: 12, textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Piloto</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{D.season}</div>
            </div>
          </div>
        </Card>

        {/* Stat grid 2x3 — label on its own row, wraps fully, never truncated */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, alignItems: "stretch" }}>
          {tiles.map((t, i) => {
            const toneColor = t.tone === "negative" ? "var(--danger)" : t.tone === "muted" ? "var(--text-muted)" : "var(--text-primary)";
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10, padding: 14, background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 500, color: "var(--text-secondary)", lineHeight: 1.3 }}>{t.label}</span>
                  <span style={{ color: "var(--text-muted)", display: "inline-flex", flex: "none" }}>{t.icon === "flag" ? <CheckeredFlag size={16} radius={3} /> : <Icon name={t.icon} size={16} />}</span>
                </div>
                <div style={{ marginTop: "auto", fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: toneColor, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", lineHeight: 1.1, whiteSpace: "nowrap" }}>{t.value}</div>
              </div>
            );
          })}
        </div>

        {/* Volta por volta */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>Volta por volta</span>
            <Icon name="info" size={16} color="var(--text-muted)" />
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Tempo (s)</div>
          <LapChart laps={r.laps} />
          <div style={{ textAlign: "right", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>Voltas</div>
        </Card>

        {/* Variação entre voltas */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>Variação entre voltas</span>
            <Icon name="info" size={16} color="var(--text-muted)" />
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Δ Tempo (s)</div>
          <DeltaChart laps={r.laps} />
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 6 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-secondary)" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#16A34A" }}></span>Melhora</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-secondary)" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#DC2626" }}></span>Piora</span>
          </div>
        </Card>

        {/* Insights */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>Insights da corrida</span>
            <Icon name="info" size={16} color="var(--text-muted)" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {insights.map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 38, height: 38, flex: "none", borderRadius: "var(--radius-pill)", background: "var(--brand-red-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={it.icon} size={18} color="var(--brand-red)" />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{it.title}</div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.4 }}>{it.text}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { RaceScreen });
