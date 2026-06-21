import * as React from "react";

/**
 * Ranking / podium list row.
 * @startingPoint section="Data" subtitle="Ranking row — position, driver, points" viewport="700x150"
 */
export interface RankRowProps {
  position: number;
  name: string;
  /** Secondary line — UF, etapa, etc. */
  meta?: string;
  points?: string | number;
  pointsUnit?: string;
  avatar?: React.ReactNode;
  /** Color top-3 position badges (red / black / graphite). */
  podium?: boolean;
  /** Trailing node, e.g. a chevron. */
  trailing?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function RankRow(props: RankRowProps): JSX.Element;
