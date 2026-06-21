import * as React from "react";

/**
 * Labeled metric tile used in profile / race-detail stat grids.
 * @startingPoint section="Data" subtitle="Metric tile — label, icon, big tabular value" viewport="700x150"
 */
export interface StatTileProps {
  /** Top label, e.g. "Melhor volta". */
  label: string;
  value: string | number;
  unit?: string;
  /** Small line icon shown top-right. */
  icon?: React.ReactNode;
  /** Caption below the value, e.g. "8ª etapa". */
  sub?: string;
  valueTone?: "primary" | "brand" | "positive" | "negative" | "muted";
  valueSize?: "l" | "m" | "s";
  style?: React.CSSProperties;
}

export function StatTile(props: StatTileProps): JSX.Element;
