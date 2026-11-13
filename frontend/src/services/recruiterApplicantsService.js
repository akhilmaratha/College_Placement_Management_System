import { getApiBaseUrl } from "@/lib/api";

async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store", ...options }); }
  catch { throw new Error("Could not reach the applicants service."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `Applicants request failed (${response.status}).`);
  return body;
}
export async function fetchRecruiterApplicants() {
  const applications = await request("/api/recruiter/applications");
  return { applicants: applications.map(a => ({ id: a.id, jobId: String(a.jobId), jobTitle: a.jobTitle, studentName: a.studentName, email: a.studentEmail, status: a.status, appliedAt: a.appliedAt })), jobOpenings: [...new Map(applications.map(a => [a.jobId, { id: String(a.jobId), title: a.jobTitle }])).values()] };
}
export function updateRecruiterApplicantStatus(id, status) {
  return request(`/api/recruiter/applications/${encodeURIComponent(id)}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
}
