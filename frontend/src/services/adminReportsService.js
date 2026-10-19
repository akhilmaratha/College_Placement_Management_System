/**
 * Admin placement reports data access.
 *
 * TODO: Wire to backend admin report endpoints when the API contract exists.
 * Until then, returns isolated demo UI data — not a confirmed contract.
 */

import { ADMIN_REPORTS_MOCK } from "@/features/admin-reports/data/adminReportsMockData";

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
  // Brief delay so loading UI is observable while APIs are unavailable.
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend admin report APIs are not connected yet.
  // Return demo UI data only — never invent a production response shape.
  return structuredClone(ADMIN_REPORTS_MOCK);
}
