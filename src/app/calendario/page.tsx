import Link from "next/link";
import { DateBlock, SectionHead, VzBadge, VzCard, VzChip, VzIcon } from "@/components/VelozesUI";
import { batteryPathSlug, batteryStatusLabel } from "@/lib/domain/labels";
import { formatDateTime } from "@/lib/domain/time";
import { getActiveSeason } from "@/lib/data/public";

export const dynamic = "force-dynamic";

function dateParts(value: Date | null | undefined) {
  if (!value) return { day: "--", mon: "SEM", dow: "DATA" };
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(value);
  const mon = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(value).replace(".", "").toUpperCase();
  const dow = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(value).replace(".", "").toUpperCase();
  return { day, mon, dow };
}

export default async function CalendarioPage() {
  const season = await getActiveSeason();
  const batteries = season?.batteries ?? [];
  const upcoming = batteries.filter((battery) => battery.status !== "CONFIRMED" && battery.status !== "CANCELED");
  const confirmed = batteries.filter((battery) => battery.status === "CONFIRMED");
  const nextId = upcoming[0]?.id ?? batteries.find((battery) => battery.status !== "CANCELED")?.id;

  return (
    <div className="vz-page tight calendar-page">
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <VzChip active>Próximos</VzChip>
        <VzChip>Anteriores</VzChip>
      </div>

      <SectionHead
        icon="calendar"
        sub="Acompanhe os principais eventos e planeje sua temporada."
        title={confirmed.length ? "Eventos da temporada" : "Próximos eventos"}
      />

      {batteries.length ? (
        <div className="calendar-list">
          {batteries.map((battery) => {
            const date = dateParts(battery.scheduledAt);
            const href = `/temporadas/${season?.slug}/baterias/${batteryPathSlug(battery.number)}`;

            return (
              <Link href={href} key={battery.id}>
                <VzCard className={battery.id === nextId ? "next-event-card" : ""}>
                  <div className="event-card">
                    <DateBlock day={date.day} dow={date.dow} mon={date.mon} />
                    <div className="event-body">
                      {battery.id === nextId ? (
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
                    <div className="track-thumb">
                      <svg height="48" viewBox="0 0 110 110" width="48">
                        <path d="M20 68 C16 45 31 22 55 19 C82 15 97 36 89 58 C83 75 64 89 43 86 C30 84 22 78 20 68 Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
                      </svg>
                    </div>
                  </div>
                </VzCard>
              </Link>
            );
          })}
        </div>
      ) : (
        <VzCard>
          <SectionHead icon="calendar-clock" sub="Crie a temporada ativa e cadastre as baterias no admin para iniciar o calendário público." title="Nenhuma bateria cadastrada" />
        </VzCard>
      )}

      <VzCard>
        <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
          <span className="icon-tile muted"><VzIcon name="calendar-clock" /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Ver eventos anteriores</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Consulte o calendário completo de eventos já realizados.</div>
          </div>
          <VzIcon name="chevron-right" />
        </div>
      </VzCard>

      <div style={{ alignItems: "center", color: "var(--text-muted)", display: "flex", fontSize: 12, gap: 6, justifyContent: "center" }}>
        <VzIcon name="info" size={14} /> Datas e locais sujeitos a alteração.
      </div>
    </div>
  );
}
