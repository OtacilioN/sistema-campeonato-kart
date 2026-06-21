import * as React from "react";

/**
 * Base white surface card.
 * @startingPoint section="Core" subtitle="White surface container — 16px radius, soft shadow" viewport="700x200"
 */
export interface CardProps {
  /** Inner padding — defaults to 16px card padding. */
  padding?: string | number;
  /** Adds hover lift + pointer for tappable cards. */
  interactive?: boolean;
  /** Use the floating shadow at rest (dropdowns, sheets). */
  elevated?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
