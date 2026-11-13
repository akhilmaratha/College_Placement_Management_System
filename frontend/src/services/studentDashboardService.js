import { getApiBaseUrl } from "@/lib/api";
export class StudentDashboardServiceError extends Error { constructor(message) { super(message); this.name = "StudentDashboardServiceError"; } }
export async function fetchStudentDashboard() {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}/api/dashboard/student`, { credentials: "include", cache: "no-store" }); }
  catch { throw new StudentDashboardServiceError("Could not reach dashboard data."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new StudentDashboardServiceError(body.error ?? `Dashboard request failed (${response.status}).`);
  return body;
}
