/**
 * Placement officer student management data access.
 *
 * TODO: Wire to backend placement student endpoints when the API contract exists.
 * Until then, returns isolated demo UI data — not a confirmed contract.
 * No create/update/delete helpers: inventing persistence would mislead operators.
 */

import { PLACEMENT_STUDENTS_MOCK } from "@/features/placement-students/data/placementStudentsMockData";

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
  // Brief delay so loading UI is observable while APIs are unavailable.
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend placement student APIs are not connected yet.
  // Return demo UI data only — never invent a production response shape.
  return structuredClone(PLACEMENT_STUDENTS_MOCK);
}
