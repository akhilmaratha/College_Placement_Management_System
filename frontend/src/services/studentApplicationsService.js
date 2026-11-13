import { getApiBaseUrl } from "@/lib/api";

async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store", ...options }); }
  catch { throw new Error("Could not reach the applications service."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `Application request failed (${response.status}).`);
  return body;
}

export function fetchStudentApplications() { return request("/api/applications/me"); }
export function fetchEligibility(jobId) { return request(`/api/jobs/${encodeURIComponent(jobId)}/eligibility`); }
export function applyToJob(jobId) { return request(`/api/jobs/${encodeURIComponent(jobId)}/applications`, { method: "POST" }); }
