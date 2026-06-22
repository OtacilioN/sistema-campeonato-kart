import Link from "next/link";
import { notFound } from "next/navigation";
import { uploadLapToLapAction } from "@/app/actions";
import { AutoFileUploadForm } from "@/components/AutoFileUploadForm";
import { LapCharts } from "@/components/LapCharts";
import { PilotEvolutionChart } from "@/components/PilotEvolutionChart";
import { DateBlock, VzCard, VzIcon } from "@/components/VelozesUI";
import { batteryPathSlug, ordinal, resultStatusLabel } from "@/lib/domain/labels";
import { getPilotProfile, getPublicRanking } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type PilotPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function bestLap(results: NonNullable<Awaited<ReturnType<typeof getPilotProfile>>>["results"]) {
  const laps = results.map((result) => result.bestLapTime).filter(Boolean) as string[];
  return laps.sort()[0] ?? "--:--.---";
}

function positionPlace(value: number | null | undefined) {
  return value ? `${ordinal(value)} lugar` : ordinal(value);
}

function dateParts(value: Date | null | undefined) {
  if (!value) return { day: "--", mon: "SEM", dow: "" };
  return {
    day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(value),
    mon: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(value).replace(".", "").toUpperCase(),
    dow: "",
  };
}

export default async function PilotPage({ params }: PilotPageProps) {
  const { slug } = await params;
  const [pilot, rankingData] = await Promise.all([getPilotProfile(slug), getPublicRanking()]);
  if (!pilot) notFound();

  const rankingRow = rankingData.ranking.find((row) => row.pilotId === pilot.id);
  const confirmedResults = pilot.results.filter((result) => result.battery.status === "CONFIRMED");
  const bestRace = [...confirmedResults].sort((a, b) => (a.position ?? 999) - (b.position ?? 999))[0];

  return (
    <div className="vz-page tight profile-page">
      <VzCard>
        <div className="profile-identity">
          <div>
            <h1>{pilot.displayName || pilot.fullName}</h1>
            <span className="rank-badge">
              <VzIcon name="crown" size={13} /> {rankingRow ? `${rankingRow.rank}º colocado` : "Sem ranking ativo"}
            </span>
            <p>{rankingData.season?.name ?? "Histórico do piloto"}</p>
          </div>
          <div className="profile-total">
            <strong>{rankingRow?.finalPoints ?? 0}</strong>
            <span>pts</span>
            <small>Total de pontos</small>
          </div>
        </div>
      </VzCard>

      <div className="stat-tiles profile-stats">
        <div className="stat-tile">
          <span>Posição geral</span>
          <VzIcon name="bar-chart-3" size={18} />
          <strong>{rankingRow ? `${rankingRow.rank}º` : "—"}</strong>
          <small>{rankingData.ranking.length ? `de ${rankingData.ranking.length}` : "sem ranking"}</small>
        </div>
        <div className="stat-tile">
          <span>Melhor volta</span>
          <VzIcon name="timer" size={18} />
          <strong>{bestLap(confirmedResults)}</strong>
          <small>{bestRace?.battery.label ?? "—"}</small>
        </div>
        <div className="stat-tile">
          <span>Melhor corrida</span>
          <VzIcon name="flag" size={18} />
          <strong>{positionPlace(bestRace?.position)}</strong>
          <small>{bestRace?.battery.label ?? "—"}</small>
        </div>
      </div>

      <VzCard>
        <div className="card-title-row">
          <h2>Evolução no campeonato</h2>
          <span className="small-filter">Pontos por bateria</span>
        </div>
        <PilotEvolutionChart entries={rankingRow?.entries ?? []} />
      </VzCard>

      <VzCard>
        <h2 style={{ fontSize: 20, marginBottom: 8, textTransform: "none" }}>Suas corridas</h2>
        {confirmedResults.length ? (
          <div>
            {confirmedResults.map((result) => {
              const date = dateParts(result.battery.scheduledAt);
              const batteryHref = `/temporadas/${result.battery.season.slug}/baterias/${batteryPathSlug(result.battery.number)}`;

              return (
                <article className="profile-race" key={result.id}>
                  <Link className="profile-race-link" href={batteryHref}>
                    <DateBlock day={date.day} dow={date.dow} mon={date.mon} />
                    <span className="profile-race-main">
                      <strong>{result.battery.label}</strong>
                      <small>{result.battery.locationName} · {resultStatusLabel(result.status)}</small>
                    </span>
                    <span className="profile-race-score">
                      <strong>{ordinal(result.position)}</strong>
                      <small>{result.finalPoints} pts</small>
                    </span>
                    <VzIcon name="chevron-right" size={18} />
                  </Link>

                  {result.lapToLap ? (
                    <div className="lap-section">
                      <span className="vz-badge success">Lap-to-lap validado</span>
                      <LapCharts laps={result.lapToLap.laps} />
                    </div>
                  ) : (
                    <AutoFileUploadForm
                      action={uploadLapToLapAction}
                      buttonLabel="Enviar lap-to-lap"
                      className="upload-form"
                      hiddenFields={[
                        { name: "resultId", value: result.id },
                        { name: "returnTo", value: `/pilotos/${pilot.slug}` },
                      ]}
                      pendingLabel="Enviando lap-to-lap..."
                      variant="dark"
                    />
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="muted">Nenhuma corrida confirmada para este piloto.</p>
        )}
      </VzCard>

    </div>
  );
}
