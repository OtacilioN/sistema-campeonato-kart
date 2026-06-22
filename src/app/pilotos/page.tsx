import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getPublicRanking } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function PilotosPage() {
  const { season, ranking } = await getPublicRanking();

  return (
    <div className="grid">
      <PageHeader
        eyebrow={season?.name ?? "Temporada ativa"}
        title="Pilotos"
        description="Lista pública de pilotos que já participaram de resultado confirmado na temporada ativa."
      />

      {ranking.length ? (
        <section className="table">
          {ranking.map((pilot) => (
            <Link className="row" href={`/pilotos/${pilot.pilotSlug}`} key={pilot.pilotId}>
              <span className="pos">{pilot.uf}</span>
              <div>
                <strong>{pilot.pilotName}</strong>
                <p className="meta">{pilot.entries.length} baterias · {pilot.grossPoints} pts brutos · {pilot.discardedPoints} descarte</p>
              </div>
              <span className="score">{pilot.finalPoints}</span>
            </Link>
          ))}
        </section>
      ) : (
        <section className="card">
          <h2>Nenhum piloto cadastrado</h2>
          <p className="muted">Os pilotos aparecem aqui depois da primeira bateria confirmada por PDF oficial ou inserção manual.</p>
        </section>
      )}
    </div>
  );
}
