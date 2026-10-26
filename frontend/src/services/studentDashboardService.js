/**
 * Student dashboard data access.
 *
 * TODO: Wire to backend placement endpoints when the API contract exists.
 * Until then, returns isolated sample UI data — not a confirmed contract.
 */

export class StudentDashboardServiceError extends Error {
  constructor(message, { code = "DASHBOARD_ERROR" } = {}) {
    super(message);
    this.name = "StudentDashboardServiceError";
    this.code = code;
  }
}

/**
 * Loads overview data for the student dashboard.
 * @returns {Promise<typeof STUDENT_DASHBOARD_SAMPLE>}
 */
export async function fetchStudentDashboard() {
  throw new StudentDashboardServiceError(
    "Your dashboard data is unavailable because the backend student dashboard endpoint has not been implemented yet.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}
