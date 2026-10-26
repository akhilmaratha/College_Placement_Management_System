"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarClock, ClipboardList, GraduationCap, Users } from "lucide-react";
import PlacementOfficerShell from "@/components/layout/PlacementOfficerShell";
import PlacementUnavailableState from "@/components/placement/PlacementUnavailableState";
import SummaryCard from "@/components/ui/SummaryCard";
import { fetchPlacementDashboard } from "@/services/placementDashboardService";

export default function PlacementOfficerDashboardView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); try { await fetchPlacementDashboard(); } catch (err) { setError(err?.message ?? "Unable to load placement dashboard data."); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);
  return <PlacementOfficerShell title="Overview" breadcrumb="Placement / Overview"><div className="mx-auto flex w-full max-w-6xl flex-col gap-6"><div><h2 className="text-2xl font-semibold tracking-tight">Placement overview</h2><p className="mt-1 text-sm text-secondary-text sm:text-base">Monitor students, drives, applications, interviews, and placement outcomes.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><SummaryCard label="Registered students" value="—" icon={Users} loading={loading} /><SummaryCard label="Active drives" value="—" icon={BriefcaseBusiness} loading={loading} /><SummaryCard label="Applications" value="—" icon={ClipboardList} loading={loading} /><SummaryCard label="Students placed" value="—" icon={GraduationCap} loading={loading} /><SummaryCard label="Upcoming interviews" value="—" icon={CalendarClock} loading={loading} /></div>{error ? <PlacementUnavailableState title="Dashboard data unavailable" message={error} onRetry={load} /> : null}<div className="grid gap-3 sm:grid-cols-3">{[['/placement-officer/students','Manage students','Review student profiles and eligibility'],['/placement-officer/drives','Placement drives','Review drive details and deadlines'],['/placement-officer/interviews','Interviews','Review scheduled interview rounds']].map(([href,label,description]) => <Link key={href} href={href} className="rounded-[12px] border border-border bg-card p-4 shadow-sm hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><p className="font-semibold">{label}</p><p className="mt-1 text-sm text-secondary-text">{description}</p></Link>)}</div></div></PlacementOfficerShell>;
}
