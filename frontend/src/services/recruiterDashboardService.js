/**
 * Recruiter dashboard data access.
 *
 * TODO: Wire to backend recruiter overview endpoints when the API contract exists.
 * Until then, returns isolated demo UI data — not a confirmed contract.
 */

import { RECRUITER_DASHBOARD_MOCK } from "@/features/recruiter-dashboard/data/recruiterDashboardMockData";

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
  // Brief delay so loading UI is observable while APIs are unavailable.
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend recruiter dashboard APIs are not connected yet.
  // Return demo UI data only — never invent a production response shape.
  return structuredClone(RECRUITER_DASHBOARD_MOCK);
}
