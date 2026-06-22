import Link from "next/link";
import { notFound } from "next/navigation";
import { uploadLapToLapAction } from "@/app/actions";
import { AutoFileUploadForm } from "@/components/AutoFileUploadForm";
import { LapCharts } from "@/components/LapCharts";
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

function dateParts(value: Date | null | undefined) {
  if (!value) return { day: "--", mon: "SEM", dow: "" };
  return {
    day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(value),
    mon: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(value).replace(".", "").toUpperCase(),
    dow: "",
  };
}

function PilotEvolutionChart({
  entries,
}: {
  entries: { batteryNumber: number; finalPoints: number; discarded: boolean }[];
}) {
  const data = [...entries].sort((a, b) => a.batteryNumber - b.batteryNumber);
  if (!data.length) {
    return <p className="muted">Sem resultados confirmados para montar a evolução.</p>;
  }

  const width = 380;
  const height = 180;
  const paddingX = 34;
  const paddingY = 26;
  const maxPoints = Math.max(1, ...data.map((entry) => entry.finalPoints));
  const step = data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;
  const points = data.map((entry, index) => {
    const x = data.length > 1 ? paddingX + index * step : width / 2;
    const y = height - paddingY - (entry.finalPoints / maxPoints) * (height - paddingY * 2);
    return { ...entry, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");

  return (
    <svg aria-label="Pontos por bateria" className="evolution-chart" role="img" viewBox={`0 0 ${width} ${height}`}>
      {[0.25, 0.5, 0.75].map((ratio) => {
        const y = paddingY + (height - paddingY * 2) * ratio;
        return <line key={ratio} x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke="#E2E2E6" strokeDasharray="3 4" />;
      })}
      <path d={path} fill="none" stroke="#E10600" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" />
      {points.map((point) => (
        <g key={point.batteryNumber}>
          <circle cx={point.x} cy={point.y} fill={point.discarded ? "#f7f7f8" : "#fff"} r="4" stroke="#E10600" strokeWidth="2" />
          <text fill="#7a7a85" fontSize="10" textAnchor="middle" x={point.x} y={height - 6}>
            B{point.batteryNumber}
          </text>
        </g>
      ))}
    </svg>
  );
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
          <strong>{ordinal(bestRace?.position)}</strong>
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
