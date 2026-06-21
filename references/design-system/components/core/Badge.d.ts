import * as React from "react";

export interface BadgeProps {
  /** Maps to the feedback system. Always pair with an icon + text, never color alone. */
  tone?: "success" | "warning" | "danger" | "info" | "neutral" | "brand" | "dark";
  icon?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Small uppercase status badge. */
export function Badge(props: BadgeProps): JSX.Element;
