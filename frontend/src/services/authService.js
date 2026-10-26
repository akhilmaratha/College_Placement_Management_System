/**
 * Auth service — login, password recovery, and session entry points for CampusPlacements.
 *
 * The backend currently has no authentication controller or agreed API contract.
 * Keep these entry points fail-closed until those endpoints are implemented.
 * Do not store passwords in localStorage or sessionStorage.
 * Remember-email only is handled in the login form UI.
 */

export class AuthServiceError extends Error {
  constructor(message, { code = "AUTH_ERROR", status = null } = {}) {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
    this.status = status;
  }
}

/** Canonical role values expected once auth/RBAC is connected. */
export const ROLES = {
  STUDENT: "STUDENT",
  RECRUITER: "RECRUITER",
  PLACEMENT_OFFICER: "PLACEMENT_OFFICER",
  ADMIN: "ADMIN",
};

/**
 * Maps an authenticated role to its primary dashboard route.
 *
 * @param {string | null | undefined} role
 * @returns {string}
 */
export function getDashboardPathForRole(role) {
  const normalized = String(role ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  switch (normalized) {
    case ROLES.STUDENT:
      return "/student/dashboard";
    case ROLES.RECRUITER:
      return "/recruiter/dashboard";
    case ROLES.PLACEMENT_OFFICER:
      return "/placement/dashboard";
    case ROLES.ADMIN:
      return "/admin/dashboard";
    default:
      return "/login";
  }
}

/**
 * Returns the current session user when auth is connected.
 *
 * @returns {Promise<null | {
 *   id: string,
 *   name: string,
 *   email?: string,
 *   role: string,
 *   avatarUrl?: string | null,
 *   initials?: string,
 * }>}
 */
export async function getCurrentUser() {
  // Session lookup is not available until authentication is wired.
  // Always return null — never invent a logged-in user for the UI.
  return null;
}

/**
 * Clears the current session when auth is connected.
 *
 * @returns {Promise<void>}
 */
export async function logout() {
  // TODO: Invalidate token/session via the backend and clear client auth state.
}

/**
 * Attempts to sign a user in.
 *
 * @param {{ email: string, password: string, rememberMe?: boolean }} credentials
 * @returns {Promise<never>}
 */
export async function login(credentials) {
  const email = credentials?.email?.trim() ?? "";
  const password = credentials?.password ?? "";

  if (!email || !password) {
    throw new AuthServiceError("Email and password are required.", {
      code: "VALIDATION_ERROR",
    });
  }

  throw new AuthServiceError(
    "Sign-in is unavailable because the backend authentication endpoint is not implemented yet. Please try again later.",
    { code: "AUTH_NOT_READY" },
  );
}

/**
 * Requests password-reset instructions for a registered email.
 *
 * @param {{ email: string }} payload
 * @returns {Promise<never>}
 */
export async function requestPasswordReset(payload) {
  const email = payload?.email?.trim() ?? "";

  if (!email) {
    throw new AuthServiceError("Email is required.", {
      code: "VALIDATION_ERROR",
    });
  }

  throw new AuthServiceError(
    "Password recovery is unavailable because the backend reset endpoint is not implemented yet. Please try again later.",
    { code: "AUTH_NOT_READY" },
  );
}
