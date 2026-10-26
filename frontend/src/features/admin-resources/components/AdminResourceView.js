"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import AdminUnavailableState from "@/components/admin/AdminUnavailableState";
import { fetchAdminResource } from "@/services/adminResourcesService";

const RESOURCE_CONFIG = {
  jobs: {
    title: "Job Openings",
    heading: "Job openings",
    description: "Review jobs posted by recruiters, deadlines, status, and applicant activity.",
    emptyTitle: "No job openings yet",
    columns: ["Job title", "Company", "Location", "Type", "Deadline", "Status"],
    searchPlaceholder: "Search title or company",
  },
  drives: {
    title: "Placement Drives",
    heading: "Placement drives",
    description: "Review company drives, eligibility, deadlines, and publication status.",
    emptyTitle: "No placement drives yet",
    columns: ["Company", "Drive / job title", "Eligibility", "Deadline", "Status"],
    searchPlaceholder: "Search company or drive",
  },
  applications: {
    title: "Applications",
    heading: "Applications",
    description: "Review applications across the placement system and their current status.",
    emptyTitle: "No applications yet",
    columns: ["Student", "Job", "Company", "Applied on", "Status"],
    searchPlaceholder: "Search student, job, or company",
  },
  interviews: {
    title: "Interviews",
    heading: "Interviews",
    description: "Review scheduled and completed interviews by candidate, company, and status.",
    emptyTitle: "No interviews scheduled",
    columns: ["Student", "Company", "Job", "Date / time", "Mode", "Status"],
    searchPlaceholder: "Search student, company, or job",
  },
};

function LoadingTable({ columnCount }) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-card shadow-sm" aria-label="Loading">
      <div className="grid gap-4 border-b border-border px-5 py-4" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
        {Array.from({ length: columnCount }).map((_, index) => <div key={index} className="h-3 animate-pulse rounded bg-border" />)}
      </div>
      {[1, 2, 3].map((row) => <div key={row} className="grid gap-4 border-b border-border px-5 py-5 last:border-0" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>{Array.from({ length: columnCount }).map((_, index) => <div key={index} className="h-4 animate-pulse rounded bg-background" />)}</div>)}
    </div>
  );
}

export default function AdminResourceView({ resource }) {
  const config = RESOURCE_CONFIG[resource];
  const searchId = useId();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await fetchAdminResource(resource);
    } catch (err) {
      setError(err?.message ?? `Unable to load ${config.heading.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [config.heading, resource]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const trimmedSearch = useMemo(() => search.trim(), [search]);

  return (
    <AdminShell title={config.title} breadcrumb={`Admin / ${config.title}`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{config.heading}</h2>
          <p className="mt-1 text-sm text-secondary-text sm:text-base">{config.description}</p>
        </div>

        <section className="rounded-[12px] border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label htmlFor={searchId} className="block flex-1 text-sm">
              <span className="mb-1.5 block font-medium">Search</span>
              <span className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" aria-hidden="true" />
                <input id={searchId} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={config.searchPlaceholder} className="w-full rounded-[10px] border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30" />
              </span>
            </label>
            <button type="button" disabled className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border px-4 py-2.5 text-sm font-semibold text-secondary-text opacity-60"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />Filters unavailable</button>
          </div>
          {trimmedSearch ? <p className="mt-3 text-xs text-secondary-text">Search will apply when the corresponding admin endpoint is available.</p> : null}
        </section>

        {loading ? <LoadingTable columnCount={config.columns.length} /> : null}
        {!loading && error ? <AdminUnavailableState title={`${config.title} unavailable`} message={error} onRetry={load} /> : null}
      </div>
    </AdminShell>
  );
}
