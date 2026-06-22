import { SectionHead, VzBadge, VzButton, VzCard, VzChip, VzIcon } from "@/components/VelozesUI";
import { batteryPathSlug, batteryStatusLabel } from "@/lib/domain/labels";
import { getPublicSeasons } from "@/lib/data/public";

export const dynamic = "force-dynamic";

function seasonStatusLabel(active: boolean) {
  return active ? "Temporada ativa" : "Temporada passada";
}

export default async function TemporadasPage() {
  const seasons = await getPublicSeasons();

  return (
    <div className="vz-page tight seasons-page">
      <SectionHead
        icon="calendar-clock"
        sub="Escolha uma temporada para ver ranking e baterias confirmadas."
        title="Temporadas"
      />

      {seasons.length ? (
        <div className="season-list">
          {seasons.map((season) => {
            const confirmedBatteries = season.batteries.filter((battery) => battery.status === "CONFIRMED");
            const pilotCount = new Set(confirmedBatteries.flatMap((battery) => battery.results.map((result) => result.pilotId))).size;

            return (
              <VzCard className="season-card" key={season.id}>
                <div className="section-row season-card-head">
                  <div>
                    <h2>{season.name}</h2>
                    <p className="muted">{seasonStatusLabel(season.active)}</p>
                  </div>
                  <VzBadge icon={season.active ? "circle-check" : "calendar-clock"} tone={season.active ? "success" : "neutral"}>
                    {season.active ? "Ativa" : "Arquivo"}
                  </VzBadge>
                </div>

                <div className="season-stat-grid">
                  <div className="mini-stat">
                    <span>Baterias confirmadas</span>
                    <strong>{confirmedBatteries.length}</strong>
                  </div>
                  <div className="mini-stat">
                    <span>Pilotos no ranking</span>
                    <strong>{pilotCount}</strong>
                  </div>
                  <div className="mini-stat">
                    <span>Total de baterias</span>
                    <strong>{season.batteries.length}</strong>
                  </div>
                </div>

                <VzButton href={season.active ? "/ranking" : `/temporadas/${season.slug}/ranking`}>
                  Ver ranking
                  <VzIcon name="chevron-right" size={16} />
                </VzButton>

                {season.batteries.length ? (
                  <div className="season-battery-list">
                    {season.batteries.map((battery) => {
                      const isConfirmed = battery.status === "CONFIRMED";
                      const label = battery.monthLabel ?? battery.label;
                      return isConfirmed ? (
                        <VzChip href={`/temporadas/${season.slug}/baterias/${batteryPathSlug(battery.number)}`} key={battery.id}>
                          {label}
                        </VzChip>
                      ) : (
                        <VzChip key={battery.id}>
                          {label} · {batteryStatusLabel(battery.status)}
                        </VzChip>
                      );
                    })}
                  </div>
                ) : (
                  <p className="muted">Nenhuma bateria cadastrada nesta temporada.</p>
                )}
              </VzCard>
            );
          })}
        </div>
      ) : (
        <VzCard>
          <SectionHead
            icon="calendar-clock"
            sub="Crie uma temporada no admin para iniciar o histórico público."
            title="Nenhuma temporada cadastrada"
          />
        </VzCard>
      )}
    </div>
  );
}
