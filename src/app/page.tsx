import { ArrowRight, CalendarDays, Gauge, Trophy } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { appInfo, demoRanking, demoSeason } from "@/lib/demo-data";

export default function Home() {
  const nextBattery = demoSeason.batteries.find((battery) => battery.status === "planejada");

  return (
    <div className="grid">
      <PageHeader
        eyebrow="PWA inicializado"
        title={appInfo.publicName}
        description={`${appInfo.description}. Codinome técnico: ${appInfo.codename}.`}
      />

      <section className="grid two">
        <article className="card dark">
          <span className="pill">Demonstração</span>
          <div style={{ height: 16 }} />
          <h2>{nextBattery?.label ?? "Próxima bateria"}</h2>
          <p className="muted">{nextBattery?.month ?? "Temporada ativa"} · Circuito Internacional Paladino · Conde, PB</p>
          <div style={{ height: 18 }} />
          <Link className="button" href="/calendario">
            Ver calendário <ArrowRight size={18} />
          </Link>
        </article>

        <article className="card">
          <div className="stat">
            <strong>7</strong>
            <span>baterias por temporada</span>
          </div>
          <p className="muted">Temporadas semestrais, ranking por temporada ativa e descarte do pior resultado após duas baterias confirmadas.</p>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>Ranking demonstrativo</h2>
          <p className="muted">Dados temporários para validar layout. O ranking real usará apenas resultados confirmados.</p>
          <div style={{ height: 14 }} />
          <div className="table">
            {demoRanking.slice(0, 3).map((pilot) => (
              <div className="row" key={pilot.pilot}>
                <span className="pos">{pilot.position}</span>
                <div>
                  <strong>{pilot.pilot}</strong>
                  <p className="meta">{pilot.uf} · bruto {pilot.gross} · descarte {pilot.discard}</p>
                </div>
                <span className="score">{pilot.final}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 14 }} />
          <Link className="button secondary" href="/ranking">
            Ranking completo <Trophy size={18} />
          </Link>
        </article>

        <article className="card">
          <h2>Atalhos</h2>
          <p className="muted">Rotas base criadas para orientar a implementação das próximas telas.</p>
          <div style={{ height: 14 }} />
          <div className="grid">
            <Link className="button" href="/calendario">
              <CalendarDays size={18} /> Calendário
            </Link>
            <Link className="button secondary" href="/pilotos">
              <Gauge size={18} /> Pilotos
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
