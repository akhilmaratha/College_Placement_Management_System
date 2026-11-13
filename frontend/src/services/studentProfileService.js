import { getApiBaseUrl } from "@/lib/api";

export class StudentProfileServiceError extends Error {
  constructor(message, { code = "PROFILE_ERROR", status = null } = {}) { super(message); this.name = "StudentProfileServiceError"; this.code = code; this.status = status; }
}

async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store", ...options }); }
  catch { throw new StudentProfileServiceError("Could not reach the student profile service.", { code: "NETWORK_ERROR" }); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new StudentProfileServiceError(body.error ?? `Student profile request failed (${response.status}).`, { status: response.status });
  return body;
}

export function fetchStudentProfile() { return request("/api/students/me"); }
export function updateStudentProfile(payload) { return request("/api/students/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); }
