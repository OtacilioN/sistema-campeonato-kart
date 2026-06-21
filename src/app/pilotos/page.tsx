import { PageHeader } from "@/components/PageHeader";
import { demoRanking } from "@/lib/demo-data";

export default function PilotosPage() {
  return (
    <div className="grid">
      <PageHeader
        eyebrow="Temporada ativa"
        title="Pilotos"
        description="Lista pública de pilotos da temporada ativa. Pilotos históricos ficarão preservados para busca futura."
      />
      <section className="table">
        {demoRanking.map((pilot) => (
          <article className="row" key={pilot.pilot}>
            <span className="pos">{pilot.uf}</span>
            <div>
              <strong>{pilot.pilot}</strong>
              <p className="meta">Slug público será derivado de nome + UF.</p>
            </div>
            <span className="score">{pilot.final}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
