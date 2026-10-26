/**
 * Placement officer student management data access.
 *
 * The Spring Boot backend does not currently expose placement student endpoints.
 */

export class PlacementStudentsServiceError extends Error {
  constructor(message, { code = "PLACEMENT_STUDENTS_ERROR" } = {}) {
    super(message);
    this.name = "PlacementStudentsServiceError";
    this.code = code;
  }
}

/**
 * Loads students for the placement officer Student Management page.
 * @returns {Promise<typeof PLACEMENT_STUDENTS_MOCK>}
 */
export async function fetchPlacementStudents() {
  throw new PlacementStudentsServiceError(
    "Student data is unavailable because the backend does not expose a placement officer student endpoint yet.",
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
