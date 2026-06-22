"use client";

import { useRef, useState } from "react";
import { VzIcon } from "@/components/VelozesUI";

type HiddenField = {
  name: string;
  value: string;
};

type AutoFileUploadFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  accept?: string;
  buttonLabel: string;
  className?: string;
  fileFieldName?: string;
  hiddenFields?: HiddenField[];
  pendingLabel?: string;
  variant?: "primary" | "dark" | "secondary";
};

export function AutoFileUploadForm({
  action,
  accept = "application/pdf",
  buttonLabel,
  className = "compact-upload",
  fileFieldName = "file",
  hiddenFields = [],
  pendingLabel = "Importando...",
  variant = "primary",
}: AutoFileUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form action={action} className={className} encType="multipart/form-data" ref={formRef}>
      {hiddenFields.map((field) => (
        <input key={field.name} name={field.name} type="hidden" value={field.value} />
      ))}
      <input
        accept={accept}
        className="sr-only-file"
        name={fileFieldName}
        onChange={(event) => {
          if (!event.currentTarget.files?.length) return;
          setIsSubmitting(true);
          formRef.current?.requestSubmit();
        }}
        ref={inputRef}
        required
        type="file"
      />
      <button
        className={`vz-button ${variant}`}
        disabled={isSubmitting}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <VzIcon className={isSubmitting ? "spin" : undefined} name={isSubmitting ? "clock" : "upload-cloud"} size={18} />
        {isSubmitting ? pendingLabel : buttonLabel}
      </button>
    </form>
  );
}
