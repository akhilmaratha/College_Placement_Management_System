/**
 * Student dashboard data access.
 *
 * TODO: Wire to backend placement endpoints when the API contract exists.
 * Until then, returns isolated sample UI data — not a confirmed contract.
 */

import { STUDENT_DASHBOARD_SAMPLE } from "@/features/student-dashboard/data/studentDashboardSampleData";

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
  // Brief delay so loading UI is observable while APIs are unavailable.
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend placement APIs are not connected yet.
  // Return sample UI data only — never invent a production response shape.
  return structuredClone(STUDENT_DASHBOARD_SAMPLE);
}
