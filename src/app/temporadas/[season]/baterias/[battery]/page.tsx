import { Clock, Flag, Upload } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { uploadLapToLapAction } from "@/app/actions";
import { LapCharts } from "@/components/LapCharts";
import { PageHeader } from "@/components/PageHeader";
import { batteryPathSlug, batteryStatusLabel, ordinal, resultStatusLabel } from "@/lib/domain/labels";
import { formatDateTime } from "@/lib/domain/time";
import { getBatteryDetail } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type BatteryPageProps = {
  params: Promise<{
    season: string;
    battery: string;
  }>;
};

export default async function BatteryPage({ params }: BatteryPageProps) {
  const { season: seasonSlug, battery: batterySlug } = await params;
  const battery = await getBatteryDetail(seasonSlug, batterySlug);
  if (!battery) notFound();

  const returnTo = `/temporadas/${battery.season.slug}/baterias/${batteryPathSlug(battery.number)}`;

  return (
    <div className="grid">
      <PageHeader
        eyebrow={battery.season.name}
        title={battery.label}
        description={`${formatDateTime(battery.scheduledAt)} · ${battery.locationName} · ${battery.city}, ${battery.uf}`}
      />

      <section className="card">
        <div className="section-row">
          <div>
            <h2>Resultado oficial</h2>
            <p className="muted">{battery.category ?? "Rental"} · {battery.type ?? "Corrida"}</p>
          </div>
          <span className="pill">{batteryStatusLabel(battery.status)}</span>
        </div>
      </section>

      {battery.status !== "CONFIRMED" ? (
        <section className="card">
          <h2>Resultado em preparação</h2>
          <p className="muted">Resultados públicos aparecem somente depois da confirmação administrativa.</p>
        </section>
      ) : null}

      {battery.status === "CONFIRMED" && battery.results.length === 0 ? (
        <section className="card">
          <h2>Nenhum resultado confirmado</h2>
          <p className="muted">A bateria está confirmada, mas ainda não possui pilotos vinculados.</p>
        </section>
      ) : null}

      {battery.status === "CONFIRMED" ? (
        <section className="table">
          {battery.results.map((result) => (
            <article className="result-card" key={result.id}>
              <div className="row embedded">
                <span className="pos">{ordinal(result.position)}</span>
                <div>
                  <Link href={`/pilotos/${result.pilot.slug}`}>
                    <strong>{result.pilot.displayName || result.pilot.fullName}</strong>
                  </Link>
                  <p className="meta">
                    #{result.pilotNumber ?? "—"} · {result.pilot.uf} · {resultStatusLabel(result.status)} · {result.finalPoints} pts
                  </p>
                </div>
                <span className="score">{result.totalTime ?? "—"}</span>
              </div>

              <div className="stat-grid">
                <div className="mini-stat">
                  <Clock size={16} />
                  <span>TMV</span>
                  <strong>{result.bestLapTime ?? "—"}</strong>
                </div>
                <div className="mini-stat">
                  <Flag size={16} />
                  <span>Voltas</span>
                  <strong>{result.totalLaps ?? "—"}</strong>
                </div>
                <div className="mini-stat">
                  <span>Base</span>
                  <strong>{result.positionPoints}</strong>
                </div>
                <div className="mini-stat">
                  <span>Bônus</span>
                  <strong>{result.poleBonus + result.bestLapBonus}</strong>
                </div>
                <div className="mini-stat">
                  <span>Pen.</span>
                  <strong>{result.penaltyPoints}</strong>
                </div>
              </div>

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
          ))}
        </section>
      ) : null}
    </div>
  );
}
