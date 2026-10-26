"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BarChart3, Building2, CalendarDays, GraduationCap, Users } from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import AdminUnavailableState from "@/components/admin/AdminUnavailableState";
import SummaryCard from "@/components/ui/SummaryCard";
import { fetchAdminDashboard } from "@/services/adminDashboardService";

export default function AdminDashboardView() {
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); try { await fetchAdminDashboard(); } catch (err) { setError(err?.message ?? "Unable to load admin dashboard data."); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);
  return <AdminShell title="Admin Dashboard" breadcrumb="Admin / Overview"><div className="mx-auto flex w-full max-w-6xl flex-col gap-6"><div><h2 className="text-2xl font-semibold tracking-tight">Administration overview</h2><p className="mt-1 text-sm text-secondary-text sm:text-base">Monitor users, companies, placement activity, and reports.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><SummaryCard label="Total users" value="—" icon={Users} loading={loading}/><SummaryCard label="Students" value="—" icon={GraduationCap} loading={loading}/><SummaryCard label="Companies" value="—" icon={Building2} loading={loading}/><SummaryCard label="Active drives" value="—" icon={CalendarDays} loading={loading}/><SummaryCard label="Placements" value="—" icon={BarChart3} loading={loading}/></div>{error?<AdminUnavailableState title="Dashboard data unavailable" message={error} onRetry={load}/>:null}<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['/admin/users','User management','Review registered users and roles'],['/admin/companies','Company management','Review companies and recruiters'],['/admin/reports','Reports','Review supported placement statistics'],['/admin/settings','Settings','Review supported application settings']].map(([href,label,description])=><Link key={href} href={href} className="rounded-[12px] border border-border bg-card p-4 shadow-sm hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><p className="font-semibold">{label}</p><p className="mt-1 text-sm text-secondary-text">{description}</p></Link>)}</div></div></AdminShell>;
}
