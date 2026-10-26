/**
 * Placement officer dashboard data access.
 *
 * The Spring Boot backend does not currently expose a placement dashboard endpoint.
 */

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
  throw new PlacementDashboardServiceError(
    "Placement dashboard data is unavailable because the backend does not expose a placement officer dashboard endpoint yet.",
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
