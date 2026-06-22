import { notFound } from "next/navigation";
import { SectionHead, VzCard, VzChip, VzIcon } from "@/components/VelozesUI";
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
    <div className="vz-page tight ranking-page">
      <SectionHead icon="trophy" sub="Ranking compartilhável desta temporada." title={season.name} />
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {["Jan", "Fev", "Mar", "Abr", "Geral"].map((month) => (
          <VzChip active={month === "Geral"} key={month}>{month}</VzChip>
        ))}
      </div>
      <VzCard className="ranking-card">
        <div className="ranking-header">
          <span>Pos.</span>
          <span>Piloto</span>
          <span>Total de pontos</span>
        </div>
        {ranking.length ? (
          ranking.map((pilot) => (
            <a className="ranking-row" href={`/pilotos/${pilot.pilotSlug}`} key={pilot.pilotId}>
              <span className={`rank-pos ${pilot.rank <= 3 ? `top-${pilot.rank}` : ""}`}>{pilot.rank}</span>
              <span className="vz-avatar"><VzIcon name="user" size={20} /></span>
              <span className="ranking-driver">
                <span><strong>{pilot.pilotName}</strong><em>{pilot.uf ?? "UF não informada"}</em></span>
                <span className="ranking-months"><small>bruto <b>{pilot.grossPoints}</b></small><small>descarte <b>{pilot.discardedPoints}</b></small></span>
              </span>
              <span className="ranking-total"><strong>{pilot.finalPoints}</strong><small>pts</small><VzIcon name="chevron-right" size={16} /></span>
            </a>
          ))
        ) : (
          <p className="muted" style={{ padding: "18px 0" }}>Ranking ainda não iniciado.</p>
        )}
      </VzCard>
    </div>
  );
}
