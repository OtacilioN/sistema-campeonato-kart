import * as React from "react";

export interface IconButtonProps {
  variant?: "ghost" | "muted" | "outline" | "dark";
  /** Square px size (>=40 recommended; wrap in 44px target if smaller). */
  size?: number;
  /** Accessible label — required since there is no visible text. */
  label?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Icon-only square button. */
export function IconButton(props: IconButtonProps): JSX.Element;
