import * as React from "react";

/**
 * Core action button for Velozes.
 * @startingPoint section="Core" subtitle="Action button — primary, dark, secondary, danger, ghost" viewport="700x180"
 */
export interface ButtonProps {
  /** Visual hierarchy. primary=red action, dark=black emphasis/admin, secondary=white+border, danger=destructive, ghost=low-emphasis. */
  variant?: "primary" | "dark" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
