/**
 * Admin dashboard data access.
 *
 * The Spring Boot backend does not currently expose admin dashboard endpoints.
 */

export class AdminDashboardServiceError extends Error {
  constructor(message, { code = "ADMIN_DASHBOARD_ERROR" } = {}) {
    super(message);
    this.name = "AdminDashboardServiceError";
    this.code = code;
  }
}

/**
 * Loads overview data for the admin dashboard.
 * @returns {Promise<typeof ADMIN_DASHBOARD_MOCK>}
 */
export async function fetchAdminDashboard() {
  throw new AdminDashboardServiceError(
    "Admin dashboard data is unavailable because the backend does not expose admin dashboard endpoints yet.",
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
