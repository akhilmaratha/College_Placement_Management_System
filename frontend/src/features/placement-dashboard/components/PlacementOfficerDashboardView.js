"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BriefcaseBusiness, Building2, CalendarClock, ClipboardList, GraduationCap, Users } from "lucide-react";
import PlacementOfficerShell from "@/components/layout/PlacementOfficerShell";
import PlacementUnavailableState from "@/components/placement/PlacementUnavailableState";
import SummaryCard from "@/components/ui/SummaryCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { fetchPlacementDashboard } from "@/services/placementDashboardService";

const formatDate = (value) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", ...(String(value).includes("T") ? { timeStyle: "short" } : {}) }).format(new Date(value)) : "—";
const count = (value, error) => value ?? (error ? "—" : 0);

export default function PlacementOfficerDashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setData(await fetchPlacementDashboard()); }
    catch (e) { setError(e?.message ?? "Unable to load placement dashboard data."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);
  const s = data?.summary;
  return <PlacementOfficerShell title="Overview" breadcrumb="Placement / Overview"><main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
    <div><h2 className="text-2xl font-semibold">Placement overview</h2><p className="mt-1 text-sm text-secondary-text">Monitor student, company, drive, application, and interview activity.</p></div>
    {error ? <PlacementUnavailableState title="Dashboard data unavailable" message={error} onRetry={load} /> : null}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryCard label="Registered students" value={count(s?.totalStudents,error)} icon={Users} loading={loading}/><SummaryCard label="Companies" value={count(s?.totalCompanies,error)} icon={Building2} loading={loading}/><SummaryCard label="Active jobs" value={count(s?.activeJobs,error)} icon={BriefcaseBusiness} loading={loading}/><SummaryCard label="Active drives" value={count(s?.activeDrives,error)} icon={CalendarClock} loading={loading}/><SummaryCard label="Applications" value={count(s?.totalApplications,error)} icon={ClipboardList} loading={loading}/><SummaryCard label="Selected applications" value={count(s?.selectedApplications,error)} icon={GraduationCap} loading={loading}/>
    </div>
    {loading ? <p role="status" className="text-sm text-secondary-text">Loading placement activity…</p> : data ? <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-card"><header className="flex items-center justify-between border-b border-border p-4"><h3 className="font-semibold">Recent applications</h3><Link href="/placement-officer/students" className="text-sm text-primary hover:underline">View students</Link></header>{data.recentApplications?.length ? <ul className="divide-y divide-border">{data.recentApplications.map(a=><li key={a.id} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="truncate font-medium">{a.studentName} · {a.jobTitle}</p><p className="text-sm text-secondary-text">{a.companyName} · {formatDate(a.appliedAt)}</p></div><StatusBadge status={a.status}/></li>)}</ul> : <p className="p-8 text-center text-sm text-secondary-text">No applications yet.</p>}</section>
      <section className="rounded-xl border border-border bg-card"><header className="flex items-center justify-between border-b border-border p-4"><h3 className="font-semibold">Upcoming drives</h3><Link href="/placement-officer/drives" className="text-sm text-primary hover:underline">Manage drives</Link></header>{data.upcomingDrives?.length ? <ul className="divide-y divide-border">{data.upcomingDrives.map(d=><li key={d.id} className="flex items-center justify-between gap-3 p-4"><div><p className="font-medium">{d.title}</p><p className="text-sm text-secondary-text">{formatDate(d.startDate)} – {formatDate(d.endDate)}</p></div><StatusBadge status={d.status}/></li>)}</ul> : <p className="p-8 text-center text-sm text-secondary-text">No planned drives.</p>}</section>
      <section className="rounded-xl border border-border bg-card"><header className="flex items-center justify-between border-b border-border p-4"><h3 className="font-semibold">Upcoming interviews</h3><Link href="/placement-officer/interviews" className="text-sm text-primary hover:underline">Manage interviews</Link></header>{data.upcomingInterviews?.length ? <ul className="divide-y divide-border">{data.upcomingInterviews.map(i=><li key={i.id} className="p-4"><p className="font-medium">{i.studentName} · {i.jobTitle}</p><p className="text-sm text-secondary-text">{i.companyName} · {formatDate(i.scheduledAt)}</p></li>)}</ul> : <p className="p-8 text-center text-sm text-secondary-text">No upcoming interviews.</p>}</section>
    </div> : null}
    <nav className="grid gap-3 sm:grid-cols-3">{[['/placement-officer/students','Manage students'],['/placement-officer/drives','Placement drives'],['/placement-officer/interviews','Interviews']].map(([href,label])=><Link key={href} href={href} className="rounded-xl border border-border bg-card p-4 font-semibold hover:border-primary/40">{label}</Link>)}</nav>
  </main></PlacementOfficerShell>;
}
