import { ChevronDown, ChevronRight } from "lucide-react";
import { IconTile, RankRow, VzButton, VzCard, VzIcon } from "@/components/VelozesUI";
import { getActiveSeason, getPublicRanking } from "@/lib/data/public";

export const dynamic = "force-dynamic";

function eventDate(value: Date | null | undefined) {
  if (!value) return "A definir";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(value).replace(".", "").toUpperCase();
}

function averageSpeed(season: Awaited<ReturnType<typeof getActiveSeason>>) {
  const speeds = season?.batteries.flatMap((battery) =>
    battery.results
      .map((result) => Number(result.averageSpeed ?? 0))
      .filter((speed) => Number.isFinite(speed) && speed > 0),
  ) ?? [];
  if (!speeds.length) return "0,0";
  const avg = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
  return avg.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

export default async function Home() {
  const [season, rankingData] = await Promise.all([getActiveSeason(), getPublicRanking()]);
  const nextBattery = season?.batteries.find((battery) => battery.status !== "CANCELED");
  const podium = rankingData.ranking.slice(0, 5);

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
              {nextBattery?.locationName ?? "Circuito Internacional Paladino"}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              {nextBattery ? `${nextBattery.city}, ${nextBattery.uf}` : "Conde, PB"}
            </div>
          </div>
        </div>

        <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>Falta para o evento</div>
        <div className="countdown-grid" style={{ marginBottom: 16 }}>
          {["DIAS", "HORAS", "MIN", "SEG"].map((label) => (
            <div className="countdown-cell" key={label}>
              <strong>--</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <VzButton href="/calendario">Ver calendário</VzButton>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <span style={{ alignItems: "center", display: "inline-flex", fontSize: 14, fontWeight: 600, gap: 6 }}>
            Regulamento <ChevronRight size={16} strokeWidth={2.2} />
          </span>
        </div>
      </VzCard>

      <VzCard>
        <div style={{ alignItems: "center", display: "flex", gap: 12, marginBottom: 6 }}>
          <IconTile name="trophy" />
          <h2 style={{ flex: 1, fontSize: 22, textTransform: "none" }}>Pódio atual</h2>
          <span style={{ alignItems: "center", color: "var(--text-secondary)", display: "inline-flex", fontSize: 13, gap: 4 }}>
            {season?.name ?? "Temporada"} <ChevronDown size={16} />
          </span>
        </div>

        {podium.length ? (
          <div>
            {podium.map((pilot) => (
              <RankRow
                href={`/pilotos/${pilot.pilotSlug}`}
                key={pilot.pilotId}
                meta={`${pilot.uf ?? "UF não informada"} · bruto ${pilot.grossPoints} · descarte ${pilot.discardedPoints}`}
                name={pilot.pilotName}
                podium
                points={pilot.finalPoints}
                rank={pilot.rank}
                showAvatar={false}
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
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700 }}>{averageSpeed(season)}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 14 }}>km/h</span>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Média da temporada até agora</div>
          </div>
          <div style={{ background: "var(--brand-red-soft)", borderRadius: "var(--radius-md)", flex: "none", padding: "8px 6px" }}>
            <svg height="48" viewBox="0 0 96 48" width="96">
              <path d="M4 36 L18 30 L32 33 L46 22 L60 27 L74 14 L92 18" fill="none" stroke="#E10600" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
              <circle cx="92" cy="18" fill="#E10600" r="3.2" />
            </svg>
          </div>
        </div>
      </VzCard>

    </div>
  );
}
