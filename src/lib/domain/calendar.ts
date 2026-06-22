const DEFAULT_EVENT_DURATION_MINUTES = 60;
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
  const values = {
    day: String(value.getUTCDate()).padStart(2, "0"),
    hour: String(value.getUTCHours()).padStart(2, "0"),
    minute: String(value.getUTCMinutes()).padStart(2, "0"),
    month: String(value.getUTCMonth() + 1).padStart(2, "0"),
    second: String(value.getUTCSeconds()).padStart(2, "0"),
    year: String(value.getUTCFullYear()),
  };

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
