import { Upload } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { uploadLapToLapAction } from "@/app/actions";
import { LapCharts } from "@/components/LapCharts";
import { Avatar, CheckeredFlag, VzButton, VzCard, VzIcon } from "@/components/VelozesUI";
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
    <div className="vz-page tight">
      <button className="race-switcher" type="button">
        <CheckeredFlag />
        <span>Trocar de corrida</span>
        <VzIcon name="chevron-down" />
      </button>

      <VzCard>
        <div className="race-summary">
          <Avatar size={48} />
          <div>
            <h1>{battery.label}</h1>
            <span>
              <small>Status</small>
              <b>{batteryStatusLabel(battery.status)}</b>
            </span>
          </div>
          <div>
            <small>Temporada</small>
            <b>{battery.season.name}</b>
          </div>
        </div>
      </VzCard>

      <div className="stat-tiles race-stats">
        <div className="stat-tile">
          <span>Data</span>
          <VzIcon name="clock" size={18} />
          <strong>{formatDateTime(battery.scheduledAt)}</strong>
        </div>
        <div className="stat-tile">
          <span>Categoria</span>
          <VzIcon name="flag" size={18} />
          <strong>{battery.category ?? "Rental"}</strong>
        </div>
        <div className="stat-tile">
          <span>Pilotos</span>
          <VzIcon name="users" size={18} />
          <strong>{battery.results.length}</strong>
        </div>
      </div>

      {battery.status !== "CONFIRMED" ? (
        <VzCard>
          <h2 style={{ fontSize: 20, textTransform: "none" }}>Resultado em preparação</h2>
          <p className="muted">Resultados públicos aparecem somente depois da confirmação administrativa.</p>
        </VzCard>
      ) : null}

      {battery.status === "CONFIRMED" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {battery.results.map((result) => (
            <VzCard key={result.id}>
              <div className="race-driver-strip">
                <Avatar size={48} />
                <div>
                  <Link href={`/pilotos/${result.pilot.slug}`}>
                    <h2>{result.pilot.displayName || result.pilot.fullName}</h2>
                  </Link>
                  <p>
                    #{result.pilotNumber ?? "—"} · {result.pilot.uf} · {resultStatusLabel(result.status)}
                    <span>{ordinal(result.position)}</span>
                  </p>
                </div>
                <div>
                  <small>Pontos</small>
                  <strong>{result.finalPoints}</strong>
                </div>
              </div>

              <div className="stat-tiles race-result-stats">
                <div className="stat-tile"><span>Melhor volta</span><VzIcon name="timer" size={16} /><strong>{result.bestLapTime ?? "—"}</strong></div>
                <div className="stat-tile"><span>Tempo total</span><VzIcon name="clock" size={16} /><strong>{result.totalTime ?? "—"}</strong></div>
                <div className="stat-tile"><span>Diferença p/ líder</span><VzIcon name="crown" size={16} /><strong>{result.gapToLeader ?? "—"}</strong></div>
                <div className="stat-tile"><span>Diferença p/ anterior</span><VzIcon name="user" size={16} /><strong>{result.gapToPrevious ?? "—"}</strong></div>
                <div className="stat-tile"><span>Última volta</span><VzIcon name="clock" size={16} /><strong>{result.lastLapTime ?? "—"}</strong></div>
                <div className="stat-tile"><span>Total de voltas</span><VzIcon name="flag" size={16} /><strong>{result.totalLaps ?? "—"}</strong></div>
              </div>

              {result.lapToLap ? (
                <div className="lap-section">
                  <h2 style={{ fontSize: 20, textTransform: "none" }}>Volta por volta</h2>
                  <LapCharts laps={result.lapToLap.laps} />
                </div>
              ) : (
                <form action={uploadLapToLapAction} className="upload-form" encType="multipart/form-data">
                  <input name="resultId" type="hidden" value={result.id} />
                  <input name="returnTo" type="hidden" value={returnTo} />
                  <input accept="application/pdf" className="input file" name="file" required type="file" />
                  <VzButton type="submit" variant="dark"><Upload size={18} /> Enviar lap-to-lap</VzButton>
                </form>
              )}
            </VzCard>
          ))}
        </div>
      ) : null}
    </div>
  );
}
