import { getApiBaseUrl } from "@/lib/api";

export class PlacementStudentsServiceError extends Error {
  constructor(message, { status = null } = {}) { super(message); this.name = "PlacementStudentsServiceError"; this.status = status; }
}

export async function fetchPlacementStudents({ q = "", page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (q.trim()) params.set("q", q.trim());
  let response;
  try { response = await fetch(`${getApiBaseUrl()}/api/students?${params}`, { credentials: "include", cache: "no-store" }); }
  catch { throw new PlacementStudentsServiceError("Could not reach the student directory service."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new PlacementStudentsServiceError(body.error ?? `Student directory request failed (${response.status}).`, { status: response.status });
  return body;
}
