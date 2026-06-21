import { PageHeader } from "@/components/PageHeader";
import { demoRanking } from "@/lib/demo-data";

type RankingSeasonPageProps = {
  params: Promise<{
    season: string;
  }>;
};

export default async function RankingSeasonPage({ params }: RankingSeasonPageProps) {
  const { season } = await params;

  return (
    <div className="grid">
      <PageHeader
        eyebrow={`Temporada ${season}`}
        title="Ranking da temporada"
        description="URL estável para compartilhamento do ranking de uma temporada específica."
      />
      <section className="table">
        {demoRanking.map((pilot) => (
          <div className="row" key={pilot.pilot}>
            <span className="pos">{pilot.position}</span>
            <div>
              <strong>{pilot.pilot}</strong>
              <p className="meta">Bruto {pilot.gross} · descarte {pilot.discard}</p>
            </div>
            <span className="score">{pilot.final}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
