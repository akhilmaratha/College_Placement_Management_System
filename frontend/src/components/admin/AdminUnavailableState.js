"use client";

import { RefreshCw } from "lucide-react";

export default function AdminUnavailableState({ title, message, onRetry }) {
  return (
    <section className="rounded-[12px] border border-border bg-card px-6 py-12 text-center shadow-sm">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-secondary-text">{message}</p>
      {onRetry ? <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><RefreshCw className="h-4 w-4" aria-hidden="true" />Try again</button> : null}
    </section>
  );
}
