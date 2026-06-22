import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { POSITION_POINTS } from "@/lib/domain/scoring";
import { getPublicRanking } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const { season, ranking } = await getPublicRanking();

  return (
    <div className="grid">
      <PageHeader
        eyebrow={season?.name ?? "Temporada ativa"}
        title="Ranking"
        description="Classificação por temporada com pontuação bruta, descarte e pontuação final."
      />

      {ranking.length ? (
        <section className="table">
          {ranking.map((pilot) => (
            <Link className="row" href={`/pilotos/${pilot.pilotSlug}`} key={pilot.pilotId}>
              <span className="pos">{pilot.rank}º</span>
              <div>
                <strong>{pilot.pilotName}</strong>
                <p className="meta">{pilot.uf} · bruto {pilot.grossPoints} · descarte {pilot.discardedPoints} · vitórias {pilot.wins}</p>
              </div>
              <span className="score">{pilot.finalPoints}</span>
            </Link>
          ))}
        </section>
      ) : (
        <section className="card">
          <h2>Ranking ainda não iniciado</h2>
          <p className="muted">O ranking aparecerá depois que pelo menos uma bateria for confirmada pelo administrador.</p>
        </section>
      )}

      <section className="card">
        <h2>Como funciona a pontuação</h2>
        <p className="muted">Pole position +1, melhor volta +1, penalização administrativa e pontuação final mínima de 0 ponto. NC sempre soma 0.</p>
        <div className="spacer small" />
        <div className="rule-grid">
          {Array.from(POSITION_POINTS.entries()).map(([position, points]) => (
            <div className="rule" key={position}>
              <span>{position}º</span>
              <strong>{points} pts</strong>
            </div>
          ))}
        </div>
      </section>

      {season ? (
        <Link className="button secondary" href={`/temporadas/${season.slug}/ranking`}>
          Abrir URL estável da temporada
        </Link>
      ) : null}
    </div>
  );
}
