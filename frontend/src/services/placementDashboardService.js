/**
 * Placement officer dashboard data access.
 *
 * TODO: Wire to backend placement officer overview endpoints when the API contract exists.
 * Until then, returns isolated demo UI data — not a confirmed contract.
 */

import { PLACEMENT_DASHBOARD_MOCK } from "@/features/placement-dashboard/data/placementDashboardMockData";

export class PlacementDashboardServiceError extends Error {
  constructor(message, { code = "PLACEMENT_DASHBOARD_ERROR" } = {}) {
    super(message);
    this.name = "PlacementDashboardServiceError";
    this.code = code;
  }
}

/**
 * Loads overview data for the placement officer dashboard.
 * @returns {Promise<typeof PLACEMENT_DASHBOARD_MOCK>}
 */
export async function fetchPlacementDashboard() {
  // Brief delay so loading UI is observable while APIs are unavailable.
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend placement officer dashboard APIs are not connected yet.
  // Return demo UI data only — never invent a production response shape.
  return structuredClone(PLACEMENT_DASHBOARD_MOCK);
}
