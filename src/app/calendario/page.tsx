import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { batteryPathSlug, batteryStatusLabel } from "@/lib/domain/labels";
import { formatDateTime } from "@/lib/domain/time";
import { getActiveSeason } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const season = await getActiveSeason();

  return (
    <div className="grid">
      <PageHeader
        eyebrow={season?.name ?? "Temporada ativa"}
        title="Calendário"
        description="Baterias planejadas e confirmadas da temporada ativa. Datas e horários podem ser ajustados pelo administrador."
      />

      {!season || season.batteries.length === 0 ? (
        <section className="card">
          <h2>Nenhuma bateria cadastrada</h2>
          <p className="muted">Crie a temporada ativa e cadastre as baterias no admin para iniciar o calendário público.</p>
        </section>
      ) : (
        <section className="table">
          {season.batteries.map((battery) => (
            <Link
              className="row"
              href={`/temporadas/${season.slug}/baterias/${batteryPathSlug(battery.number)}`}
              key={battery.id}
            >
              <span className="pos">{battery.number}</span>
              <div>
                <strong>{battery.label}</strong>
                <p className="meta">
                  {battery.monthLabel ?? formatDateTime(battery.scheduledAt)} · {battery.locationName} · {battery.city}, {battery.uf}
                </p>
              </div>
              <span className="pill">{batteryStatusLabel(battery.status)}</span>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
