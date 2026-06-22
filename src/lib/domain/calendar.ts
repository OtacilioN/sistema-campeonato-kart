const DEFAULT_EVENT_DURATION_MINUTES = 120;
const EVENT_TIME_ZONE = "America/Fortaleza";

type CalendarBattery = {
  label: string;
  locationName: string;
  city: string;
  uf: string;
  scheduledAt: Date | null;
  season: {
    name: string;
  };
};

function googleDate(value: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}${values.month}${values.day}T${values.hour}${values.minute}${values.second}`;
}

export function googleCalendarBatteryUrl(battery: CalendarBattery) {
  if (!battery.scheduledAt) return null;

  const start = battery.scheduledAt;
  const end = new Date(start.getTime() + DEFAULT_EVENT_DURATION_MINUTES * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${battery.season.name} - ${battery.label}`,
    dates: `${googleDate(start)}/${googleDate(end)}`,
    details: `Bateria do campeonato Velocidade Quase Maxima. Consulte resultados e informacoes no app.`,
    location: `${battery.locationName}, ${battery.city} - ${battery.uf}`,
    ctz: EVENT_TIME_ZONE,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
