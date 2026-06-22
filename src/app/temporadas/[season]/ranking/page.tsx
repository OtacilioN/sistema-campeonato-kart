import { notFound } from "next/navigation";
import { SectionHead, VzCard, VzChip, VzIcon } from "@/components/VelozesUI";
import { getPublicRanking } from "@/lib/data/public";
import type { RankingRow } from "@/lib/domain/types";

export const dynamic = "force-dynamic";

type RankingSeasonPageProps = {
  params: Promise<{
    season: string;
  }>;
  searchParams?: Promise<{
    bateria?: string;
  }>;
};

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

export default async function RankingSeasonPage({ params, searchParams }: RankingSeasonPageProps) {
  const { season: seasonSlug } = await params;
  const query = await searchParams;
  const { season, ranking } = await getPublicRanking(seasonSlug);
  if (!season) notFound();
  const confirmedBatteries = season.batteries.filter((battery) => battery.status === "CONFIRMED");
  const requestedBattery = Number(query?.bateria);
  const selectedBatteryNumber = confirmedBatteries.some((battery) => battery.number === requestedBattery) ? requestedBattery : null;
  const displayedRows = rowsForBattery(ranking, selectedBatteryNumber);

  return (
    <div className="vz-page tight ranking-page">
      <SectionHead icon="trophy" sub="Ranking compartilhável desta temporada." title={season.name} />
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {confirmedBatteries.map((battery) => (
          <VzChip active={selectedBatteryNumber === battery.number} href={`/temporadas/${season.slug}/ranking?bateria=${battery.number}`} key={battery.id}>
            {battery.monthLabel ?? batteryLabel(battery.number)}
          </VzChip>
        ))}
        <VzChip active={!selectedBatteryNumber} href={`/temporadas/${season.slug}/ranking`}>Geral</VzChip>
      </div>
      <VzCard className="ranking-card">
        <div className="ranking-header">
          <span>Pos.</span>
          <span>Piloto</span>
          <span>{selectedBatteryNumber ? "Pontos na bateria" : "Total de pontos"}</span>
        </div>
        {displayedRows.length ? (
          displayedRows.map(({ entry, pilot, points, rank }) => (
            <a className="ranking-row" href={`/pilotos/${pilot.pilotSlug}`} key={pilot.pilotId}>
              <span className={`rank-pos ${rank <= 3 ? `top-${rank}` : ""}`}>{rank}</span>
              <span className="ranking-driver">
                <span><strong>{pilot.pilotName}</strong><em>{pilot.uf ?? "UF não informada"}</em></span>
                <span className="ranking-months">
                  {entry ? (
                    <small>{batteryLabel(entry.batteryNumber)} <b>{entry.finalPoints}</b></small>
                  ) : (
                    <>
                      <small>bruto <b>{pilot.grossPoints}</b></small>
                      <small>descarte <b>{pilot.discardedPoints}</b></small>
                    </>
                  )}
                </span>
              </span>
              <span className="ranking-total"><strong>{points}</strong><small>pts</small><VzIcon name="chevron-right" size={16} /></span>
            </a>
          ))
        ) : (
          <p className="muted" style={{ padding: "18px 0" }}>Ranking ainda não iniciado.</p>
        )}
      </VzCard>
    </div>
  );
}
