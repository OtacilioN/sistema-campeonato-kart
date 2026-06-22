import { BarChart3, Clock, Flag, Upload } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { uploadLapToLapAction } from "@/app/actions";
import { LapCharts } from "@/components/LapCharts";
import { PageHeader } from "@/components/PageHeader";
import { batteryPathSlug, ordinal, resultStatusLabel } from "@/lib/domain/labels";
import { getPilotProfile, getPublicRanking } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type PilotPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PilotPage({ params }: PilotPageProps) {
  const { slug } = await params;
  const [pilot, rankingData] = await Promise.all([getPilotProfile(slug), getPublicRanking()]);
  if (!pilot) notFound();

  const rankingRow = rankingData.ranking.find((row) => row.pilotId === pilot.id);
  const confirmedResults = pilot.results.filter((result) => result.battery.status === "CONFIRMED");

  return (
    <div className="grid">
      <PageHeader
        eyebrow={rankingData.season?.name ?? "Histórico do piloto"}
        title={pilot.displayName || pilot.fullName}
        description={`${pilot.uf} · Perfil público com resultados confirmados e lap-to-lap validado.`}
      />

      <section className="card">
        <div className="profile-strip">
          <div className="avatar">{pilot.uf}</div>
          <div>
            <h2>{pilot.displayName || pilot.fullName}</h2>
            <p className="muted">{rankingRow ? `${rankingRow.rank}º no ranking ativo` : "Fora do ranking ativo"}</p>
          </div>
          <div className="profile-points">
            <strong>{rankingRow?.finalPoints ?? 0}</strong>
            <span>pts</span>
          </div>
        </div>
      </section>

      <section className="grid three">
        <article className="card compact-stat">
          <BarChart3 size={18} />
          <span>Pontos brutos</span>
          <strong>{rankingRow?.grossPoints ?? 0}</strong>
        </article>
        <article className="card compact-stat">
          <Flag size={18} />
          <span>Baterias</span>
          <strong>{rankingRow?.entries.length ?? confirmedResults.length}</strong>
        </article>
        <article className="card compact-stat">
          <Clock size={18} />
          <span>Vitórias</span>
          <strong>{rankingRow?.wins ?? 0}</strong>
        </article>
      </section>

      <section className="card">
        <h2>Suas corridas</h2>
        <div className="spacer small" />
        {confirmedResults.length ? (
          <div className="race-list">
            {confirmedResults.map((result) => {
              const returnTo = `/pilotos/${pilot.slug}`;
              const batteryHref = `/temporadas/${result.battery.season.slug}/baterias/${batteryPathSlug(result.battery.number)}`;

              return (
                <article className="race-item" key={result.id}>
                  <Link className="row embedded" href={batteryHref}>
                    <span className="pos">{ordinal(result.position)}</span>
                    <div>
                      <strong>{result.battery.label}</strong>
                      <p className="meta">
                        {result.battery.season.name} · {resultStatusLabel(result.status)} · {result.finalPoints} pts
                      </p>
                    </div>
                    <span className="score">{result.bestLapTime ?? "—"}</span>
                  </Link>

                  {result.lapToLap ? (
                    <div className="lap-section">
                      <span className="pill">Lap-to-lap validado</span>
                      <LapCharts laps={result.lapToLap.laps} />
                    </div>
                  ) : (
                    <form className="upload-form" action={uploadLapToLapAction} encType="multipart/form-data">
                      <input type="hidden" name="resultId" value={result.id} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <input className="input file" name="file" type="file" accept="application/pdf" required />
                      <button className="button secondary" type="submit">
                        <Upload size={18} /> Enviar lap-to-lap
                      </button>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="muted">Nenhuma corrida confirmada para este piloto.</p>
        )}
      </section>
    </div>
  );
}
