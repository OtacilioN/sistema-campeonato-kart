export function ordinal(value: number | null | undefined) {
  return value ? `${value}º` : "—";
}

export function batteryPathSlug(number: number) {
  return `${number}-bateria`;
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
