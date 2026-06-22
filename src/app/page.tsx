import { ArrowRight, CalendarDays, Gauge, Trophy } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { batteryPathSlug, batteryStatusLabel } from "@/lib/domain/labels";
import { formatDateTime } from "@/lib/domain/time";
import { getActiveSeason, getPublicRanking } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [season, rankingData] = await Promise.all([getActiveSeason(), getPublicRanking()]);
  const nextBattery = season?.batteries.find((battery) => battery.status !== "CANCELED");
  const podium = rankingData.ranking.slice(0, 3);

  return (
    <div className="grid">
      <PageHeader
        eyebrow={season?.name ?? "Temporada ativa"}
        title="Velocidade Quase Máxima"
        description="Ranking, calendário e análise volta a volta do campeonato no Circuito Internacional Paladino."
      />

      <section className="grid two">
        <article className="card dark">
          <span className="pill">Próximo evento</span>
          <div className="spacer" />
          <h2>{nextBattery?.label ?? "Nenhuma bateria cadastrada"}</h2>
          <p className="muted">
            {nextBattery
              ? `${formatDateTime(nextBattery.scheduledAt)} · ${nextBattery.locationName} · ${nextBattery.city}, ${nextBattery.uf}`
              : "Quando o admin cadastrar a temporada ativa, o calendário aparecerá aqui."}
          </p>
          <div className="spacer" />
          <Link className="button" href="/calendario">
            Ver calendário <ArrowRight size={18} />
          </Link>
        </article>

        <article className="card">
          <div className="stat">
            <strong>{season?.batteries.length ?? 0}</strong>
            <span>baterias cadastradas</span>
          </div>
          <p className="muted">
            O ranking público usa somente resultados confirmados e aplica o descarte do pior resultado a partir de duas baterias.
          </p>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <div className="section-row">
            <h2>Pódio atual</h2>
            <span className="pill">{season?.name ?? "Sem temporada"}</span>
          </div>
          <div className="spacer small" />
          {podium.length ? (
            <div className="table">
              {podium.map((pilot) => (
                <Link className="row" href={`/pilotos/${pilot.pilotSlug}`} key={pilot.pilotId}>
                  <span className="pos">{pilot.rank}º</span>
                  <div>
                    <strong>{pilot.pilotName}</strong>
                    <p className="meta">{pilot.uf} · bruto {pilot.grossPoints} · descarte {pilot.discardedPoints}</p>
                  </div>
                  <span className="score">{pilot.finalPoints}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted">Ranking ainda não iniciado.</p>
          )}
          <div className="spacer small" />
          <Link className="button secondary" href="/ranking">
            Ranking completo <Trophy size={18} />
          </Link>
        </article>

        <article className="card">
          <h2>Atalhos</h2>
          <p className="muted">Acesse o calendário, a lista de pilotos e os detalhes de uma bateria confirmada.</p>
          <div className="spacer small" />
          <div className="grid">
            <Link className="button" href="/calendario">
              <CalendarDays size={18} /> Calendário
            </Link>
            <Link className="button secondary" href="/pilotos">
              <Gauge size={18} /> Pilotos
            </Link>
            {season && nextBattery ? (
              <Link className="button ghost" href={`/temporadas/${season.slug}/baterias/${batteryPathSlug(nextBattery.number)}`}>
                {batteryStatusLabel(nextBattery.status)}
              </Link>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  );
}
