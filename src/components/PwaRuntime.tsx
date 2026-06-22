"use client";

import { useEffect } from "react";

export function PwaRuntime() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Installability should not block normal browsing when registration fails.
    });
  }, []);

  return null;
}
