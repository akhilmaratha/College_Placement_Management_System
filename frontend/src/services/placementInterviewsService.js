/**
 * The Spring Boot backend does not currently expose interview endpoints.
 */

export class PlacementInterviewsServiceError extends Error {
  constructor(message, { code = "PLACEMENT_INTERVIEWS_ERROR" } = {}) {
    super(message);
    this.name = "PlacementInterviewsServiceError";
    this.code = code;
  }
}

/**
 * Loads interviews for the Placement Officer Interviews management page.
 * @returns {Promise<typeof PLACEMENT_INTERVIEWS_MOCK>}
 */
export async function fetchPlacementInterviews() {
  throw new PlacementInterviewsServiceError(
    "Interviews are unavailable because the backend does not expose placement officer interview endpoints yet.",
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
