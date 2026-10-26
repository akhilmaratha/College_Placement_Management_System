"use client";
import { useCallback, useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import AdminUnavailableState from "@/components/admin/AdminUnavailableState";
import { fetchAdminReports } from "@/services/adminReportsService";
export default function AdminReportsView() {
  const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const load=useCallback(async()=>{setLoading(true);setError("");try{await fetchAdminReports();}catch(err){setError(err?.message??"Unable to load reports.");}finally{setLoading(false);}},[]);
  useEffect(()=>{const timer=setTimeout(load,0);return()=>clearTimeout(timer);},[load]);
  return <AdminShell title="Reports" breadcrumb="Admin / Reports"><div className="mx-auto flex w-full max-w-6xl flex-col gap-6"><div><h2 className="text-2xl font-semibold tracking-tight">Placement reports</h2><p className="mt-1 text-sm text-secondary-text sm:text-base">Review supported student, company, application, and placement outcomes.</p></div><button type="button" disabled className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-border px-4 py-2.5 text-sm font-semibold text-secondary-text opacity-50"><Download className="h-4 w-4" aria-hidden="true"/>Export CSV</button>{loading?<div className="h-40 animate-pulse rounded-[12px] border border-border bg-card" aria-label="Loading reports"/>:null}{!loading&&error?<AdminUnavailableState title="Reports unavailable" message={error} onRetry={load}/>:null}<div className="rounded-[12px] border border-border bg-card p-5 text-sm text-secondary-text shadow-sm"><FileText className="mb-3 h-5 w-5 text-primary" aria-hidden="true"/>Filters, charts, tables, and export remain disabled until report data endpoints are available.</div></div></AdminShell>;
}
