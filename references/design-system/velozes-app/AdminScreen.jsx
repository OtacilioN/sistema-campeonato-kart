// Velozes — Painel Admin (interativo)
function AdminScreen({ onBack }) {
  const { Card, Button, Badge } = window.VelozesDesignSystem_32dd15;
  const D = window.VZ_DATA;
  const a = D.admin;

  const eventList = [
    { circuit: "Autódromo Internacional", city: "Curitiba – PR", date: "12/06/2024" },
    { circuit: "Autódromo de Interlagos", city: "São Paulo – SP", date: "15/07/2024" },
    { circuit: "Autódromo Velopark", city: "Nova Santa Rita – RS", date: "07/08/2024" },
  ];
  const sampleTimes = ["14:32.184", "14:34.502", "14:38.961", "14:41.207", "14:45.880"];

  const [eventIdx, setEventIdx] = React.useState(0);
  const [rows, setRows] = React.useState(a.result.map((r) => ({ name: r.name, time: "", penalty: null })));
  const [editMode, setEditMode] = React.useState(false);
  const [sheet, setSheet] = React.useState(null);        // 'event' | 'upload'
  const [penaltyOpen, setPenaltyOpen] = React.useState(false);
  const [imports, setImports] = React.useState(a.imports.map((x) => ({ ...x })));
  const [menuIdx, setMenuIdx] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [chosenFile, setChosenFile] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const ev = eventList[eventIdx];
  React.useEffect(() => { hydrateIcons(); });

  const flash = (msg, tone) => {
    setToast({ msg, tone: tone || "ok" });
    clearTimeout(window.__vzToast);
    window.__vzToast = setTimeout(() => setToast(null), 2400);
  };
  const setRow = (i, field, val) => setRows((rs) => rs.map((r, k) => (k === i ? { ...r, [field]: val } : r)));
  const addRow = () => { setEditMode(true); setRows((rs) => [...rs, { name: "", time: "", penalty: null }]); };
  const removeRow = (i) => setRows((rs) => rs.filter((_, k) => k !== i));
  const moveRow = (i, dir) => setRows((rs) => {
    const j = i + dir; if (j < 0 || j >= rs.length) return rs;
    const c = rs.slice(); const t = c[i]; c[i] = c[j]; c[j] = t; return c;
  });
  const recalc = () => {
    if (rows.some((r) => !r.name.trim())) { flash("Preencha o nome de todos os competidores.", "warn"); return; }
    setEditMode(false); flash("Resultado salvo · ranking recalculado.");
  };
  const applyPenalty = (idx, pts, reason) => {
    setRows((rs) => rs.map((r, k) => (k === idx ? { ...r, penalty: { pts, reason } } : r)));
    setPenaltyOpen(false); flash("Punição aplicada · " + pts + " pts.", "warn");
  };
  const doUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setRows((rs) => rs.map((r, k) => ({ ...r, time: sampleTimes[k] || r.time })));
      setImports((im) => [{ file: chosenFile, at: ev.date + " • agora", status: "Processado" }, ...im]);
      setSheet(null); setChosenFile(null);
      flash("PDF processado · resultado importado.");
    }, 1200);
  };

  const ord = (n) => n + "º";

  return (
    <div onClick={() => setMenuIdx(null)}>
      <Header title="Admin" dark onBack={onBack} sub={<><Icon name="shield-check" size={14} color="#fff" /> Autenticado como administrador</>} />
      <div style={{ padding: "16px 16px 40px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Event selector */}
        <button onClick={() => setSheet("event")} style={{ textAlign: "left", width: "100%", border: "1px solid var(--border-light)", background: "var(--surface)", borderRadius: "var(--radius-md)", padding: 16, cursor: "pointer", boxShadow: "var(--shadow-card)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconTile name="calendar" tone="dark" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>Selecione o evento</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{ev.circuit}</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>{ev.city} • {ev.date}</div>
            </div>
            <Icon name="chevron-down" size={20} color="var(--text-muted)" />
          </div>
        </button>

        {/* Importar resultado */}
        <Card>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>Importar resultado</div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>Escolha como deseja inserir ou atualizar os resultados.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button onClick={() => setSheet("upload")} style={{ textAlign: "left", border: "1px solid var(--border-light)", background: "var(--surface)", borderRadius: "var(--radius-md)", padding: 14, cursor: "pointer" }}>
              <IconTile name="file-text" iconSize={20} size={40} />
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginTop: 10 }}>Upload PDF oficial</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Importe o resultado oficial publicado pela organização.</div>
            </button>
            <button onClick={() => { setEditMode(true); flash("Modo de inserção manual ativado."); }} style={{ textAlign: "left", border: editMode ? "1px solid var(--brand-red)" : "1px solid var(--border-light)", background: editMode ? "var(--brand-red-soft)" : "var(--surface)", borderRadius: "var(--radius-md)", padding: 14, cursor: "pointer" }}>
              <IconTile name="keyboard" iconSize={20} size={40} />
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginTop: 10 }}>Inserção manual</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Digite ou edite os resultados manualmente.</div>
            </button>
          </div>
        </Card>

        {/* Pódio / resultado editor */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <Icon name="trophy" size={22} color="var(--text-primary)" />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>Pódio / resultado</span>
            </div>
            <button onClick={() => setEditMode((v) => !v)} style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, color: editMode ? "var(--brand-red)" : "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              {editMode ? "Concluir edição" : "Editar resultado"} <Icon name={editMode ? "check" : "pencil"} size={15} />
            </button>
          </div>

          {rows.map((row, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 36, height: 40, flex: "none", borderRadius: "var(--radius-sm)", background: i < 3 ? "var(--racing-black)" : "var(--surface-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, color: i < 3 ? "#fff" : "var(--text-primary)" }}>{ord(i + 1)}</div>
                <Avatar size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editMode ? (
                    <input value={row.name} onChange={(e) => setRow(i, "name", e.target.value)} placeholder="Nome do competidor" style={inp()} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", minHeight: 40, padding: "0 12px", border: "1px solid var(--border-light)", borderRadius: "var(--radius-input)", fontFamily: "var(--font-ui)", fontSize: 14, color: row.name ? "var(--text-primary)" : "var(--text-muted)" }}>{row.name || "—"}</div>
                  )}
                </div>
                {editMode ? (
                  <input value={row.time} onChange={(e) => setRow(i, "time", e.target.value)} placeholder="--:--.---" style={{ ...inp(), width: 92, flex: "none", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 13 }} />
                ) : (
                  <div style={{ width: 92, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, padding: "0 8px", border: "1px solid var(--border-light)", borderRadius: "var(--radius-input)", fontFamily: "var(--font-mono)", fontSize: 13, color: row.time ? "var(--text-primary)" : "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{row.time || "--:--.---"}</div>
                )}
                {editMode ? (
                  <div style={{ display: "flex", flexDirection: "column", flex: "none" }}>
                    <button onClick={() => moveRow(i, -1)} aria-label="Subir" style={iconBtn()}><Icon name="chevron-up" size={16} color="var(--text-muted)" /></button>
                    <button onClick={() => moveRow(i, 1)} aria-label="Descer" style={iconBtn()}><Icon name="chevron-down" size={16} color="var(--text-muted)" /></button>
                  </div>
                ) : (
                  <Icon name="grip-vertical" size={18} color="var(--border-strong)" />
                )}
                {editMode && (
                  <button onClick={() => removeRow(i)} aria-label="Remover" style={iconBtn()}><Icon name="trash-2" size={17} color="var(--danger)" /></button>
                )}
              </div>
              {row.penalty && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, marginLeft: 44, background: "var(--danger-soft)", color: "var(--danger)", borderRadius: "var(--radius-pill)", padding: "3px 10px", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600 }}>
                  <Icon name="gavel" size={13} color="var(--danger)" />
                  <span style={{ fontFamily: "var(--font-mono)" }}>{row.penalty.pts} pts</span>
                  <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>· {row.penalty.reason}</span>
                  <button onClick={() => setRow(i, "penalty", null)} aria-label="Remover punição" style={{ ...iconBtn(), padding: 0, marginLeft: 2 }}><Icon name="x" size={13} color="var(--text-muted)" /></button>
                </div>
              )}
            </div>
          ))}

          <button onClick={addRow} style={{ width: "100%", border: "1px dashed var(--border-strong)", background: "transparent", borderRadius: "var(--radius-md)", padding: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginTop: 4 }}>
            <Icon name="plus" size={18} /> Adicionar competidor
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="gavel" size={16} />} onClick={() => setPenaltyOpen(true)}>Aplicar punição</Button>
            <Button variant="secondary" size="sm" iconLeft={<Icon name={editMode ? "check" : "pencil"} size={16} />} onClick={() => setEditMode((v) => !v)}>{editMode ? "Concluir" : "Editar"}</Button>
            <Button variant="primary" size="sm" iconLeft={<Icon name="calculator" size={16} color="#fff" />} onClick={recalc}>Recalcular</Button>
          </div>
        </Card>

        {/* Alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: "var(--warning-soft)", borderRadius: "var(--radius-md)" }}>
            <Icon name="triangle-alert" size={20} color="#B45309" />
            <div style={{ flex: 1, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}><b>Nome duplicado:</b> "Bruno Costa" aparece em outro evento.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: "var(--info-soft)", borderRadius: "var(--radius-md)" }}>
            <Icon name="user-plus" size={20} color="var(--info)" />
            <div style={{ flex: 1, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}><b>Piloto novo:</b> "Thiago Oliveira" será cadastrado.</div>
          </div>
        </div>

        {/* Importações recentes */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Icon name="clock" size={20} color="var(--text-primary)" />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>Importações recentes</span>
          </div>
          {imports.length === 0 && (
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", padding: "8px 0" }}>Nenhuma importação ainda.</div>
          )}
          {imports.map((imp, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: i ? "1px solid var(--border-light)" : "none", position: "relative" }}>
              <div style={{ width: 36, height: 36, flex: "none", borderRadius: "var(--radius-sm)", background: "var(--danger-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="file-text" size={18} color="var(--danger)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{imp.file}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{imp.at}</div>
              </div>
              <Badge tone="success" icon={<Icon name="circle-check" size={12} />}>{imp.status}</Badge>
              <button onClick={(e) => { e.stopPropagation(); setMenuIdx(menuIdx === i ? null : i); }} aria-label="Opções" style={iconBtn()}><Icon name="ellipsis-vertical" size={18} color="var(--text-muted)" /></button>
              {menuIdx === i && (
                <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 44, zIndex: 30, width: 180, background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-floating)", overflow: "hidden" }}>
                  <button onClick={() => { setMenuIdx(null); flash("Reprocessando \"" + imp.file + "\"…"); }} style={menuItem()}><Icon name="refresh-cw" size={16} color="var(--text-secondary)" /> Reprocessar</button>
                  <button onClick={() => { setMenuIdx(null); flash("Download iniciado."); }} style={menuItem()}><Icon name="download" size={16} color="var(--text-secondary)" /> Baixar PDF</button>
                  <button onClick={() => { setImports((im) => im.filter((_, k) => k !== i)); setMenuIdx(null); flash("Importação removida.", "warn"); }} style={{ ...menuItem(), color: "var(--danger)", borderTop: "1px solid var(--border-light)" }}><Icon name="trash-2" size={16} color="var(--danger)" /> Remover</button>
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* ===== Event picker sheet ===== */}
      {sheet === "event" && (
        <Sheet title="Selecionar evento" subtitle="Escolha a etapa para gerenciar os resultados." onClose={() => setSheet(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {eventList.map((e, i) => {
              const on = i === eventIdx;
              return (
                <button key={i} onClick={() => { setEventIdx(i); setSheet(null); flash("Evento alterado · " + e.circuit + "."); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: on ? "1px solid var(--brand-red)" : "1px solid var(--border-light)", background: on ? "var(--brand-red-soft)" : "var(--surface)", borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left" }}>
                  <IconTile name="calendar" tone={on ? "dark" : "muted"} size={40} iconSize={20} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{e.circuit}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>{e.city} • {e.date}</div>
                  </div>
                  {on && <Icon name="check" size={20} color="var(--brand-red)" />}
                </button>
              );
            })}
          </div>
        </Sheet>
      )}

      {/* ===== Upload PDF sheet ===== */}
      {sheet === "upload" && (
        <Sheet title="Upload de PDF oficial" subtitle="Importe o resultado publicado pela organização." onClose={() => { if (!uploading) { setSheet(null); setChosenFile(null); } }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ border: "1.5px dashed var(--border-strong)", borderRadius: "var(--radius-md)", background: "var(--surface-muted)", padding: "26px 16px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, margin: "0 auto 10px", borderRadius: "var(--radius-md)", background: "var(--surface)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="upload-cloud" size={24} color="var(--text-secondary)" />
              </div>
              {chosenFile ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-primary)", background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-pill)", padding: "5px 12px" }}>
                  <Icon name="file-text" size={14} color="var(--danger)" /> {chosenFile}
                </div>
              ) : (
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>Arraste o PDF aqui ou selecione um arquivo.</div>
              )}
            </div>
            <Button variant="secondary" size="md" fullWidth iconLeft={<Icon name="file-text" size={18} />} onClick={() => setChosenFile("resultado_oficial_" + ev.date.replace(/\//g, "").slice(0, 4) + ".pdf")}>Selecionar arquivo</Button>
            <Button variant="dark" size="lg" fullWidth disabled={!chosenFile || uploading} iconLeft={uploading ? <Icon name="loader" size={20} color="#fff" /> : <Icon name="upload-cloud" size={20} color="#fff" />} onClick={doUpload}>
              {uploading ? "Processando…" : "Importar e processar"}
            </Button>
            {uploading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>
                <Icon name="circle" size={8} color="var(--brand-red)" /> Lendo tabela de tempos do PDF…
              </div>
            )}
          </div>
        </Sheet>
      )}

      {/* ===== Penalty modal ===== */}
      {penaltyOpen && <PenaltyModal rows={rows} onClose={() => setPenaltyOpen(false)} onApply={applyPenalty} />}

      {/* ===== Toast ===== */}
      {toast && (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 22, display: "flex", justifyContent: "center", zIndex: 60, pointerEvents: "none" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, maxWidth: 380, background: "var(--racing-black)", color: "#fff", padding: "11px 16px", borderRadius: "var(--radius-pill)", boxShadow: "var(--shadow-floating)", fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500 }}>
            <Icon name={toast.tone === "warn" ? "triangle-alert" : "circle-check"} size={16} color={toast.tone === "warn" ? "#FFB020" : "#4ADE80"} />
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

// --- shared styles ---
function inp() {
  return { width: "100%", minHeight: 40, padding: "0 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-input)", fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-primary)", background: "var(--surface)", outline: "none" };
}
function iconBtn() {
  return { border: "none", background: "transparent", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" };
}
function menuItem() {
  return { width: "100%", border: "none", background: "transparent", cursor: "pointer", padding: "11px 14px", display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 500, color: "var(--text-primary)", textAlign: "left" };
}

// --- bottom sheet shell ---
function Sheet({ title, subtitle, onClose, children }) {
  React.useEffect(() => { hydrateIcons(); });
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(7,7,7,.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, maxHeight: "82vh", overflowY: "auto", background: "var(--surface)", borderRadius: "var(--radius-modal) var(--radius-modal) 0 0", padding: 22, boxShadow: "var(--shadow-floating)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: "var(--border-strong)", margin: "0 auto 18px" }}></div>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-primary)", lineHeight: 1.1 }}>{title}</div>
            {subtitle && <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Fechar" style={{ border: "none", background: "var(--surface-muted)", borderRadius: "var(--radius-pill)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flex: "none" }}>
            <Icon name="x" size={18} color="var(--text-secondary)" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// --- penalty modal ---
function PenaltyModal({ rows, onClose, onApply }) {
  const { Button } = window.VelozesDesignSystem_32dd15;
  const named = rows.map((r, i) => ({ i, name: r.name })).filter((r) => r.name.trim());
  const [target, setTarget] = React.useState(named.length ? named[0].i : 0);
  const [pts, setPts] = React.useState(-5);
  const [reason, setReason] = React.useState("Conduta antidesportiva");
  React.useEffect(() => { hydrateIcons(); });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(7,7,7,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 400, background: "var(--surface)", borderRadius: "var(--radius-modal)", padding: 22, boxShadow: "var(--shadow-floating)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--danger-soft)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Icon name="gavel" size={20} color="var(--danger)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21, color: "var(--text-primary)", lineHeight: 1.1 }}>Aplicar punição</div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>O desconto será aplicado ao recalcular.</div>
          </div>
        </div>

        <label style={lbl()}>Competidor</label>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <select value={target} onChange={(e) => setTarget(Number(e.target.value))} style={{ ...inp(), appearance: "none", paddingRight: 36, cursor: "pointer" }}>
            {named.length === 0 && <option value={0}>—</option>}
            {named.map((r) => <option key={r.i} value={r.i}>{r.i + 1}º · {r.name}</option>)}
          </select>
          <span style={{ position: "absolute", right: 12, top: 11, pointerEvents: "none" }}><Icon name="chevron-down" size={18} color="var(--text-muted)" /></span>
        </div>

        <label style={lbl()}>Penalidade</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
          {[-3, -5, -10].map((v) => {
            const on = pts === v;
            return (
              <button key={v} onClick={() => setPts(v)} style={{ padding: "10px 0", borderRadius: "var(--radius-sm)", cursor: "pointer", border: on ? "1px solid var(--danger)" : "1px solid var(--border-light)", background: on ? "var(--danger-soft)" : "var(--surface)", color: on ? "var(--danger)" : "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700 }}>{v} pts</button>
            );
          })}
        </div>

        <label style={lbl()}>Motivo</label>
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Descreva o motivo" style={{ ...inp(), marginBottom: 18 }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Button variant="secondary" size="md" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" size="md" disabled={named.length === 0} iconLeft={<Icon name="gavel" size={16} color="#fff" />} onClick={() => onApply(target, pts, reason.trim() || "Penalidade")}>Aplicar</Button>
        </div>
      </div>
    </div>
  );
}
function lbl() {
  return { display: "block", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 };
}

Object.assign(window, { AdminScreen });
