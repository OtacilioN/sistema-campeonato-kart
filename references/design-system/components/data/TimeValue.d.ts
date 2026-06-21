import * as React from "react";

export interface TimeValueProps {
  /** The value — a time string "00:49.352", a number, or points. */
  value: string | number;
  /** Small muted unit, e.g. "pts", "km/h". */
  unit?: string;
  size?: "l" | "m" | "s";
  tone?: "primary" | "brand" | "positive" | "negative" | "muted";
  /** Prefix numeric value with explicit +/- sign (for deltas). */
  sign?: boolean;
  style?: React.CSSProperties;
}

/** Tabular monospace numeric display for times, points and deltas. */
export function TimeValue(props: TimeValueProps): JSX.Element;
