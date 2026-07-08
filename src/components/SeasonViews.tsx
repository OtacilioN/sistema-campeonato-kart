import Link from "next/link";
import { notFound } from "next/navigation";
import { POSITION_POINTS } from "@/lib/domain/scoring";
import { seasonRegulationFor } from "@/lib/domain/season-regulations";
import { uploadLapToLapAction } from "@/app/actions";
import { AutoFileUploadForm } from "@/components/AutoFileUploadForm";
import { LapCharts } from "@/components/LapCharts";
import { PilotEvolutionChart } from "@/components/PilotEvolutionChart";
import { PwaInstallButton } from "@/components/PwaInstallButton";
import {
  DateBlock,
  IconTile,
  RankRow,
  SectionHead,
  VzBadge,
  VzButton,
  VzCard,
  VzChip,
  VzIcon,
} from "@/components/VelozesUI";
import { batteryPathSlug, batteryStatusLabel, ordinal, resultStatusLabel } from "@/lib/domain/labels";
import { googleCalendarBatteryUrl } from "@/lib/domain/calendar";
import { formatDateTime } from "@/lib/domain/time";
import { getActiveSeason, getPilotProfile, getPublicRanking, getSeasonBySlug } from "@/lib/data/public";
import type { RankingRow } from "@/lib/domain/types";

type PublicSeason = NonNullable<Awaited<ReturnType<typeof getActiveSeason>>>;

function contextPath(seasonSlug: string | undefined, path: string) {
  if (!seasonSlug) return path;
  if (path === "/") return `/temporadas/${seasonSlug}`;
  return `/temporadas/${seasonSlug}${path}`;
}

function pilotPath(pilotSlug: string, seasonSlug?: string) {
  return seasonSlug ? `/temporadas/${seasonSlug}/pilotos/${pilotSlug}` : `/pilotos/${pilotSlug}`;
}

function batteryLabel(number: number) {
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun 1", "Jun 2"];
  return labels[number - 1] ?? `B${number}`;
}

function eventDate(value: Date | null | undefined) {
  if (!value) return "A definir";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(value).replace(".", "").toUpperCase();
}

function speedStats(season: PublicSeason | null) {
  const batteryAverages = season?.batteries
    .filter((battery) => battery.status === "CONFIRMED")
    .map((battery) => {
      const speeds = battery.results
        .map((result) => Number(result.averageSpeed ?? 0))
        .filter((speed) => Number.isFinite(speed) && speed > 0);

      if (!speeds.length) return null;
      return {
        label: battery.label,
        speed: speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length,
      };
    })
    .filter((item): item is { label: string; speed: number } => Boolean(item)) ?? [];

  const speeds = batteryAverages.map((item) => item.speed);
  if (!speeds.length) return { average: "0,0", batteryAverages };
  const avg = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
  return {
    average: avg.toLocaleString("pt-BR", { maximumFractionDigits: 1 }),
    batteryAverages,
  };
}

function speedSparkline(points: { speed: number }[]) {
  if (points.length < 2) return null;

  const width = 96;
  const height = 48;
  const padding = 6;
  const min = Math.min(...points.map((point) => point.speed));
  const max = Math.max(...points.map((point) => point.speed));
  const range = max - min || 1;
  const step = (width - padding * 2) / (points.length - 1);
  const coordinates = points.map((point, index) => {
    const x = padding + index * step;
    const y = height - padding - ((point.speed - min) / range) * (height - padding * 2);
    return { x, y };
  });
  const path = coordinates.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const last = coordinates.at(-1);

  return (
    <svg aria-hidden="true" height="48" viewBox={`0 0 ${width} ${height}`} width="96">
      <path d={path} fill="none" stroke="#E10600" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
      {last ? <circle cx={last.x} cy={last.y} fill="#E10600" r="3.2" /> : null}
    </svg>
  );
}

function timeUntilEvent(value: Date | null | undefined) {
  if (!value) return null;
  const remaining = value.getTime() - Date.now();
  if (remaining <= 0) return null;

  const minutesTotal = Math.floor(remaining / 60000);
  const days = Math.floor(minutesTotal / 1440);
  const hours = Math.floor((minutesTotal % 1440) / 60);
  const minutes = minutesTotal % 60;
  return [
    { label: "DIAS", value: days },
    { label: "HORAS", value: hours },
    { label: "MIN", value: minutes },
  ];
}

function rowsForBattery(ranking: RankingRow[], batteryNumber: number | null) {
  if (!batteryNumber) {
    return ranking.map((pilot) => ({ entry: null, pilot, rank: pilot.rank, points: pilot.finalPoints }));
  }

  const sorted = ranking
    .map((pilot) => ({ pilot, entry: pilot.entries.find((entry) => entry.batteryNumber === batteryNumber) ?? null }))
    .filter((row): row is { pilot: RankingRow; entry: RankingRow["entries"][number] } => Boolean(row.entry))
    .sort((a, b) => b.entry.finalPoints - a.entry.finalPoints || (a.entry.position ?? 999) - (b.entry.position ?? 999) || a.pilot.rank - b.pilot.rank)
    .map((row, index) => ({ ...row, simulatedRank: index + 1, points: row.entry.finalPoints }));
  let realRank = 0;

  return sorted.map((row) => {
    if (row.pilot.rankingStatus !== "COMPETING") {
      return { ...row, rank: row.simulatedRank };
    }

    realRank += 1;
    return { ...row, rank: realRank };
  });
}

function dateParts(value: Date | null | undefined) {
  if (!value) return { day: "--", mon: "SEM", dow: "DATA" };
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(value);
  const mon = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(value).replace(".", "").toUpperCase();
  const dow = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(value).replace(".", "").toUpperCase();
  return { day, mon, dow };
}

function profileDateParts(value: Date | null | undefined) {
  if (!value) return { day: "--", mon: "SEM", dow: "" };
  return {
    day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(value),
    mon: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(value).replace(".", "").toUpperCase(),
    dow: "",
  };
}

function bestLap(results: NonNullable<Awaited<ReturnType<typeof getPilotProfile>>>["results"]) {
  const laps = results.map((result) => result.bestLapTime).filter(Boolean) as string[];
  return laps.sort()[0] ?? "--:--.---";
}

function positionPlace(value: number | null | undefined) {
  return value ? `${ordinal(value)} lugar` : ordinal(value);
}

function officialRankingRows(ranking: RankingRow[]) {
  return ranking.filter((row) => row.rankingStatus === "COMPETING");
}

function rankingRowClass(pilot: RankingRow) {
  return `ranking-row ${pilot.rankingStatus !== "COMPETING" ? "muted-ranking-row" : ""}`;
}

function rankClassName(pilot: RankingRow, rank: number) {
  return `rank-pos ${rank <= 3 && pilot.rankingStatus === "COMPETING" ? `top-${rank}` : ""} ${pilot.rankingStatus !== "COMPETING" ? "simulated" : ""}`;
}

function rankingStatusBadge(pilot: RankingRow) {
  if (!pilot.rankingStatusLabel) return null;
  return (
    <VzBadge tone={pilot.rankingStatus === "DISQUALIFIED" ? "danger" : "warning"}>
      {pilot.rankingStatusLabel}
    </VzBadge>
  );
}

function rankingMeta(pilot: RankingRow) {
  const participationText = `${pilot.participations} participacao${pilot.participations === 1 ? "" : "es"}`;
  if (pilot.rankingStatus === "COMPETING") return participationText;
  return `${participationText} · posicao simulada`;
}

async function getSeasonForContext(seasonSlug?: string) {
  const season = seasonSlug ? await getSeasonBySlug(seasonSlug) : await getActiveSeason();
  if (seasonSlug && !season) notFound();
  return season;
}

export async function SeasonHomeView({ seasonSlug }: { seasonSlug?: string }) {
  const [season, rankingData] = await Promise.all([getSeasonForContext(seasonSlug), getPublicRanking(seasonSlug)]);
  const nextBattery = season?.batteries.find((battery) => battery.status !== "CONFIRMED" && battery.status !== "CANCELED");
  const podium = officialRankingRows(rankingData.ranking).slice(0, 5);
  const countdown = timeUntilEvent(nextBattery?.scheduledAt);
  const speeds = speedStats(season);
  const seasonLabel = season?.name ?? "Temporada";

  return (
    <div className="vz-page home-page">
      <VzCard>
        <div className="event-card" style={{ marginBottom: 14 }}>
          <IconTile name="calendar" />
          <div className="event-body">
            <div style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>Próximo evento</div>
            <div style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>
              {eventDate(nextBattery?.scheduledAt)}
            </div>
            <div style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600, marginTop: 2 }}>
              {nextBattery?.locationName ?? "Nenhum próximo evento cadastrado"}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              {nextBattery ? `${nextBattery.city}, ${nextBattery.uf}` : seasonLabel}
            </div>
          </div>
        </div>

        {countdown ? (
          <>
            <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>Falta para o evento</div>
            <div className="countdown-grid" style={{ marginBottom: 16 }}>
              {countdown.map((item) => (
                <div className="countdown-cell" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="muted" style={{ marginBottom: 16 }}>Nenhum próximo evento com data futura cadastrado.</p>
        )}

        <div className="home-actions">
          <VzButton href={contextPath(seasonSlug, "/calendario")}>Ver calendário</VzButton>
          {!seasonSlug ? <PwaInstallButton /> : null}
        </div>
      </VzCard>

      <VzCard>
        <div style={{ alignItems: "center", display: "flex", gap: 12, marginBottom: 6 }}>
          <IconTile name="trophy" />
          <h2 style={{ flex: 1, fontSize: 22, textTransform: "none" }}>{seasonSlug ? "Pódio da temporada" : "Pódio atual"}</h2>
          <span style={{ alignItems: "center", color: "var(--text-secondary)", display: "inline-flex", fontSize: 13, gap: 4 }}>
            {seasonLabel}
          </span>
        </div>

        {podium.length ? (
          <div>
            {podium.map((pilot) => (
              <RankRow
                href={pilotPath(pilot.pilotSlug, seasonSlug)}
                key={pilot.pilotId}
                meta={`bruto ${pilot.grossPoints} · descarte ${pilot.discardedPoints}`}
                name={(
                  <span className="podium-pilot-name">
                    <span>{pilot.pilotName}</span>
                    <em>{pilot.uf ?? "UF não informada"}</em>
                  </span>
                )}
                podium
                points={pilot.finalPoints}
                rank={pilot.rank}
              />
            ))}
          </div>
        ) : (
          <p className="muted">Ranking ainda não iniciado.</p>
        )}

        <div style={{ marginTop: 12 }}>
          <VzButton href={contextPath(seasonSlug, "/ranking")} variant="secondary">
            Ver ranking completo <VzIcon name="chevron-right" size={16} />
          </VzButton>
        </div>
      </VzCard>

      <VzCard>
        <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
          <IconTile name="gauge" size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Velocidade quase máxima</div>
            <div style={{ alignItems: "baseline", display: "flex", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700 }}>{speeds.average}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 14 }}>km/h</span>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Média da temporada</div>
          </div>
          {speeds.batteryAverages.length > 1 ? (
            <div style={{ background: "var(--brand-red-soft)", borderRadius: "var(--radius-md)", flex: "none", padding: "8px 6px" }}>
              {speedSparkline(speeds.batteryAverages)}
            </div>
          ) : null}
        </div>
      </VzCard>
    </div>
  );
}

export async function SeasonCalendarView({
  seasonSlug,
  searchParams,
}: {
  seasonSlug?: string;
  searchParams?: Promise<{ periodo?: string }>;
}) {
  const query = await searchParams;
  const season = await getSeasonForContext(seasonSlug);
  const batteries = season?.batteries ?? [];
  const upcoming = batteries.filter((battery) => battery.status !== "CONFIRMED" && battery.status !== "CANCELED");
  const confirmed = batteries.filter((battery) => battery.status === "CONFIRMED");
  const nextId = upcoming[0]?.id ?? null;
  const selectedPeriod = query?.periodo === "anteriores" || (seasonSlug && query?.periodo !== "proximos") ? "anteriores" : "proximos";
  const visibleBatteries = selectedPeriod === "anteriores" ? confirmed : upcoming;
  const calendarPath = contextPath(seasonSlug, "/calendario");

  return (
    <div className="vz-page tight calendar-page">
      <div style={{ display: "flex", gap: 10, justifyContent: "center", overflowX: "auto", paddingBottom: 2 }}>
        <VzChip active={selectedPeriod === "proximos"} href={calendarPath}>Próximos</VzChip>
        <VzChip active={selectedPeriod === "anteriores"} href={`${calendarPath}?periodo=anteriores`}>Anteriores</VzChip>
        {!seasonSlug ? <VzChip href="/temporadas">Temporadas</VzChip> : null}
      </div>

      <SectionHead
        icon="calendar"
        sub={season?.name ?? "Acompanhe os principais eventos e planeje sua temporada."}
        title={selectedPeriod === "anteriores" ? "Eventos anteriores" : "Próximos eventos"}
      />

      {visibleBatteries.length ? (
        <div className="calendar-list">
          {visibleBatteries.map((battery) => {
            const date = dateParts(battery.scheduledAt);
            const href = `/temporadas/${season?.slug}/baterias/${batteryPathSlug(battery.number)}`;
            const googleCalendarUrl = season ? googleCalendarBatteryUrl({ ...battery, season: { name: season.name } }) : null;

            return (
              <VzCard className={`calendar-event-card ${selectedPeriod === "proximos" && battery.id === nextId ? "next-event-card" : ""}`} key={battery.id}>
                <Link className="calendar-event-link" href={href}>
                  <div className="event-card">
                    <DateBlock day={date.day} dow={date.dow} mon={date.mon} />
                    <div className="event-body">
                      {selectedPeriod === "proximos" && battery.id === nextId ? (
                        <div style={{ marginBottom: 6 }}>
                          <VzBadge icon="star" tone="brand">Próximo evento</VzBadge>
                        </div>
                      ) : null}
                      <div className="event-title">{battery.label}</div>
                      <div className="event-meta">
                        <VzIcon name="map-pin" size={15} /> {battery.locationName}
                      </div>
                      <div className="event-submeta">{battery.city}, {battery.uf}</div>
                      <div className="event-meta">
                        <VzIcon name="clock" size={15} /> {battery.monthLabel ?? formatDateTime(battery.scheduledAt)} · {batteryStatusLabel(battery.status)}
                      </div>
                    </div>
                  </div>
                </Link>
                {googleCalendarUrl ? (
                  <a className="calendar-add-button" href={googleCalendarUrl} rel="noreferrer" target="_blank">
                    <VzIcon name="calendar-plus" size={17} />
                    Adicionar ao Google Calendar
                  </a>
                ) : null}
              </VzCard>
            );
          })}
        </div>
      ) : (
        <VzCard>
          <SectionHead
            icon="calendar-clock"
            sub={batteries.length ? "Use o outro filtro para ver os eventos disponíveis." : "Cadastre as baterias no admin para iniciar o calendário público."}
            title={selectedPeriod === "anteriores" ? "Nenhum evento anterior" : "Nenhum próximo evento"}
          />
        </VzCard>
      )}

      <div style={{ alignItems: "center", color: "var(--text-muted)", display: "flex", fontSize: 12, gap: 6, justifyContent: "center" }}>
        <VzIcon name="info" size={14} /> Datas e locais sujeitos a alteração.
      </div>
    </div>
  );
}

export async function SeasonRankingView({
  seasonSlug,
  searchParams,
}: {
  seasonSlug?: string;
  searchParams?: Promise<{ bateria?: string }>;
}) {
  const { season, ranking } = await getPublicRanking(seasonSlug);
  if (seasonSlug && !season) notFound();
  const query = await searchParams;
  const confirmedBatteries = season?.batteries.filter((battery) => battery.status === "CONFIRMED") ?? [];
  const regulation = seasonRegulationFor(season);
  const requestedBattery = Number(query?.bateria);
  const selectedBatteryNumber = confirmedBatteries.some((battery) => battery.number === requestedBattery) ? requestedBattery : null;
  const displayedRows = rowsForBattery(ranking, selectedBatteryNumber);
  const rankingPath = contextPath(seasonSlug, "/ranking");
  const showEligibilityNotice =
    regulation.minimumParticipations != null &&
    regulation.eligibilityStartsAfterConfirmedBatteries != null &&
    confirmedBatteries.length > regulation.eligibilityStartsAfterConfirmedBatteries;

  return (
    <div className="vz-page tight ranking-page">
      <SectionHead
        icon="trophy"
        sub={seasonSlug ? "Ranking compartilhável desta temporada." : "Acompanhe o desempenho dos pilotos na temporada."}
        title={season?.name ?? "Temporada ativa"}
      />

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {confirmedBatteries.map((battery) => (
          <VzChip active={selectedBatteryNumber === battery.number} href={`${rankingPath}?bateria=${battery.number}`} key={battery.id}>
            {battery.monthLabel ?? batteryLabel(battery.number)}
          </VzChip>
        ))}
        <VzChip active={!selectedBatteryNumber} href={rankingPath}>Geral</VzChip>
        {!seasonSlug ? <VzChip href="/temporadas">Temporadas</VzChip> : null}
      </div>

      <VzCard className="ranking-card">
        <div className="ranking-header">
          <span>Pos.</span>
          <span>Piloto</span>
          <span>{selectedBatteryNumber ? "Pontos na bateria" : "Total de pontos"}</span>
        </div>

        {displayedRows.length ? (
          displayedRows.map(({ entry, pilot, points, rank }) => (
            <a className={rankingRowClass(pilot)} href={pilotPath(pilot.pilotSlug, seasonSlug)} key={pilot.pilotId}>
              <span className={rankClassName(pilot, rank)}>{rank}</span>
              <span className="ranking-driver">
                <span>
                  <strong>{pilot.pilotName}</strong>
                  <em>{pilot.uf ?? "UF não informada"}</em>
                  {rankingStatusBadge(pilot)}
                </span>
                <span className="ranking-meta">{rankingMeta(pilot)}</span>
                <span className="ranking-months">
                  {(entry ? [entry] : pilot.entries).map((item) => (
                    <small className={item.discarded ? "discarded" : ""} key={`${pilot.pilotId}-${item.batteryNumber}`}>
                      {batteryLabel(item.batteryNumber)} <b>{item.finalPoints}</b>
                    </small>
                  ))}
                </span>
              </span>
              <span className="ranking-total">
                <strong>{points}</strong>
                <small>pts</small>
                <VzIcon name="chevron-right" size={16} />
              </span>
            </a>
          ))
        ) : (
          <p className="muted" style={{ padding: "18px 0" }}>Ranking ainda não iniciado.</p>
        )}
      </VzCard>

      {showEligibilityNotice ? (
        <VzCard className="ranking-rule-alert">
          <VzIcon name="info" size={22} />
          <div>
            <strong>Disputa oficial da temporada</strong>
            <p>
              Com mais de {regulation.eligibilityStartsAfterConfirmedBatteries} baterias concluidas, so ocupa posicao real quem tem pelo menos {regulation.minimumParticipations} participacoes.
              Os demais aparecem com posicao simulada e tag de nao competindo.
            </p>
          </div>
        </VzCard>
      ) : null}

      <VzCard>
        <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
          <VzIcon name="info" size={22} />
          <h2 style={{ flex: 1, fontSize: 20, textTransform: "none" }}>Como funciona a pontuação</h2>
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: 13, margin: "14px 0 12px" }}>
          A pontuação é definida com base na sua posição em cada corrida.
        </div>
        <div className="rule-mini-grid" style={{ marginBottom: 14 }}>
          {Array.from(POSITION_POINTS.entries()).slice(0, 6).map(([position, points]) => (
            <div className="rule-mini" key={position}>
              <span>{position}º lugar</span>
              <strong>{points} <small>pts</small></strong>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <VzBadge icon="check" tone="success">Pole +{regulation.poleBonus}</VzBadge>
          <VzBadge icon="check" tone="success">Melhor volta +{regulation.bestLapBonus}</VzBadge>
          <VzBadge tone="neutral">NC 0</VzBadge>
          <VzBadge tone="neutral">{regulation.countedBatteryCount} melhores de {regulation.expectedBatteryCount}</VzBadge>
        </div>
        <div style={{ alignItems: "flex-start", background: "var(--danger-soft)", borderRadius: "var(--radius-md)", display: "flex", gap: 10, padding: 12 }}>
          <VzIcon name="info" size={20} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Penalização</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>Faltas, conduta antidesportiva ou descumprimento de regras.</div>
          </div>
          <span style={{ color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700 }}>
            -{regulation.penaltyPresets.join("/")} <small>pts</small>
          </span>
        </div>
      </VzCard>
    </div>
  );
}

export async function SeasonRegulationView({ seasonSlug }: { seasonSlug?: string }) {
  const season = await getSeasonForContext(seasonSlug);
  const regulation = seasonRegulationFor(season);

  return (
    <div className="vz-page tight regulation-page">
      <SectionHead
        icon="file-text"
        sub={season?.name ?? "Temporada ativa"}
        title={regulation.title}
      />

      <VzCard className="regulation-hero">
        <div>
          <h2>{regulation.summary}</h2>
          <p>
            O ranking publico usa somente baterias confirmadas. Regras especificas desta temporada sao aplicadas apenas aos resultados novos ou revisados desta temporada.
          </p>
        </div>
        <div className="regulation-kpis">
          <span><strong>{regulation.expectedBatteryCount}</strong> baterias</span>
          <span><strong>{regulation.countedBatteryCount}</strong> melhores</span>
          <span><strong>+{regulation.poleBonus}</strong> pole</span>
          <span><strong>+{regulation.bestLapBonus}</strong> melhor volta</span>
        </div>
      </VzCard>

      <div className="regulation-section-grid">
        {regulation.sections.map((section) => (
          <VzCard className="regulation-section" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </VzCard>
        ))}
      </div>
    </div>
  );
}

export async function SeasonPilotsView({ seasonSlug }: { seasonSlug?: string }) {
  const { season, ranking } = await getPublicRanking(seasonSlug);
  if (seasonSlug && !season) notFound();

  return (
    <div className="vz-page tight pilots-page">
      <SectionHead
        icon="users"
        sub={`Lista pública de pilotos com resultado confirmado em ${season?.name ?? "temporada ativa"}.`}
        title="Pilotos"
      />

      <VzCard>
        {ranking.length ? (
          ranking.map((pilot) => (
            <RankRow
              href={pilotPath(pilot.pilotSlug, seasonSlug)}
              key={pilot.pilotId}
              meta={`${pilot.uf ?? "UF não informada"} · ${rankingMeta(pilot)} · ${season?.name ?? "temporada ativa"}`}
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

export async function SeasonPilotProfileView({ pilotSlug, seasonSlug }: { pilotSlug: string; seasonSlug?: string }) {
  const [pilot, rankingData] = await Promise.all([getPilotProfile(pilotSlug), getPublicRanking(seasonSlug)]);
  if (!pilot) notFound();
  if (seasonSlug && !rankingData.season) notFound();

  const rankingRow = rankingData.ranking.find((row) => row.pilotId === pilot.id);
  const officialRankingCount = officialRankingRows(rankingData.ranking).length;
  const profileRankLabel = rankingRow
    ? rankingRow.rankingStatus === "COMPETING"
      ? `${rankingRow.rank}º colocado`
      : `${rankingRow.simulatedRank}º simulado · ${rankingRow.rankingStatusLabel}`
    : "Sem ranking";
  const profilePositionLabel = rankingRow
    ? rankingRow.rankingStatus === "COMPETING"
      ? `${rankingRow.rank}º`
      : `${rankingRow.simulatedRank}º simulado`
    : "—";
  const confirmedResults = pilot.results.filter((result) => {
    if (result.battery.status !== "CONFIRMED") return false;
    return seasonSlug ? result.battery.season.slug === seasonSlug : true;
  });
  const bestRace = [...confirmedResults].sort((a, b) => (a.position ?? 999) - (b.position ?? 999))[0];
  const returnTo = pilotPath(pilot.slug, seasonSlug);

  return (
    <div className="vz-page tight profile-page">
      <VzCard>
        <div className="profile-identity">
          <div>
            <h1>{pilot.displayName || pilot.fullName}</h1>
            <span className="rank-badge">
              <VzIcon name="crown" size={13} /> {profileRankLabel}
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
          <strong>{profilePositionLabel}</strong>
          <small>{officialRankingCount ? `de ${officialRankingCount} oficiais` : "sem ranking oficial"}</small>
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
              const date = profileDateParts(result.battery.scheduledAt);
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
                        { name: "returnTo", value: returnTo },
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
          <p className="muted">Nenhuma corrida confirmada para este piloto nesta temporada.</p>
        )}
      </VzCard>
    </div>
  );
}
