"use client";

import { useActionState, useRef } from "react";
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

export function LapToLapUploadForm({ resultId, returnTo }: LapToLapUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useActionState(uploadLapToLapAction, initialState);

  return (
    <form action={formAction} className="upload-form" encType="multipart/form-data" ref={formRef}>
      <input name="resultId" type="hidden" value={resultId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input
        accept="application/pdf"
        className="sr-only-file"
        name="file"
        onChange={(event) => {
          if (!event.currentTarget.files?.length) return;
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
      {state.status === "error" ? (
        <p className="lap-upload-message" role="alert">{state.message}</p>
      ) : null}
    </form>
  );
}
