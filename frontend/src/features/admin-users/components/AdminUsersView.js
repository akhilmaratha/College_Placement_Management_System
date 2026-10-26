"use client";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import AdminUnavailableState from "@/components/admin/AdminUnavailableState";
import { fetchAdminUsers } from "@/services/adminUsersService";

export default function AdminUsersView() {
  const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [search, setSearch] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); try { await fetchAdminUsers(); } catch (err) { setError(err?.message ?? "Unable to load users."); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);
  return <AdminShell title="User Management" breadcrumb="Admin / Users"><div className="mx-auto flex w-full max-w-6xl flex-col gap-6"><div><h2 className="text-2xl font-semibold tracking-tight">User management</h2><p className="mt-1 text-sm text-secondary-text sm:text-base">Search registered users, roles, account status, and supported profile details.</p></div><section className="rounded-[12px] border border-border bg-card p-4 shadow-sm"><label className="block max-w-xl text-sm"><span className="mb-1.5 block font-medium">Search users</span><span className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" aria-hidden="true"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Name or email" className="w-full rounded-[10px] border border-border bg-white py-2.5 pl-9 pr-3 outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"/></span></label><p className="mt-3 text-xs text-secondary-text">Role filters, status filters, pagination, details, and mutations will be enabled when admin user APIs are available.</p></section>{loading ? <div className="h-40 animate-pulse rounded-[12px] border border-border bg-card" aria-label="Loading users"/> : null}{!loading && error ? <AdminUnavailableState title="Users unavailable" message={error} onRetry={load}/> : null}</div></AdminShell>;
}
