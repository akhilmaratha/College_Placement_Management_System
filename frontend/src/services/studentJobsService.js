import { getApiBaseUrl } from "@/lib/api";

export class StudentJobsServiceError extends Error {
  constructor(message, { status = null } = {}) { super(message); this.name = "StudentJobsServiceError"; this.status = status; }
}

async function request(path) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store" }); }
  catch { throw new StudentJobsServiceError("Could not reach the jobs service."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new StudentJobsServiceError(body.error ?? `Jobs request failed (${response.status}).`, { status: response.status });
  return body;
}

function mapJob(job) {
  return { ...job, company: job.companyName, jobType: job.jobType, deadline: job.applicationDeadline,
    eligibility: job.allowedBranches, salary: job.salaryText, skills: (job.skills ?? []).join(", ") };
}

export async function fetchStudentJobs({ q = "", location = "", jobType = "", companyId, deadlineFrom, deadlineTo, page = 0, size = 12 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  for (const [key, value] of Object.entries({ q, location, jobType, companyId, deadlineFrom, deadlineTo })) if (value) params.set(key, String(value));
  const result = await request(`/api/jobs?${params}`);
  return { ...result, content: result.content.map(mapJob) };
}

export async function fetchStudentJob(id) { return mapJob(await request(`/api/jobs/${encodeURIComponent(id)}`)); }
