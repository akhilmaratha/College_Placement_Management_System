"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BarChart3, Building2, CalendarClock, CalendarDays, ClipboardList, GraduationCap, Users, BriefcaseBusiness } from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import AdminUnavailableState from "@/components/admin/AdminUnavailableState";
import SummaryCard from "@/components/ui/SummaryCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { fetchAdminDashboard } from "@/services/adminDashboardService";

const date = value => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", ...(String(value).includes("T") ? { timeStyle: "short" } : {}) }).format(new Date(value)) : "—";
const count = (value, error) => value ?? (error ? "—" : 0);
function Panel({ title, href, label, children }) { return <section className="rounded-xl border border-border bg-card"><header className="flex items-center justify-between border-b border-border p-4"><h3 className="font-semibold">{title}</h3><Link href={href} className="text-sm text-primary hover:underline">{label}</Link></header>{children}</section>; }

export default function AdminDashboardView() {
  const [data,setData]=useState(null); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const load=useCallback(async()=>{setLoading(true);setError("");try{setData(await fetchAdminDashboard());}catch(e){setError(e.message??"Unable to load admin dashboard.");}finally{setLoading(false);}},[]);
  useEffect(()=>{const timer=setTimeout(load,0);return()=>clearTimeout(timer);},[load]); const s=data?.summary;
  return <AdminShell title="Admin Dashboard" breadcrumb="Admin / Overview"><main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
    <div><h2 className="text-2xl font-semibold">Administration overview</h2><p className="mt-1 text-sm text-secondary-text">System-wide placement activity and recent records.</p></div>
    {error?<AdminUnavailableState title="Dashboard data unavailable" message={error} onRetry={load}/>:null}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard label="Total users" value={count(s?.totalUsers,error)} icon={Users} loading={loading}/><SummaryCard label="Students" value={count(s?.totalStudents,error)} icon={GraduationCap} loading={loading}/><SummaryCard label="Recruiters" value={count(s?.totalRecruiters,error)} icon={Users} loading={loading}/><SummaryCard label="Companies" value={count(s?.totalCompanies,error)} icon={Building2} loading={loading}/><SummaryCard label="Total jobs" value={count(s?.totalJobs,error)} icon={BriefcaseBusiness} loading={loading}/><SummaryCard label="Active drives" value={count(s?.activeDrives,error)} icon={CalendarDays} loading={loading}/><SummaryCard label="Applications" value={count(s?.totalApplications,error)} icon={ClipboardList} loading={loading}/><SummaryCard label="Selected" value={count(s?.selectedApplications,error)} icon={BarChart3} loading={loading}/><SummaryCard label="Shortlisted" value={count(s?.shortlistedApplications,error)} icon={GraduationCap} loading={loading}/><SummaryCard label="Upcoming interviews" value={count(s?.upcomingInterviews,error)} icon={CalendarClock} loading={loading}/>
    </div>
    {loading?<p role="status" className="text-sm text-secondary-text">Loading administration data…</p>:data?<div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Recent placement activity" href="/admin/applications" label="Applications"><ul className="divide-y divide-border">{data.recentApplications?.length?data.recentApplications.map(a=><li key={a.id} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="truncate font-medium">{a.studentName} · {a.jobTitle}</p><p className="text-sm text-secondary-text">{a.companyName} · {date(a.appliedAt)}</p></div><StatusBadge status={a.status}/></li>):<li className="p-8 text-center text-sm text-secondary-text">No applications yet.</li>}</ul></Panel>
      <Panel title="Upcoming drives" href="/admin/drives" label="Drives"><ul className="divide-y divide-border">{data.upcomingDrives?.length?data.upcomingDrives.map(d=><li key={d.id} className="flex justify-between gap-3 p-4"><div><p className="font-medium">{d.title}</p><p className="text-sm text-secondary-text">{date(d.startDate)} – {date(d.endDate)}</p></div><StatusBadge status={d.status}/></li>):<li className="p-8 text-center text-sm text-secondary-text">No planned drives.</li>}</ul></Panel>
      <Panel title="Upcoming interviews" href="/admin/interviews" label="Interviews"><ul className="divide-y divide-border">{data.upcomingInterviews?.length?data.upcomingInterviews.map(i=><li key={i.id} className="p-4"><p className="font-medium">{i.studentName} · {i.jobTitle}</p><p className="text-sm text-secondary-text">{i.companyName} · {date(i.scheduledAt)}</p></li>):<li className="p-8 text-center text-sm text-secondary-text">No upcoming interviews.</li>}</ul></Panel>
      <Panel title="Recently created accounts" href="/admin/users" label="User management"><ul className="divide-y divide-border">{data.recentUsers?.length?data.recentUsers.map(u=><li key={u.id} className="flex justify-between gap-3 p-4"><div><p className="font-medium">{u.role.replaceAll("_"," ")}</p><p className="text-sm text-secondary-text">Created {date(u.createdAt)}</p></div><StatusBadge status={u.status}/></li>):<li className="p-8 text-center text-sm text-secondary-text">No users found.</li>}</ul></Panel>
    </div>:null}
    <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['/admin/users','User management'],['/admin/companies','Companies'],['/admin/applications','Applications'],['/admin/reports','Reports']].map(([href,label])=><Link key={href} href={href} className="rounded-xl border border-border bg-card p-4 font-semibold hover:border-primary/40">{label}</Link>)}</nav>
  </main></AdminShell>;
}
