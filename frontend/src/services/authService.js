import { getApiBaseUrl } from "@/lib/api";

export class AuthServiceError extends Error {
  constructor(message, { code = "AUTH_ERROR", status = null } = {}) {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
    this.status = status;
  }
}

export const ROLES = { STUDENT: "STUDENT", RECRUITER: "RECRUITER", PLACEMENT_OFFICER: "PLACEMENT_OFFICER", ADMIN: "ADMIN" };

export function getDashboardPathForRole(role) {
  const normalized = String(role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  switch (normalized) {
    case ROLES.STUDENT: return "/student/dashboard";
    case ROLES.RECRUITER: return "/recruiter/dashboard";
    case ROLES.PLACEMENT_OFFICER: return "/placement-officer/dashboard";
    case ROLES.ADMIN: return "/admin/dashboard";
    default: return "/login";
  }
}

export async function getCurrentUser() {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, { credentials: "include", cache: "no-store" });
  if (response.status === 401) return null;
  if (!response.ok) throw new AuthServiceError("Unable to restore the current session.", { status: response.status });
  return response.json();
}

export async function logout() {
  await fetch(`${getApiBaseUrl()}/api/auth/logout`, { method: "POST", credentials: "include" });
}

export async function login(credentials) {
  const email = credentials?.email?.trim() ?? "";
  const password = credentials?.password ?? "";
  if (!email || !password) throw new AuthServiceError("Email and password are required.", { code: "VALIDATION_ERROR" });
  const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new AuthServiceError(body.error ?? "Unable to sign in.", { code: "AUTH_ERROR", status: response.status });
  return body;
}

export async function requestPasswordReset(payload) {
  const email = payload?.email?.trim() ?? "";
  if (!email) throw new AuthServiceError("Email is required.", { code: "VALIDATION_ERROR" });
  throw new AuthServiceError("Password recovery is not available until a reset-token workflow is implemented.", { code: "AUTH_NOT_READY" });
}
