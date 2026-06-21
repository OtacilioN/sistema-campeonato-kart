// Velozes — Perfil do Competidor
function ProfileScreen({ onBack, onOpenRace, driver }) {
  const { Card, Button, StatTile } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const p = D.profile;

  return (
    <div>
      <Header title="Perfil do Competidor" onBack={onBack} showLock={false} />
      <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Identity */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar size={64} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 23, color: "var(--text-primary)", lineHeight: 1.1 }}>{p.name}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, background: "var(--racing-black)", color: "#fff", borderRadius: "var(--radius-pill)", padding: "3px 10px" }}>
                <Icon name="crown" size={13} color="#FFD54A" /><span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600 }}>{p.rankBadge}</span>
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{D.season}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, justifyContent: "flex-end" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 700, color: "var(--brand-red)", fontVariantNumeric: "tabular-nums" }}>{p.totalPts}</span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)" }}>pts</span>
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>Total de pontos</div>
            </div>
          </div>
        </Card>

        {/* Stat tiles — label on its own row (wraps fully, never truncated) */}
        {(() => {
          const tile = (icon, label, value, valueSize, sub) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 14, background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 500, color: "var(--text-secondary)", lineHeight: 1.3 }}>{label}</span>
                <span style={{ color: "var(--text-muted)", display: "inline-flex", flex: "none" }}>{icon}</span>
              </div>
              <div style={{ marginTop: "auto" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: valueSize, fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", lineHeight: 1.1, whiteSpace: "nowrap" }}>{value}</div>
                {sub && <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{sub}</div>}
              </div>
            </div>
          );
          return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, alignItems: "stretch" }}>
              {tile(<Icon name="bar-chart-3" size={18} />, "Posição geral", p.posGeral.value, 24, p.posGeral.of)}
              {tile(<Icon name="timer" size={18} />, "Melhor volta", p.bestLap.value, 15, p.bestLap.etapa)}
              {tile(<CheckeredFlag size={18} radius={4} />, "Melhor corrida", p.bestRace.value, 15, p.bestRace.etapa)}
            </div>
          );
        })()}

        {/* Evolution chart */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <span style={{ flex: 1, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>Evolução no campeonato</span>
            <button style={{ border: "1px solid var(--border-light)", background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "5px 10px", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: 4 }}>
              Posição no ranking <Icon name="chevron-down" size={14} />
            </button>
          </div>
          <EvolutionChart data={p.evolution} />
          <div style={{ textAlign: "center", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Etapas</div>
        </Card>

        {/* Suas corridas */}
        <Card padding="16px">
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", marginBottom: 8 }}>Suas corridas</div>
          {p.races.map((r, i) => (
            <div key={i} onClick={onOpenRace} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i ? "1px solid var(--border-light)" : "none", cursor: "pointer" }}>
              <div style={{ flex: "none", width: 44, textAlign: "center", background: "var(--surface-muted)", borderRadius: "var(--radius-sm)", padding: "6px 0" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{r.day}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 600, color: "var(--text-muted)" }}>{r.mon}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{r.etapa}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.track}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{r.pos}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>{r.pts} pts</div>
              </div>
              <Icon name="chevron-right" size={18} color="var(--text-muted)" />
            </div>
          ))}
        </Card>

        <Button variant="dark" size="lg" fullWidth iconLeft={<Icon name="upload-cloud" size={20} color="#fff" />}>Enviar lap-to-lap</Button>

        <button style={{ border: "1px solid var(--border-light)", background: "var(--surface)", borderRadius: "var(--radius-md)", padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
          <Icon name="bar-chart-3" size={18} color="var(--text-muted)" />
          <span style={{ flex: 1, textAlign: "left" }}>Ver análise da temporada</span>
          <Icon name="chevron-right" size={18} color="var(--text-muted)" />
        </button>
      </div>
    </div>
  );
}
Object.assign(window, { ProfileScreen });
