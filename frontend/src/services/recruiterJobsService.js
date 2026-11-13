import { getApiBaseUrl } from "@/lib/api";

export class RecruiterJobsServiceError extends Error {
  constructor(message, { status = null } = {}) { super(message); this.name = "RecruiterJobsServiceError"; this.status = status; }
}

async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store", ...options }); }
  catch { throw new RecruiterJobsServiceError("Could not reach the jobs service."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new RecruiterJobsServiceError(body.error ?? `Jobs request failed (${response.status}).`, { status: response.status });
  return body;
}

function mapJob(job) {
  return { ...job, company: job.companyName, salary: job.salaryText, eligibility: job.allowedBranches,
    skills: (job.skills ?? []).join(", "), deadline: job.applicationDeadline?.slice(0, 10) ?? "" };
}
function toRequest(values) {
  const date = values.deadline ? new Date(`${values.deadline}T23:59:59+05:30`).toISOString() : null;
  return { title: values.title, description: values.description, location: values.location, jobType: values.jobType,
    salaryText: values.salary || null, allowedBranches: values.eligibility, minCgpa: values.minCgpa ? Number(values.minCgpa) : 0,
    maxActiveBacklogs: 0, batchYear: null, applicationDeadline: date,
    skills: String(values.skills ?? "").split(",").map(s => s.trim()).filter(Boolean) };
}

export async function fetchRecruiterJobs({ q = "", status = "", page = 0, size = 20 } = {}) {
  const recruiter = await request("/api/recruiters/me");
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (q.trim()) params.set("q", q.trim()); if (status) params.set("status", status);
  const result = await request(`/api/jobs?${params}`);
  return { recruiter: { ...recruiter, company: recruiter.companyName }, ...result, content: result.content.map(mapJob), jobs: result.content.map(mapJob) };
}

export async function createRecruiterJob(values) { return mapJob(await request("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toRequest(values)) })); }
export async function updateRecruiterJob(id, values) { return mapJob(await request(`/api/jobs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toRequest(values)) })); }
export function setRecruiterJobStatus(id, status) { return request(`/api/jobs/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).then(mapJob); }
export function closeRecruiterJob(id) { return setRecruiterJobStatus(id, "Closed"); }
