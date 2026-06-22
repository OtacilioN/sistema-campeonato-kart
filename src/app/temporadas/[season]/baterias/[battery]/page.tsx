import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteBatteryVideoAction, uploadBatteryVideoAction } from "@/app/actions";
import { LapCharts } from "@/components/LapCharts";
import { CheckeredFlag, SectionHead, VzButton, VzCard, VzIcon } from "@/components/VelozesUI";
import { batteryStatusLabel, ordinal, resultStatusLabel } from "@/lib/domain/labels";
import { formatDateTime } from "@/lib/domain/time";
import { parseYouTubeVideoLink } from "@/lib/domain/youtube";
import { getBatteryDetail } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type BatteryPageProps = {
  params: Promise<{
    season: string;
    battery: string;
  }>;
  searchParams?: Promise<{
    video?: string;
  }>;
};

export default async function BatteryPage({ params, searchParams }: BatteryPageProps) {
  const { season: seasonSlug, battery: batterySlug } = await params;
  const videoStatus = (await searchParams)?.video;
  const battery = await getBatteryDetail(seasonSlug, batterySlug);
  if (!battery) notFound();

  const batteryPath = `/temporadas/${seasonSlug}/baterias/${batterySlug}`;
  const canUploadVideo = Boolean(process.env.VIDEOMAKER_PASSWORD);

  return (
    <div className="vz-page tight battery-page">
      <Link className="race-switcher" href="/calendario">
        <CheckeredFlag />
        <span>Ver calendário</span>
        <VzIcon name="chevron-right" />
      </Link>

      <VzCard>
        <div className="race-summary">
          <CheckeredFlag size={32} />
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

      <VzCard className="battery-videos-card" id="videos">
        <SectionHead
          icon="circle-play"
          sub="Links do YouTube enviados pelos videomakers da bateria."
          title="Vídeos da corrida"
          right={canUploadVideo ? (
            <details className="video-upload-details">
              <summary className="vz-button secondary">
                <VzIcon name="upload-cloud" size={17} />
                Subir vídeo
              </summary>
              <form className="video-upload-form" action={uploadBatteryVideoAction}>
                <input type="hidden" name="batteryId" value={battery.id} />
                <input type="hidden" name="returnTo" value={batteryPath} />
                <label htmlFor="youtubeUrl">Link do YouTube</label>
                <input className="input" id="youtubeUrl" name="youtubeUrl" placeholder="https://youtu.be/..." required type="url" />
                <label htmlFor="videomakerPassword">Senha de videomaker</label>
                <input className="input" id="videomakerPassword" name="password" required type="password" />
                <VzButton type="submit">
                  <VzIcon name="video" size={17} />
                  Publicar vídeo
                </VzButton>
              </form>
            </details>
          ) : null}
        />

        {videoStatus ? <p className={`video-upload-message ${["enviado", "excluido"].includes(videoStatus) ? "success" : "error"}`}>{videoStatusLabel(videoStatus)}</p> : null}

        {battery.videos.length ? (
          <div className="battery-video-grid">
            {battery.videos.map((video, index) => {
              const parsedVideo = parseYouTubeVideoLink(video.youtubeUrl);
              if (!parsedVideo) return null;

              return (
                <article className="battery-video" key={video.id}>
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    src={parsedVideo.embedUrl}
                    title={`${battery.label} - vídeo ${index + 1}`}
                  />
                  <div className="battery-video-actions">
                    <a href={video.youtubeUrl} rel="noreferrer" target="_blank">
                      Abrir no YouTube
                      <VzIcon name="chevron-right" size={16} />
                    </a>
                    {canUploadVideo ? (
                      <details className="video-delete-details">
                        <summary className="video-delete-summary">
                          <VzIcon name="trash" size={14} />
                          Excluir
                        </summary>
                        <form className="video-delete-form" action={deleteBatteryVideoAction}>
                          <input type="hidden" name="videoId" value={video.id} />
                          <input type="hidden" name="returnTo" value={batteryPath} />
                          <label htmlFor={`deletePassword-${video.id}`}>Senha de videomaker</label>
                          <input className="input" id={`deletePassword-${video.id}`} name="password" required type="password" />
                          <VzButton type="submit" variant="danger">
                            <VzIcon name="trash" size={16} />
                            Confirmar exclusão
                          </VzButton>
                        </form>
                      </details>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="muted">Nenhum vídeo enviado para esta bateria ainda.</p>
        )}
      </VzCard>

      {battery.status === "CONFIRMED" ? (
        <div className="battery-results-list" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {battery.results.map((result) => (
            <VzCard key={result.id}>
              <div className="race-driver-strip">
                <div className="race-driver-main">
                  <Link href={`/pilotos/${result.pilot.slug}`}>
                    <h2>{result.pilot.displayName || result.pilot.fullName}</h2>
                  </Link>
                  <p>
                    #{result.pilotNumber ?? "—"} · {result.pilot.uf ?? "UF não informada"} · {resultStatusLabel(result.status)}
                    <span>{ordinal(result.position)}</span>
                  </p>
                </div>
                <div className="race-driver-score">
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
              ) : null}
            </VzCard>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function videoStatusLabel(status: string) {
  const labels: Record<string, string> = {
    enviado: "Vídeo publicado na página da bateria.",
    excluido: "Vídeo excluído da página da bateria.",
    senha: "Senha de videomaker inválida.",
    link: "Envie apenas links de vídeos hospedados no YouTube.",
    erro: "Não foi possível publicar o vídeo. Revise os dados e tente novamente.",
  };

  return labels[status] ?? labels.erro;
}
