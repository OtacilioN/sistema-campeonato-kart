import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { demoRanking, demoSeason, pointsRules } from "@/lib/demo-data";

export default function RankingPage() {
  return (
    <div className="grid">
      <PageHeader
        eyebrow="Temporada ativa"
        title="Ranking"
        description="Classificação por temporada com pontuação bruta, descarte e pontuação final. Dados demonstrativos até a conexão com o banco."
      />
      <section className="table">
        {demoRanking.map((pilot) => (
          <div className="row" key={pilot.pilot}>
            <span className="pos">{pilot.position}</span>
            <div>
              <strong>{pilot.pilot}</strong>
              <p className="meta">{pilot.uf} · bruto {pilot.gross} · descarte {pilot.discard}</p>
            </div>
            <span className="score">{pilot.final}</span>
          </div>
        ))}
      </section>
      <section className="card">
        <h2>Como funciona a pontuação</h2>
        <p className="muted">Pole position +1, melhor volta +1, penalização padrão -5 e pontuação final mínima de 0 ponto.</p>
        <div style={{ height: 14 }} />
        <div className="rule-grid">
          {pointsRules.map(([position, points]) => (
            <div className="rule" key={position}>
              <span>{position}</span>
              <strong>{points}</strong>
            </div>
          ))}
        </div>
      </section>
      <Link className="button secondary" href={`/temporadas/${demoSeason.slug}/ranking`}>
        Abrir URL estável da temporada
      </Link>
    </div>
  );
}
