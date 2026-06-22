"use client";

import { useFormStatus } from "react-dom";

type PendingSubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  pendingLabel: string;
};

export function PendingSubmitButton({
  children,
  className = "button",
  disabled = false,
  pendingLabel,
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className={className} disabled={disabled || pending} type="submit">
      {pending ? (
        <>
          <span aria-hidden="true" className="loading-dot" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
