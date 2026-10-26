"use client";
import { useCallback,useEffect,useState } from "react";
import { Settings2 } from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import AdminUnavailableState from "@/components/admin/AdminUnavailableState";
import { fetchAdminSettings } from "@/services/adminSettingsService";
export default function AdminSettingsView() {
  const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const load=useCallback(async()=>{setLoading(true);setError("");try{await fetchAdminSettings();}catch(err){setError(err?.message??"Unable to load admin settings.");}finally{setLoading(false);}},[]);
  useEffect(()=>{const timer=setTimeout(load,0);return()=>clearTimeout(timer);},[load]);
  return <AdminShell title="Settings" breadcrumb="Admin / Settings"><div className="mx-auto flex w-full max-w-4xl flex-col gap-6"><div><h2 className="text-2xl font-semibold tracking-tight">Settings</h2><p className="mt-1 text-sm text-secondary-text sm:text-base">Review application settings and administrator profile options supported by the backend.</p></div>{loading?<div className="h-40 animate-pulse rounded-[12px] border border-border bg-card" aria-label="Loading settings"/>:null}{!loading&&error?<AdminUnavailableState title="Settings unavailable" message={error} onRetry={load}/>:null}<div className="rounded-[12px] border border-border bg-card p-5 text-sm text-secondary-text shadow-sm"><Settings2 className="mb-3 h-5 w-5 text-primary" aria-hidden="true"/>Profile updates, password changes, and application settings remain unavailable until authorized backend endpoints are implemented.</div></div></AdminShell>;
}
