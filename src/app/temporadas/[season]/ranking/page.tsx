import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getPublicRanking } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type RankingSeasonPageProps = {
  params: Promise<{
    season: string;
  }>;
};

export default async function RankingSeasonPage({ params }: RankingSeasonPageProps) {
  const { season: seasonSlug } = await params;
  const { season, ranking } = await getPublicRanking(seasonSlug);
  if (!season) notFound();

  return (
    <div className="grid">
      <PageHeader
        eyebrow={season.name}
        title="Ranking da temporada"
        description="URL estável para compartilhamento do ranking de uma temporada específica."
      />

      {ranking.length ? (
        <section className="table">
          {ranking.map((pilot) => (
            <Link className="row" href={`/pilotos/${pilot.pilotSlug}`} key={pilot.pilotId}>
              <span className="pos">{pilot.rank}º</span>
              <div>
                <strong>{pilot.pilotName}</strong>
                <p className="meta">Bruto {pilot.grossPoints} · descarte {pilot.discardedPoints} · vitórias {pilot.wins}</p>
              </div>
              <span className="score">{pilot.finalPoints}</span>
            </Link>
          ))}
        </section>
      ) : (
        <section className="card">
          <h2>Ranking ainda não iniciado</h2>
          <p className="muted">Nenhuma bateria confirmada nesta temporada.</p>
        </section>
      )}
    </div>
  );
}
