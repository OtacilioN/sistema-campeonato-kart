// Velozes app — orchestrator. Routes between screens and the admin login sheet.
function App() {
  const { Button, Input } = window.VelozesDesignSystem_32dd15;
  const [screen, setScreen] = React.useState("home"); // home|calendar|ranking|drivers|profile|race|admin
  const [navTab, setNavTab] = React.useState("home");
  const [adminGate, setAdminGate] = React.useState(false);

  React.useEffect(() => { hydrateIcons(); });

  const go = (s, tab) => { setScreen(s); if (tab) setNavTab(tab); window.scrollTo(0, 0); };
  const onNav = (id) => {
    if (id === "drivers") { go("profile", "drivers"); }
    else { go(id, id); }
  };
  const openProfile = () => go("profile", "drivers");
  const openRace = () => go("race", navTab);
  const showAdmin = () => setAdminGate(true);

  let content;
  if (screen === "home") content = <HomeScreen onNav={onNav} onOpenProfile={openProfile} onLock={showAdmin} />;
  else if (screen === "calendar") content = <CalendarScreen onBack={() => go("home", "home")} onLock={showAdmin} />;
  else if (screen === "ranking") content = <RankingScreen onLock={showAdmin} onOpenProfile={openProfile} />;
  else if (screen === "profile") content = <ProfileScreen onBack={() => go(navTab === "drivers" ? "home" : navTab, "home")} onOpenRace={openRace} />;
  else if (screen === "race") content = <RaceScreen onBack={() => go("profile", "drivers")} />;
  else if (screen === "admin") content = <AdminScreen onBack={() => go("home", "home")} />;

  const showNav = ["home", "calendar", "ranking", "profile"].includes(screen);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "var(--off-white)" }}>
      <div style={{ flex: 1 }}>{content}</div>
      {showNav && <BottomNav active={navTab} onNav={onNav} />}

      {adminGate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(7,7,7,.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setAdminGate(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, background: "var(--surface)", borderRadius: "var(--radius-modal) var(--radius-modal) 0 0", padding: 24, boxShadow: "var(--shadow-floating)" }}>
            <div style={{ width: 38, height: 4, borderRadius: 999, background: "var(--border-strong)", margin: "0 auto 18px" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--racing-black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="lock" size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-primary)" }}>Acesso administrativo</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>Informe a senha para continuar.</div>
              </div>
            </div>
            <div style={{ margin: "16px 0" }}>
              <Input label="Senha" type="password" defaultValue="••••••••" suffix={<Icon name="eye" size={18} color="var(--text-muted)" />} />
            </div>
            <Button variant="dark" size="lg" fullWidth onClick={() => { setAdminGate(false); go("admin"); }}>Entrar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
Object.assign(window, { App });
