import Link from "next/link";
import { DateBlock, SectionHead, VzBadge, VzCard, VzChip, VzIcon } from "@/components/VelozesUI";
import { batteryPathSlug, batteryStatusLabel } from "@/lib/domain/labels";
import { formatDateTime } from "@/lib/domain/time";
import { getActiveSeason } from "@/lib/data/public";

export const dynamic = "force-dynamic";

type CalendarioPageProps = {
  searchParams?: Promise<{
    periodo?: string;
  }>;
};

function dateParts(value: Date | null | undefined) {
  if (!value) return { day: "--", mon: "SEM", dow: "DATA" };
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(value);
  const mon = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(value).replace(".", "").toUpperCase();
  const dow = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(value).replace(".", "").toUpperCase();
  return { day, mon, dow };
}

export default async function CalendarioPage({ searchParams }: CalendarioPageProps) {
  const query = await searchParams;
  const season = await getActiveSeason();
  const batteries = season?.batteries ?? [];
  const upcoming = batteries.filter((battery) => battery.status !== "CONFIRMED" && battery.status !== "CANCELED");
  const confirmed = batteries.filter((battery) => battery.status === "CONFIRMED");
  const nextId = upcoming[0]?.id ?? null;
  const selectedPeriod = query?.periodo === "anteriores" ? "anteriores" : "proximos";
  const visibleBatteries = selectedPeriod === "anteriores" ? confirmed : upcoming;

  return (
    <div className="vz-page tight calendar-page">
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <VzChip active={selectedPeriod === "proximos"} href="/calendario">Próximos</VzChip>
        <VzChip active={selectedPeriod === "anteriores"} href="/calendario?periodo=anteriores">Anteriores</VzChip>
      </div>

      <SectionHead
        icon="calendar"
        sub="Acompanhe os principais eventos e planeje sua temporada."
        title={selectedPeriod === "anteriores" ? "Eventos anteriores" : "Próximos eventos"}
      />

      {visibleBatteries.length ? (
        <div className="calendar-list">
          {visibleBatteries.map((battery) => {
            const date = dateParts(battery.scheduledAt);
            const href = `/temporadas/${season?.slug}/baterias/${batteryPathSlug(battery.number)}`;

            return (
              <Link href={href} key={battery.id}>
                <VzCard className={selectedPeriod === "proximos" && battery.id === nextId ? "next-event-card" : ""}>
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
                </VzCard>
              </Link>
            );
          })}
        </div>
      ) : (
        <VzCard>
          <SectionHead
            icon="calendar-clock"
            sub={batteries.length ? "Use o outro filtro para ver os eventos disponíveis." : "Crie a temporada ativa e cadastre as baterias no admin para iniciar o calendário público."}
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
