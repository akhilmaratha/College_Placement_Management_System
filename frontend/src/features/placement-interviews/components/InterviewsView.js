"use client";
import { useCallback, useEffect, useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import PlacementOfficerShell from "@/components/layout/PlacementOfficerShell";
import PlacementUnavailableState from "@/components/placement/PlacementUnavailableState";
import { fetchPlacementInterviews } from "@/services/placementInterviewsService";

export default function InterviewsView() {
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); try { await fetchPlacementInterviews(); } catch (err) { setError(err?.message ?? "Unable to load interviews."); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);
  return <PlacementOfficerShell title="Interviews" breadcrumb="Placement / Interviews" actions={<button type="button" disabled className="inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-3 py-2 text-sm font-semibold text-white opacity-50"><Plus className="h-4 w-4" aria-hidden="true" />Schedule interview</button>}><div className="mx-auto flex w-full max-w-6xl flex-col gap-6"><div><h2 className="text-2xl font-semibold tracking-tight">Interviews</h2><p className="mt-1 text-sm text-secondary-text sm:text-base">Review upcoming and completed interview rounds by candidate, company, date, mode, and status.</p></div>{loading ? <div className="h-40 animate-pulse rounded-[12px] border border-border bg-card" aria-label="Loading interviews" /> : null}{!loading && error ? <PlacementUnavailableState title="Interviews unavailable" message={error} onRetry={load} /> : null}<div className="rounded-[12px] border border-border bg-card p-5 text-sm text-secondary-text shadow-sm"><CalendarClock className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />Search, date/status filters, scheduling, and updates will be enabled when the interview API is available.</div></div></PlacementOfficerShell>;
}
