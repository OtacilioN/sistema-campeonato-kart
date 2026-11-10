export function ordinal(value: number | null | undefined) {
  return value ? `${value}º` : "—";
}

export function batteryPathSlug(number: number) {
  return `${number}-bateria`;
}

export function shortBatteryMonthLabel(monthLabel: string | null | undefined, number: number) {
  const label = monthLabel?.trim();
  if (!label) return `B${number}`;

  const months: Record<string, string> = {
    janeiro: "Jan", fevereiro: "Fev", março: "Mar", abril: "Abr",
    maio: "Mai", junho: "Jun", julho: "Jul", agosto: "Ago",
    setembro: "Set", outubro: "Out", novembro: "Nov", dezembro: "Dez",
  };
  return label.replace(/^[\p{L}]+/u, (month) => months[month.toLocaleLowerCase("pt-BR")] ?? month);
}

export function batteryStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PLANNED: "Planejada",
    IN_REVIEW: "Em revisão",
    CONFIRMED: "Confirmada",
    CANCELED: "Cancelada",
  };
  return labels[status] ?? status;
}

export function resultStatusLabel(status: string) {
  const labels: Record<string, string> = {
    CLASSIFIED: "Classificado",
    NC: "NC",
    ABSENT: "Ausente",
  };
  return labels[status] ?? status;
}

export function reviewSourceLabel(source: string) {
  const labels: Record<string, string> = {
    OFFICIAL_PDF: "PDF oficial",
    MANUAL: "Manual",
  };
  return labels[source] ?? source;
}

export function reviewStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmada",
    REJECTED: "Rejeitada",
  };
  return labels[status] ?? status;
}
