import * as React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  help?: string;
  /** Error message — turns the field red. */
  error?: string;
  /** Warning message — turns the field amber. */
  warning?: string;
  /** Use mono tabular font for time fields (mm:ss.SSS) and numeric data. */
  mono?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/** Labeled form input with help/error/warning states. */
export function Input(props: InputProps): JSX.Element;
