import { getApiBaseUrl } from "@/lib/api";

export class RecruiterDashboardServiceError extends Error {
  constructor(message, { status = null } = {}) { super(message); this.name = "RecruiterDashboardServiceError"; this.status = status; }
}

async function request(path) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store" }); }
  catch { throw new RecruiterDashboardServiceError("Could not reach recruiter dashboard data."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new RecruiterDashboardServiceError(body.error ?? `Dashboard request failed (${response.status}).`, { status: response.status });
  return body;
}

export async function fetchRecruiterDashboard() {
  const [recruiter, jobs, published] = await Promise.all([
    request("/api/recruiters/me"), request("/api/jobs?page=0&size=5"), request("/api/jobs?status=Published&page=0&size=1"),
  ]);
  return {
    recruiter: { email: recruiter.email, company: recruiter.companyName },
    summary: { totalJobs: jobs.totalElements, publishedJobs: published.totalElements, totalApplicants: "—", interviewsScheduled: "—" },
    recentJobs: jobs.content.map(job => ({ id: job.id, title: job.title, status: job.status, deadline: job.applicationDeadline, applicantCount: null })),
    recentApplicants: [],
  };
}
