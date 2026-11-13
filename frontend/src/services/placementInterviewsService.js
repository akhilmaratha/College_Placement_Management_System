import { getApiBaseUrl } from "@/lib/api";

async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store", ...options }); }
  catch { throw new Error("Could not reach the interview service."); }
  const body = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error ?? `Interview request failed (${response.status}).`);
  return body;
}

export function fetchPlacementInterviews() { return request("/api/interviews"); }
export function fetchInterviewApplications() { return request("/api/placement/applications"); }
export function scheduleInterview(payload) { return request("/api/interviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); }
export function updateInterview(id, payload) { return request(`/api/interviews/${encodeURIComponent(id)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); }
export function updateInterviewStatus(id, payload) { return request(`/api/interviews/${encodeURIComponent(id)}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); }
export function cancelInterview(id) { return request(`/api/interviews/${encodeURIComponent(id)}`, { method: "DELETE" }); }
