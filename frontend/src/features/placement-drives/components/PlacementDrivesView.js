"use client";
import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PlacementOfficerShell from "@/components/layout/PlacementOfficerShell";
import PlacementUnavailableState from "@/components/placement/PlacementUnavailableState";
import { fetchPlacementDrives } from "@/services/placementDrivesService";

export default function PlacementDrivesView() {
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); try { await fetchPlacementDrives(); } catch (err) { setError(err?.message ?? "Unable to load placement drives."); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);
  return <PlacementOfficerShell title="Placement Drives" breadcrumb="Placement / Drives" actions={<button type="button" disabled className="inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-3 py-2 text-sm font-semibold text-white opacity-50"><Plus className="h-4 w-4" aria-hidden="true" />Create drive</button>}><div className="mx-auto flex w-full max-w-6xl flex-col gap-6"><div><h2 className="text-2xl font-semibold tracking-tight">Placement drives</h2><p className="mt-1 text-sm text-secondary-text sm:text-base">Review companies, job details, eligibility criteria, deadlines, and drive status.</p></div>{loading ? <div className="h-40 animate-pulse rounded-[12px] border border-border bg-card" aria-label="Loading placement drives" /> : null}{!loading && error ? <PlacementUnavailableState title="Placement drives unavailable" message={error} onRetry={load} /> : null}<p className="text-sm text-secondary-text">Create, publish, edit, and close actions remain disabled until corresponding authorized backend endpoints are implemented.</p></div></PlacementOfficerShell>;
}
