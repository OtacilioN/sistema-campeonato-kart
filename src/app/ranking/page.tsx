import { POSITION_POINTS } from "@/lib/domain/scoring";
import { SectionHead, VzBadge, VzCard, VzChip, VzIcon } from "@/components/VelozesUI";
import { getPublicRanking } from "@/lib/data/public";
import type { RankingRow } from "@/lib/domain/types";

export const dynamic = "force-dynamic";

function batteryLabel(number: number) {
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun 1", "Jun 2"];
  return labels[number - 1] ?? `B${number}`;
}

function rowsForBattery(ranking: RankingRow[], batteryNumber: number | null) {
  if (!batteryNumber) {
    return ranking.map((pilot) => ({ entry: null, pilot, rank: pilot.rank, points: pilot.finalPoints }));
  }

  return ranking
    .map((pilot) => ({ pilot, entry: pilot.entries.find((entry) => entry.batteryNumber === batteryNumber) ?? null }))
    .filter((row): row is { pilot: RankingRow; entry: RankingRow["entries"][number] } => Boolean(row.entry))
    .sort((a, b) => b.entry.finalPoints - a.entry.finalPoints || (a.entry.position ?? 999) - (b.entry.position ?? 999) || a.pilot.rank - b.pilot.rank)
    .map((row, index) => ({ ...row, rank: index + 1, points: row.entry.finalPoints }));
}

type RankingPageProps = {
  searchParams?: Promise<{
    bateria?: string;
  }>;
};

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const { season, ranking } = await getPublicRanking();
  const query = await searchParams;
  const confirmedBatteries = season?.batteries.filter((battery) => battery.status === "CONFIRMED") ?? [];
  const requestedBattery = Number(query?.bateria);
  const selectedBatteryNumber = confirmedBatteries.some((battery) => battery.number === requestedBattery) ? requestedBattery : null;
  const displayedRows = rowsForBattery(ranking, selectedBatteryNumber);

  return (
    <div className="vz-page tight ranking-page">
      <SectionHead
        icon="trophy"
        sub="Acompanhe o desempenho dos pilotos na temporada."
        title={season?.name ?? "Temporada ativa"}
      />

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {confirmedBatteries.map((battery) => (
          <VzChip active={selectedBatteryNumber === battery.number} href={`/ranking?bateria=${battery.number}`} key={battery.id}>
            {battery.monthLabel ?? batteryLabel(battery.number)}
          </VzChip>
        ))}
        <VzChip active={!selectedBatteryNumber} href="/ranking">Geral</VzChip>
      </div>

      <VzCard className="ranking-card">
        <div className="ranking-header">
          <span>Pos.</span>
          <span>Piloto</span>
          <span>{selectedBatteryNumber ? "Pontos na bateria" : "Total de pontos"}</span>
        </div>

        {displayedRows.length ? (
          displayedRows.map(({ entry, pilot, points, rank }, index) => (
            <a className="ranking-row" href={`/pilotos/${pilot.pilotSlug}`} key={pilot.pilotId}>
              <span className={`rank-pos ${rank <= 3 ? `top-${rank}` : ""}`}>{rank}</span>
              <span className="ranking-driver">
                <span>
                  <strong>{pilot.pilotName}</strong>
                  <em>{pilot.uf ?? "UF não informada"}</em>
                </span>
                <span className="ranking-months">
                  {(entry ? [entry] : pilot.entries).map((item) => (
                    <small className={item.discarded ? "discarded" : ""} key={`${pilot.pilotId}-${item.batteryNumber}`}>
                      {batteryLabel(item.batteryNumber)} <b>{item.finalPoints}</b>
                    </small>
                  ))}
                </span>
              </span>
              <span className="ranking-total">
                <strong>{points}</strong>
                <small>pts</small>
                <VzIcon name="chevron-right" size={16} />
              </span>
              {index < ranking.length - 1 ? null : null}
            </a>
          ))
        ) : (
          <p className="muted" style={{ padding: "18px 0" }}>Ranking ainda não iniciado.</p>
        )}
      </VzCard>

      <VzCard>
        <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
          <VzIcon name="info" size={22} />
          <h2 style={{ flex: 1, fontSize: 20, textTransform: "none" }}>Como funciona a pontuação</h2>
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: 13, margin: "14px 0 12px" }}>
          A pontuação é definida com base na sua posição em cada corrida.
        </div>
        <div className="rule-mini-grid" style={{ marginBottom: 14 }}>
          {Array.from(POSITION_POINTS.entries()).slice(0, 6).map(([position, points]) => (
            <div className="rule-mini" key={position}>
              <span>{position}º lugar</span>
              <strong>{points} <small>pts</small></strong>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <VzBadge icon="check" tone="success">Pole +1</VzBadge>
          <VzBadge icon="check" tone="success">Melhor volta +1</VzBadge>
          <VzBadge tone="neutral">NC 0</VzBadge>
        </div>
        <div style={{ alignItems: "flex-start", background: "var(--danger-soft)", borderRadius: "var(--radius-md)", display: "flex", gap: 10, padding: 12 }}>
          <VzIcon name="info" size={20} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Penalização</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>Faltas, conduta antidesportiva ou descumprimento de regras.</div>
          </div>
          <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700 }}>-5 <small>pts</small></span>
        </div>
      </VzCard>
    </div>
  );
}
