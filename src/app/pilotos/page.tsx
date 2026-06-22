import { SectionHead, VzCard, RankRow } from "@/components/VelozesUI";
import { getPublicRanking } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function PilotosPage() {
  const { season, ranking } = await getPublicRanking();

  return (
    <div className="vz-page tight pilots-page">
      <SectionHead
        icon="users"
        sub="Lista pública de pilotos que já participaram de resultado confirmado na temporada ativa."
        title="Pilotos"
      />

      <VzCard>
        {ranking.length ? (
          ranking.map((pilot) => (
            <RankRow
              href={`/pilotos/${pilot.pilotSlug}`}
              key={pilot.pilotId}
              meta={`${pilot.uf} · ${pilot.entries.length} baterias · ${season?.name ?? "temporada ativa"}`}
              name={pilot.pilotName}
              points={pilot.finalPoints}
              rank={pilot.rank}
            />
          ))
        ) : (
          <p className="muted">Nenhum piloto cadastrado.</p>
        )}
      </VzCard>
    </div>
  );
}
