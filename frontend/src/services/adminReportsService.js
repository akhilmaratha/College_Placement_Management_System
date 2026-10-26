/**
 * Admin placement reports data access.
 *
 * The Spring Boot backend does not currently expose admin report endpoints.
 */

export class AdminReportsServiceError extends Error {
  constructor(message, { code = "ADMIN_REPORTS_ERROR" } = {}) {
    super(message);
    this.name = "AdminReportsServiceError";
    this.code = code;
  }
}

/**
 * Loads overview data for the admin Placement Reports page.
 * @returns {Promise<typeof ADMIN_REPORTS_MOCK>}
 */
export async function fetchAdminReports() {
  throw new AdminReportsServiceError(
    "Placement reports are unavailable because the backend does not expose admin report endpoints yet.",
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
