export function parseBrazilianDateTime(value: string | null) {
  if (!value) return null;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;
  const [, day, month, year, hour, minute, second = "00"] = match;
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}-03:00`);
}

export function formatDateTime(value: Date | null | undefined) {
  if (!value) return "Data a definir";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function timeToSeconds(value: string | null | undefined) {
  if (!value) return null;
  const parts = value.split(":");
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return Number(minutes) * 60 + Number(seconds);
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  }
  return null;
}
