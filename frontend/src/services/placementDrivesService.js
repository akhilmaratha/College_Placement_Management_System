/**
 * The Spring Boot backend does not currently expose placement drive endpoints.
 */

export class PlacementDrivesServiceError extends Error {
  constructor(message, { code = "PLACEMENT_DRIVES_ERROR" } = {}) {
    super(message);
    this.name = "PlacementDrivesServiceError";
    this.code = code;
  }
}

/**
 * Loads placement drives for the Placement Drives management page.
 * @returns {Promise<typeof PLACEMENT_DRIVES_MOCK>}
 */
export async function fetchPlacementDrives() {
  throw new PlacementDrivesServiceError(
    "Placement drives are unavailable because the backend does not expose placement officer drive endpoints yet.",
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
