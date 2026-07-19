"use client";

import { useActionState, useRef, useState } from "react";
import { uploadLapToLapAction, type LapToLapUploadState } from "@/app/actions";
import { VzIcon } from "@/components/VelozesUI";

type LapToLapUploadFormProps = {
  resultId: string;
  returnTo: string;
};

const initialState: LapToLapUploadState = {
  status: "idle",
  message: "",
};

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;

export function LapToLapUploadForm({ resultId, returnTo }: LapToLapUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [clientError, setClientError] = useState("");
  const [state, formAction, isPending] = useActionState(uploadLapToLapAction, initialState);
  const errorMessage = clientError || (!isPending && state.status === "error" ? state.message : "");

  return (
    <form action={formAction} className="upload-form" encType="multipart/form-data" ref={formRef}>
      <input name="resultId" type="hidden" value={resultId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input
        accept="application/pdf"
        className="sr-only-file"
        name="file"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (!file) return;
          if (file.size > MAX_FILE_SIZE_BYTES) {
            setClientError("O PDF deve ter no máximo 3 MB.");
            event.currentTarget.value = "";
            return;
          }
          setClientError("");
          formRef.current?.requestSubmit();
        }}
        ref={inputRef}
        required
        type="file"
      />
      <button
        className="vz-button dark"
        disabled={isPending}
        onClick={() => {
          if (inputRef.current) inputRef.current.value = "";
          inputRef.current?.click();
        }}
        type="button"
      >
        <VzIcon className={isPending ? "spin" : undefined} name={isPending ? "clock" : "upload-cloud"} size={18} />
        {isPending ? "Enviando lap-to-lap..." : "Enviar lap-to-lap"}
      </button>
      {errorMessage ? (
        <p className="lap-upload-message" role="alert">{errorMessage}</p>
      ) : null}
    </form>
  );
}
