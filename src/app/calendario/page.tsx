import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { demoSeason } from "@/lib/demo-data";

export default function CalendarioPage() {
  return (
    <div className="grid">
      <PageHeader
        eyebrow={demoSeason.name}
        title="Calendário"
        description="Baterias planejadas e confirmadas da temporada ativa. Datas e horários poderão ser ajustados pelo administrador."
      />
      <section className="table">
        {demoSeason.batteries.map((battery) => (
          <Link
            className="row"
            href={`/temporadas/${demoSeason.slug}/baterias/${battery.number}-bateria`}
            key={battery.number}
          >
            <span className="pos">{battery.number}</span>
            <div>
              <strong>{battery.label}</strong>
              <p className="meta">{battery.month} · Circuito Internacional Paladino · {battery.status}</p>
            </div>
            <span className="pill">{battery.status}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
