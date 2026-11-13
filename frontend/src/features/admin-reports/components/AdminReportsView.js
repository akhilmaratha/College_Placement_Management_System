"use client";

import { useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import AdminUnavailableState from "@/components/admin/AdminUnavailableState";
import SummaryCard from "@/components/ui/SummaryCard";
import { fetchPlacementSummary, fetchApplicationReport, fetchCompanyReport, fetchJobReport, fetchDriveReport, fetchInterviewReport } from "@/services/adminReportsService";

const tabs = [{id:"applications",label:"Applications"},{id:"companies",label:"Companies"},{id:"jobs",label:"Jobs"},{id:"drives",label:"Drives"},{id:"interviews",label:"Interviews"}];
const formatDate = value => value ? new Intl.DateTimeFormat("en-IN", { dateStyle:"medium", ...(String(value).includes("T") ? {timeStyle:"short"} : {}) }).format(new Date(value)) : "—";
const columns = {
  applications:[["Student","studentName"],["Job","jobTitle"],["Company","companyName"],["Status","status"],["Applied","appliedAt"]],
  companies:[["Company","companyName"],["Jobs","jobCount"],["Applications","applicationCount"],["Shortlisted","shortlistedCount"],["Selected","selectedCount"]],
  jobs:[["Job","jobTitle"],["Company","companyName"],["Applications","applicationCount"],["Shortlisted","shortlistedCount"],["Selected","selectedCount"]],
  drives:[["Drive","title"],["Academic year","academicYear"],["Start date","startDate"],["Status","status"],["Jobs","jobCount"],["Applications","applicationCount"],["Shortlisted","shortlistedCount"],["Selected","selectedCount"]],
  interviews:[["Student","studentName"],["Job","jobTitle"],["Company","companyName"],["Round","roundName"],["Scheduled","scheduledAt"],["Status","status"],["Result","result"]],
};
const endpoints={applications:fetchApplicationReport,companies:fetchCompanyReport,jobs:fetchJobReport,drives:fetchDriveReport,interviews:fetchInterviewReport};
const metric=(value,error)=>value??(error?"—":0);

export default function AdminReportsView() {
  const [report,setReport]=useState("applications");
  const [draft,setDraft]=useState({from:"",to:"",companyId:"",jobId:"",status:""});
  const [filters,setFilters]=useState({}); const [pageNumber,setPageNumber]=useState(0);
  const [page,setPage]=useState(null); const [summary,setSummary]=useState(null); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const load=useCallback(async()=>{setLoading(true);setError("");try{const params={...filters,page:pageNumber,size:20};const [totals,rows]=await Promise.all([fetchPlacementSummary(filters),endpoints[report](params)]);setSummary(totals);setPage(rows);}catch(e){setSummary(null);setPage(null);setError(e.message??"Unable to load reports.");}finally{setLoading(false);}},[filters,pageNumber,report]);
  useEffect(()=>{const timer=setTimeout(load,0);return()=>clearTimeout(timer);},[load]);
  function apply(e){e.preventDefault();const relevant=report==="applications"||report==="interviews"?draft:report==="jobs"?{from:draft.from,to:draft.to,companyId:draft.companyId}:{from:draft.from,to:draft.to};setFilters(Object.fromEntries(Object.entries(relevant).filter(([,v])=>v!=="")));setPageNumber(0);}
  function exportCsv(){if(!page?.content?.length)return;const fields=columns[report];const quote=v=>`"${String(v??"").replaceAll('"','""')}"`;const csv=[fields.map(([label])=>quote(label)).join(","),...page.content.map(row=>fields.map(([,key])=>quote(row[key])).join(","))].join("\r\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const link=document.createElement("a");link.href=url;link.download=`placement-${report}.csv`;link.click();URL.revokeObjectURL(url);}
  return <AdminShell title="Reports" breadcrumb="Admin / Reports"><main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
    <div><h2 className="text-2xl font-semibold">Placement reports</h2><p className="mt-1 text-sm text-secondary-text">Review database-backed placement statistics and filtered records.</p></div>
    {error?<AdminUnavailableState title="Reports unavailable" message={error} onRetry={load}/>:null}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><SummaryCard label="Students" value={metric(summary?.totalStudents,error)} loading={loading}/><SummaryCard label="Companies" value={metric(summary?.totalCompanies,error)} loading={loading}/><SummaryCard label="Applications in range" value={metric(summary?.applications,error)} loading={loading}/><SummaryCard label="Selected in range" value={metric(summary?.selectedApplications,error)} loading={loading}/><SummaryCard label="Shortlisted in range" value={metric(summary?.shortlistedApplications,error)} loading={loading}/><SummaryCard label="Interviews in range" value={metric(summary?.interviews,error)} loading={loading}/><SummaryCard label="Completed interviews" value={metric(summary?.completedInterviews,error)} loading={loading}/><SummaryCard label="Published jobs" value={metric(summary?.publishedJobs,error)} loading={loading}/></div>
    <nav className="flex flex-wrap gap-2" aria-label="Report type">{tabs.map(t=><button key={t.id} onClick={()=>{setReport(t.id);setPageNumber(0);}} aria-pressed={report===t.id} className={`rounded-lg border px-4 py-2 text-sm font-medium ${report===t.id?"border-primary bg-primary text-white":"border-border bg-card"}`}>{t.label}</button>)}</nav>
    <form onSubmit={apply} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
      <label className="text-sm">From<input type="date" value={draft.from} onChange={e=>setDraft({...draft,from:e.target.value})} className="mt-1 w-full rounded border border-border p-2"/></label>
      <label className="text-sm">To<input type="date" value={draft.to} onChange={e=>setDraft({...draft,to:e.target.value})} className="mt-1 w-full rounded border border-border p-2"/></label>
      {["applications","jobs","interviews"].includes(report)?<label className="text-sm">Company ID<input type="number" min="1" value={draft.companyId} onChange={e=>setDraft({...draft,companyId:e.target.value})} placeholder="Any company" className="mt-1 w-full rounded border border-border p-2"/></label>:null}
      {["applications","interviews"].includes(report)?<label className="text-sm">Job ID<input type="number" min="1" value={draft.jobId} onChange={e=>setDraft({...draft,jobId:e.target.value})} placeholder="Any job" className="mt-1 w-full rounded border border-border p-2"/></label>:null}
      {["applications","interviews"].includes(report)?<label className="text-sm">Status<select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value})} className="mt-1 w-full rounded border border-border p-2"><option value="">All statuses</option>{(report==="applications"?["Applied","Shortlisted","Interview Scheduled","Selected","Rejected"]:["Scheduled","Completed","Rescheduled","Cancelled","No Show"]).map(x=><option key={x}>{x}</option>)}</select></label>:null}
      <div className="flex items-end gap-2"><button className="rounded-lg bg-primary px-4 py-2 font-medium text-white">Apply filters</button><button type="button" onClick={exportCsv} disabled={!page?.content?.length} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50"><Download className="h-4 w-4"/>Export page</button></div>
    </form>
    <div className="overflow-x-auto rounded-xl border border-border bg-card">{loading?<div className="p-10 text-center text-sm text-secondary-text" role="status">Loading report…</div>:page?.content?.length?<table className="w-full text-left text-sm"><thead className="bg-background"><tr>{columns[report].map(([label])=><th key={label} className="p-3">{label}</th>)}</tr></thead><tbody>{page.content.map((row,index)=><tr key={row.id??row.companyId??row.jobId??row.driveId??`${report}-${index}`} className="border-t border-border">{columns[report].map(([,key])=><td key={key} className="p-3">{["appliedAt","scheduledAt","startDate"].includes(key)?formatDate(row[key]):row[key]??"—"}</td>)}</tr>)}</tbody></table>:<p className="p-10 text-center text-sm text-secondary-text">No {report} records match these filters.</p>}</div>
    <div className="flex items-center justify-between text-sm text-secondary-text"><span>{page?.totalElements??0} records · page {(page?.number??0)+1} of {Math.max(page?.totalPages??0,1)}</span><div className="flex gap-2"><button disabled={!page||page.first||loading} onClick={()=>setPageNumber(n=>n-1)} className="rounded border border-border px-3 py-1.5 disabled:opacity-50">Previous</button><button disabled={!page||page.last||loading} onClick={()=>setPageNumber(n=>n+1)} className="rounded border border-border px-3 py-1.5 disabled:opacity-50">Next</button></div></div>
  </main></AdminShell>;
}
