import { getApiBaseUrl } from "@/lib/api";

export class PlacementDrivesServiceError extends Error {
  constructor(message, { status = null } = {}) { super(message); this.name = "PlacementDrivesServiceError"; this.status = status; }
}
async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store", ...options }); }
  catch { throw new PlacementDrivesServiceError("Could not reach the placement drives service."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new PlacementDrivesServiceError(body.error ?? `Placement drive request failed (${response.status}).`, { status: response.status });
  return body;
}
function toPayload(values) { return { title: values.title.trim(), academicYear: values.academicYear.trim(), startDate: values.startDate, endDate: values.endDate, registrationDeadline: new Date(values.registrationDeadline).toISOString(), driveMode: values.driveMode }; }
export async function fetchPlacementDrives({ q = "", status = "", page = 0, size = 20 } = {}) { const p = new URLSearchParams({ page: String(page), size: String(size) }); if (q.trim()) p.set("q", q.trim()); if (status) p.set("status", status); return request(`/api/drives?${p}`); }
export function createPlacementDrive(values) { return request("/api/drives", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toPayload(values)) }); }
export function updatePlacementDrive(id, values) { return request(`/api/drives/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toPayload(values)) }); }
export function updatePlacementDriveStatus(id, status) { return request(`/api/drives/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); }
