/**
 * Recruiter dashboard data access.
 *
 * TODO: Wire to backend recruiter overview endpoints when the API contract exists.
 * Until then, returns isolated demo UI data — not a confirmed contract.
 */

export class RecruiterDashboardServiceError extends Error {
  constructor(message, { code = "RECRUITER_DASHBOARD_ERROR" } = {}) {
    super(message);
    this.name = "RecruiterDashboardServiceError";
    this.code = code;
  }
}

/**
 * Loads overview data for the recruiter dashboard.
 * @returns {Promise<typeof RECRUITER_DASHBOARD_MOCK>}
 */
export async function fetchRecruiterDashboard() {
  throw new RecruiterDashboardServiceError(
    "Recruiter dashboard data is unavailable because the backend recruiter dashboard endpoint has not been implemented yet.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}
