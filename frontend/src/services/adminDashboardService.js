/**
 * Admin dashboard data access.
 *
 * TODO: Wire to backend admin placement endpoints when the API contract exists.
 * Until then, returns isolated demo UI data — not a confirmed contract.
 */

import { ADMIN_DASHBOARD_MOCK } from "@/features/admin-dashboard/data/adminDashboardMockData";

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
  // Brief delay so loading UI is observable while APIs are unavailable.
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend admin placement APIs are not connected yet.
  // Return demo UI data only — never invent a production response shape.
  return structuredClone(ADMIN_DASHBOARD_MOCK);
}
