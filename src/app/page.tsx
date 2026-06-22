import { IconTile, RankRow, VzButton, VzCard, VzIcon } from "@/components/VelozesUI";
import { getActiveSeason, getPublicRanking } from "@/lib/data/public";

export const dynamic = "force-dynamic";

function eventDate(value: Date | null | undefined) {
  if (!value) return "A definir";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(value).replace(".", "").toUpperCase();
}

type ActiveSeason = Awaited<ReturnType<typeof getActiveSeason>>;

function speedStats(season: ActiveSeason) {
  const batteryAverages = season?.batteries
    .map((battery) => {
      const speeds = battery.results
        .map((result) => Number(result.averageSpeed ?? 0))
        .filter((speed) => Number.isFinite(speed) && speed > 0);

      if (!speeds.length) return null;
      return {
        label: battery.label,
        speed: speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length,
      };
    })
    .filter((item): item is { label: string; speed: number } => Boolean(item)) ?? [];

  const speeds = batteryAverages.map((item) => item.speed);
  if (!speeds.length) return { average: "0,0", batteryAverages };
  const avg = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
  return {
    average: avg.toLocaleString("pt-BR", { maximumFractionDigits: 1 }),
    batteryAverages,
  };
}

function speedSparkline(points: { speed: number }[]) {
  if (points.length < 2) return null;

  const width = 96;
  const height = 48;
  const padding = 6;
  const min = Math.min(...points.map((point) => point.speed));
  const max = Math.max(...points.map((point) => point.speed));
  const range = max - min || 1;
  const step = (width - padding * 2) / (points.length - 1);
  const coordinates = points.map((point, index) => {
    const x = padding + index * step;
    const y = height - padding - ((point.speed - min) / range) * (height - padding * 2);
    return { x, y };
  });
  const path = coordinates.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const last = coordinates.at(-1);

  return (
    <svg aria-hidden="true" height="48" viewBox={`0 0 ${width} ${height}`} width="96">
      <path d={path} fill="none" stroke="#E10600" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
      {last ? <circle cx={last.x} cy={last.y} fill="#E10600" r="3.2" /> : null}
    </svg>
  );
}

function timeUntilEvent(value: Date | null | undefined) {
  if (!value) return null;
  const remaining = value.getTime() - Date.now();
  if (remaining <= 0) return null;

  const minutesTotal = Math.floor(remaining / 60000);
  const days = Math.floor(minutesTotal / 1440);
  const hours = Math.floor((minutesTotal % 1440) / 60);
  const minutes = minutesTotal % 60;
  return [
    { label: "DIAS", value: days },
    { label: "HORAS", value: hours },
    { label: "MIN", value: minutes },
  ];
}

export default async function Home() {
  const [season, rankingData] = await Promise.all([getActiveSeason(), getPublicRanking()]);
  const nextBattery = season?.batteries.find((battery) => battery.status !== "CONFIRMED" && battery.status !== "CANCELED");
  const podium = rankingData.ranking.slice(0, 5);
  const countdown = timeUntilEvent(nextBattery?.scheduledAt);
  const speeds = speedStats(season);

  return (
    <div className="vz-page home-page">
      <VzCard>
        <div className="event-card" style={{ marginBottom: 14 }}>
          <IconTile name="calendar" />
          <div className="event-body">
            <div style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>Próximo evento</div>
            <div style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>
              {eventDate(nextBattery?.scheduledAt)}
            </div>
            <div style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600, marginTop: 2 }}>
              {nextBattery?.locationName ?? "Nenhum próximo evento cadastrado"}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              {nextBattery ? `${nextBattery.city}, ${nextBattery.uf}` : "Aguardando calendário"}
            </div>
          </div>
        </div>

        {countdown ? (
          <>
            <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>Falta para o evento</div>
            <div className="countdown-grid" style={{ marginBottom: 16 }}>
              {countdown.map((item) => (
                <div className="countdown-cell" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="muted" style={{ marginBottom: 16 }}>Nenhum próximo evento com data futura cadastrada.</p>
        )}

        <VzButton href="/calendario">Ver calendário</VzButton>
      </VzCard>

      <VzCard>
        <div style={{ alignItems: "center", display: "flex", gap: 12, marginBottom: 6 }}>
          <IconTile name="trophy" />
          <h2 style={{ flex: 1, fontSize: 22, textTransform: "none" }}>Pódio atual</h2>
          <span style={{ alignItems: "center", color: "var(--text-secondary)", display: "inline-flex", fontSize: 13, gap: 4 }}>
            {season?.name ?? "Temporada"}
          </span>
        </div>

        {podium.length ? (
          <div>
            {podium.map((pilot) => (
              <RankRow
                href={`/pilotos/${pilot.pilotSlug}`}
                key={pilot.pilotId}
                meta={`bruto ${pilot.grossPoints} · descarte ${pilot.discardedPoints}`}
                name={(
                  <span className="podium-pilot-name">
                    <span>{pilot.pilotName}</span>
                    <em>{pilot.uf ?? "UF não informada"}</em>
                  </span>
                )}
                podium
                points={pilot.finalPoints}
                rank={pilot.rank}
              />
            ))}
          </div>
        ) : (
          <p className="muted">Ranking ainda não iniciado.</p>
        )}

        <div style={{ marginTop: 12 }}>
          <VzButton href="/ranking" variant="secondary">
            Ver ranking completo <VzIcon name="chevron-right" size={16} />
          </VzButton>
        </div>
      </VzCard>

      <VzCard>
        <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
          <IconTile name="gauge" size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Velocidade quase máxima</div>
            <div style={{ alignItems: "baseline", display: "flex", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700 }}>{speeds.average}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 14 }}>km/h</span>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Média da temporada até agora</div>
          </div>
          {speeds.batteryAverages.length > 1 ? (
            <div style={{ background: "var(--brand-red-soft)", borderRadius: "var(--radius-md)", flex: "none", padding: "8px 6px" }}>
              {speedSparkline(speeds.batteryAverages)}
            </div>
          ) : null}
        </div>
      </VzCard>

    </div>
  );
}
