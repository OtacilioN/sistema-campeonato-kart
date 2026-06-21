import * as React from "react";

export interface ChipProps {
  active?: boolean;
  /** Active fill color: default=black, brand=red. */
  tone?: "default" | "brand";
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Pill filter chip / segment. */
export function Chip(props: ChipProps): JSX.Element;
