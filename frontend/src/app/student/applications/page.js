"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import StudentShell from "@/components/layout/StudentShell";
import StatusBadge from "@/components/ui/StatusBadge";
import { fetchStudentApplications } from "@/services/studentApplicationsService";

export default function StudentApplicationsPage() {
  const [items, setItems] = useState([]); const [query, setQuery] = useState(""); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = async () => { setLoading(true); setError(""); try { setItems(await fetchStudentApplications()); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => items.filter(a => `${a.jobTitle} ${a.companyName} ${a.status}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  return <StudentShell title="My Applications" breadcrumb="Student / My Applications"><main className="mx-auto flex w-full max-w-6xl flex-col gap-6"><div><h2 className="text-2xl font-semibold">My Applications</h2><p className="mt-1 text-sm text-secondary-text">Track your submitted applications and their current status.</p></div><label className="relative block max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by job, company, or status" className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm"/></label>{error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error} <button onClick={load} className="ml-2 underline">Retry</button></div> : loading ? <p role="status">Loading applications…</p> : filtered.length ? <div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full text-left text-sm"><thead className="bg-background"><tr><th className="p-4">Position</th><th className="p-4">Company</th><th className="p-4">Applied</th><th className="p-4">Status</th></tr></thead><tbody>{filtered.map(a => <tr key={a.id} className="border-t border-border"><td className="p-4"><Link className="font-medium text-primary hover:underline" href={`/student/jobs/${a.jobId}`}>{a.jobTitle}</Link></td><td className="p-4">{a.companyName}</td><td className="p-4">{new Date(a.appliedAt).toLocaleDateString("en-IN")}</td><td className="p-4"><StatusBadge status={a.status}/></td></tr>)}</tbody></table></div> : <div className="rounded-xl border border-border bg-card p-10 text-center"><p className="font-medium">{query ? "No matching applications" : "No applications yet"}</p><Link href="/student/jobs" className="mt-3 inline-block text-sm text-primary hover:underline">Browse open jobs</Link></div>}</main></StudentShell>;
}
