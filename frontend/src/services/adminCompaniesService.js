import { getApiBaseUrl } from "@/lib/api";

export class AdminCompaniesServiceError extends Error {
  constructor(message, { status = null } = {}) { super(message); this.name = "AdminCompaniesServiceError"; this.status = status; }
}

async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store", ...options }); }
  catch { throw new AdminCompaniesServiceError("Could not reach the company management service."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new AdminCompaniesServiceError(body.error ?? `Company request failed (${response.status}).`, { status: response.status });
  return body;
}

export async function fetchAdminCompanies({ q = "", page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (q.trim()) params.set("q", q.trim());
  return request(`/api/companies?${params}`);
}
export function createCompany(payload) { return request("/api/companies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); }
export function updateCompany(id, payload) { return request(`/api/companies/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); }
export function updateCompanyStatus(id, verificationStatus) { return request(`/api/companies/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ verificationStatus }) }); }
export async function fetchAdminRecruiters({ q = "", page = 0, size = 50 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (q.trim()) params.set("q", q.trim());
  return request(`/api/recruiters?${params}`);
}
export function assignRecruiterCompany(id, companyId) { return request(`/api/recruiters/${id}/company`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ companyId }) }); }
